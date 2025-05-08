// service-worker-registration.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('ServiceWorker registered'))
      .catch(err => console.log('ServiceWorker registration failed:', err));
  });
}

// Firebase SDK (gunakan versi yang sesuai, contoh v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, getDocs, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy, where, enablePersistence, CACHE_SIZE_UNLIMITED } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// TODO: Ganti dengan konfigurasi Firebase proyek Anda
const firebaseConfig = {
  apiKey: "AIzaSyB-euXJz9b3HyfvjmG5tzu2wMqvbY3bH5E",
  authDomain: "jadwal-pemakalah-akademik.firebaseapp.com",
  projectId: "jadwal-pemakalah-akademik",
  storageBucket: "jadwal-pemakalah-akademik.firebasestorage.app",
  messagingSenderId: "230646165475",
  appId: "1:230646165475:web:9f0ce777977eb2ddb07ad6",
  measurementId: "G-DF2MZTSJER"
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp); // Dapatkan instance Firestore

// app.js
let dataByClass = {}; // Akan diisi dari Firestore, atau bisa juga tidak digunakan lagi jika struktur data utama adalah array
let allSchedulesFromFirestore = []; // Untuk menyimpan semua jadwal dari Firestore

// Global Elements
const elements = {
  classSelect: document.getElementById("class-select"),
  subjectSelect: document.getElementById("subject-select"),
  nameInput: document.getElementById("search-name"),
  resultsDiv: document.getElementById("results"),
  calendarEl: document.getElementById('calendar'),
  printContainer: document.querySelector('.print-button-container'),
  driveDropdown: document.getElementById("driveDropdown"),
  popup: {
    overlay: document.getElementById('overlay'),
    content: document.getElementById('popup-content'),
    container: document.getElementById('popup')
  },
  pwaPopup: document.getElementById('add-to-home-popup')
};

// Utility Functions
const utils = {
  debounce: (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  formatDate: (dateStr) => {
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const months = ['Januari','Februari','Maret','April','Mei','Juni',
      'Juli','Agustus','September','Oktober','November','Desember'];
    const d = new Date(dateStr);
    return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  },

  detectIOS: () => /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()),
  
  isStandalone: () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone
};

// Calendar Manager
const calendarManager = {
  calendarInstance: null,
  init: (scheduleDocs) => {
    calendarManager.calendarInstance = new FullCalendar.Calendar(elements.calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'id', // Bahasa Indonesia
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: calendarManager.generateEventsFromFirestore(scheduleDocs),
      eventClick: (info) => {
        elements.popup.content.innerHTML = info.event.extendedProps.detail; // Langsung gunakan HTML dari detail
        elements.popup.overlay.style.display = 'block';
        elements.popup.container.style.display = 'block';
      }
    });
  },

  // Fungsi lama, bisa dihapus atau di-rename jika masih ingin referensi struktur lama
  _generateEventsFromLocalStructure: (localData) => { 
    return Object.entries(localData).reduce((events, [className, subjects]) => {
      Object.entries(subjects).forEach(([subjectName, dates]) => { // Ganti 'subject' menjadi 'subjectName' agar tidak konflik
        Object.entries(dates).forEach(([date, entry]) => {
          events.push({
            title: `${entry.peserta.slice(0,2).join(', ')}${entry.peserta.length>2 ? ', ...' : ''}`,
            date,
            extendedProps: {
              detail: `<strong>Kelas:</strong> ${className}<br><strong>Mata Kuliah:</strong> ${subject}<br><strong>Waktu:</strong> ${entry.time || 'N/A'}<br><strong>Peserta:</strong> ${entry.peserta.join(', ')}<br><strong>Materi:</strong> ${entry.materi || 'Belum ada materi'}`
            }
          });
        });
      });
      return events;
    }, []);
  },

  generateEventsFromFirestore: (firestoreDocs) => {
    if (!firestoreDocs || firestoreDocs.length === 0) return [];
    return firestoreDocs.map(doc => {
      const data = doc.data();
      return {
        title: `${data.peserta.slice(0, 2).join(', ')}${data.peserta.length > 2 ? ', ...' : ''}`,
        date: data.date, // Pastikan formatnya YYYY-MM-DD
        extendedProps: {
          detail: `<strong>Kelas:</strong> ${data.className}<br><strong>Mata Kuliah:</strong> ${data.subject}<br><strong>Waktu:</strong> ${data.time || 'N/A'}<br><strong>Peserta:</strong> ${data.peserta.join(', ')}<br><strong>Materi:</strong> ${data.materi || 'Belum ada materi'}`
        }
      };
    });
  },

  rerenderEvents: (newFirestoreDocs) => {
    if (calendarManager.calendarInstance) {
      calendarManager.calendarInstance.removeAllEvents();
      calendarManager.calendarInstance.addEventSource(calendarManager.generateEventsFromFirestore(newFirestoreDocs));
    }
  }
};

// Data Manager
const dataManager = {
  _getFilteredDataFromLocalStructure: (selectedClass, selectedSubject, nameQuery) => { // Fungsi lama, di-rename
    const today = new Date().setHours(0, 0, 0, 0);
    const classes = selectedClass === 'all' ? Object.keys(dataByClass) : [selectedClass];
    
    return classes.flatMap(className => {
      const subjects = dataByClass[className] || {};
      return Object.entries(subjects).flatMap(([subject, dates]) => {
        if (selectedSubject && subject !== selectedSubject) return [];
        return Object.entries(dates).flatMap(([date, entry]) => {
          const eventDate = new Date(date).setHours(0,0,0,0);
          if (eventDate < today) return [];
          const hasMatch = nameQuery ? 
            entry.peserta.some(name => name.toLowerCase().includes(nameQuery)) : true;
          return hasMatch ? [{ className, subject, date, peserta: entry.peserta, materi: entry.materi, time: entry.time }] : [];
        });
      });
    }).sort((a,b) => new Date(a.date) - new Date(b.date));
  },

  getFilteredDataFromFirestore: (schedules, selectedClass, selectedSubject, nameQuery) => {
    if (!schedules || schedules.length === 0) return [];
    const today = new Date().setHours(0,0,0,0);

    return schedules.filter(doc => {
      const data = doc.data();
      const eventDate = new Date(data.date).setHours(0,0,0,0);
      if (eventDate < today) return false;

      if (selectedClass !== 'all' && data.className !== selectedClass) return false;
      if (selectedSubject && data.subject !== selectedSubject) return false;

      if (nameQuery) {
        const queryText = nameQuery.toLowerCase();
        return data.peserta.some(name => name.toLowerCase().includes(queryText));
      }
      return true;
    }).map(doc => { // Transformasi ke format yang diharapkan renderResults
        const data = doc.data();
        return { ...data, id: doc.id }; // Sertakan ID dokumen jika perlu
    }).sort((a,b) => new Date(a.date) - new Date(b.date));
  },

  renderResults: (results, query) => {
    elements.resultsDiv.innerHTML = '';
    results.forEach(({ className, subject, date, peserta, materi, time }) => {
      const card = document.createElement('div');
      card.className = 'result-card';
      
      card.innerHTML = `
        <div class="card-meta">
          <i class="fa-solid fa-calendar-day"></i>
          <span class="card-date">${utils.formatDate(date)}</span>
        </div>
        <div class="card-meta">
          <i class="fa-solid fa-clock"></i>
          <span>Waktu: ${time || 'N/A'}</span>
        </div>
        <div class="card-meta">
          <i class="fa-solid fa-book"></i>
          <span>${subject}</span>
        </div>
        <div class="card-group">
          <i class="fa-solid fa-users"></i>
          ${peserta.map(name => 
            name.toLowerCase().includes(query) ? 
            `<span class="highlight">${name}</span>` : name
          ).join(', ')}
        </div>
        <div class="card-meta">
          <i class="fa-solid fa-lightbulb"></i>
          <span>Materi: ${materi || 'Belum ada materi'}</span>
        </div>
        <div class="card-meta">
          <i class="fa-solid fa-chalkboard-user"></i>
          <span>Kelas: ${className}</span>
        </div>
      `;
      
      elements.resultsDiv.appendChild(card);
    });
  }
};

// Icon Toggle Manager for new icon controls
const iconToggleManager = {
  init: () => {
    const controls = [
      { trigger: '#google-drive-control .icon-trigger-btn', content: '#driveDropdownContent' },
      { trigger: '#class-filter-control .icon-trigger-btn', content: '#classSelectContent' },
      { trigger: '#subject-filter-control .icon-trigger-btn', content: '#subjectSelectContent' },
      { trigger: '#name-search-control .icon-trigger-btn', content: '#searchNameInputWrapper' }
    ];

    controls.forEach(control => {
      const triggerEl = document.querySelector(control.trigger);
      const contentEl = document.querySelector(control.content);

      if (triggerEl && contentEl) {
        triggerEl.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent click from immediately closing via document listener
          iconToggleManager.togglePanel(triggerEl, contentEl);
        });
      }
    });

    // Click outside to close any open panel
    document.addEventListener('click', (event) => {
      // Check if the click is outside all active panels and their triggers
      if (!event.target.closest('.icon-control-wrapper')) {
        iconToggleManager.closeAllPanels();
      }
    });
  },

  togglePanel: (triggerEl, contentEl) => {
    const isActive = contentEl.classList.contains('active');
    // First, close all other panels
    document.querySelectorAll('.icon-control-wrapper .dropdown-panel.active, .icon-control-wrapper .input-panel.active').forEach(panel => {
      if (panel !== contentEl) { // Don't close the current one if it's already open and we're re-clicking its trigger
        panel.classList.remove('active');
        const associatedTrigger = panel.closest('.icon-control-wrapper').querySelector('.icon-trigger-btn');
        if (associatedTrigger) associatedTrigger.setAttribute('aria-expanded', 'false');
      }
    });
    // Then, toggle the current panel
    contentEl.classList.toggle('active', !isActive);
    triggerEl.setAttribute('aria-expanded', String(!isActive));
  },

  closeAllPanels: () => {
    document.querySelectorAll('.icon-control-wrapper .dropdown-panel.active, .icon-control-wrapper .input-panel.active').forEach(panel => {
      panel.classList.remove('active');
      const associatedTrigger = panel.closest('.icon-control-wrapper').querySelector('.icon-trigger-btn');
      if (associatedTrigger) associatedTrigger.setAttribute('aria-expanded', 'false');
    });
  }
};

// UI Controller
const uiController = {
  deferredPrompt: null, // Untuk menyimpan event beforeinstallprompt
  init: async () => {
    // Tampilkan spinner loading awal
    const initialSpinner = document.createElement('div');
    initialSpinner.className = 'loading-spinner';
    initialSpinner.style.display = 'block';
    document.body.insertBefore(initialSpinner, document.querySelector('.container'));
    
    let persistenceEnabled = false;
    try {
      // Aktifkan Firestore Offline Persistence
      await enablePersistence(db, { synchronizeTabs: true, cacheSizeBytes: CACHE_SIZE_UNLIMITED });
      console.log("Firestore offline persistence diaktifkan.");
      persistenceEnabled = true;
    } catch (error) {
      if (error.code == 'failed-precondition') {
        console.warn("Firestore offline persistence gagal diaktifkan (mungkin sudah aktif di tab lain atau tidak didukung). Aplikasi akan tetap berjalan dengan mode online.");
        // Anggap persistence sudah aktif di tab lain, jadi kita bisa melanjutkan
        persistenceEnabled = true; 
      } else if (error.code == 'unimplemented') {
        console.warn("Browser ini tidak mendukung Firestore offline persistence.");
        // Persistence tidak didukung, lanjutkan tanpa itu
      }
      // Untuk error lain, kita mungkin ingin menghentikan atau menanganinya secara berbeda
      // Namun, untuk saat ini, kita akan tetap mencoba mengambil data.
    }

    // Selalu coba siapkan listener Firestore, baik persistence berhasil atau tidak (kecuali ada error fatal)
    try {
      const schedulesCollection = collection(db, "schedules");
      onSnapshot(query(schedulesCollection, orderBy("date")), (querySnapshot) => {
        console.log("Firestore snapshot diterima. Jumlah dokumen:", querySnapshot.size);
        allSchedulesFromFirestore = querySnapshot.docs;
        if (querySnapshot.empty) {
          console.warn("Tidak ada dokumen jadwal yang ditemukan di Firestore.");
          elements.resultsDiv.innerHTML = "<p>Tidak ada jadwal yang tersedia saat ini.</p>";
        }
        uiController.processInitialData(allSchedulesFromFirestore); // Panggil ini hanya ketika data benar-benar ada
        if (initialSpinner.parentNode) initialSpinner.remove();
      }, (error) => {
        console.error("Firestore onSnapshot error:", error);
        console.error("Error fetching schedules from Firestore: ", error);
        elements.resultsDiv.innerHTML = "<p>Gagal memuat data jadwal. Silakan periksa koneksi Anda atau coba lagi nanti.</p>";
        if (initialSpinner.parentNode) initialSpinner.remove();
      });
    } catch (error) {
      console.error("Gagal setup listener Firestore (kesalahan lebih lanjut):", error);
      if (initialSpinner.parentNode) initialSpinner.remove();
    }

    // Event Listeners
    elements.classSelect.addEventListener('change', uiController.handleClassChange);
    elements.subjectSelect.addEventListener('change', uiController.handleSearch);
    elements.nameInput.addEventListener('input', utils.debounce(uiController.handleSearch, 300));
    elements.driveDropdown.addEventListener("change", uiController.handleDriveSelect);
    // document.getElementById('close-popup').addEventListener('click', uiController.closePopup); // Sudah dihandle di HTML onclick
    
    // Listener untuk tombol tutup PWA Install Prompt
    const closePwaInstallBtn = document.getElementById('closePwaInstallPromptBtn');
    if (closePwaInstallBtn) {
      closePwaInstallBtn.addEventListener('click', () => {
        if (elements.pwaPopup) elements.pwaPopup.style.display = 'none';
      });
    }

    document.getElementById('add-to-home').addEventListener('click', uiController.handlePWAInstall);
    // Load Saved Preferences
    const savedClass = localStorage.getItem('selectedClass');
    if(savedClass) elements.classSelect.value = savedClass;    

  },

  processInitialData: (schedulesDocs) => {
    console.log("Memproses data awal. Jumlah dokumen diterima:", schedulesDocs.length);
    // Initialize Calendar
    calendarManager.init(schedulesDocs);
    if(calendarManager.calendarInstance) calendarManager.calendarInstance.render();
    uiController.updateSubjects();
    uiController.handleSearch(); // Lakukan pencarian awal

    // Initialize PWA & Icon Toggles after data is processed and UI is ready
    uiController.initPWA();
    iconToggleManager.init();
  },

  handleClassChange: () => {
    localStorage.setItem('selectedClass', elements.classSelect.value);
    uiController.updateSubjects();
    uiController.handleSearch();
  },

  updateSubjects: () => {
    const selectedClass = elements.classSelect.value;
    let subjects = [];

    if (allSchedulesFromFirestore.length > 0) {
      if (selectedClass === 'all') {
        subjects = [...new Set(allSchedulesFromFirestore.map(doc => doc.data().subject))];
      } else {
        subjects = [...new Set(
          allSchedulesFromFirestore
            .filter(doc => doc.data().className === selectedClass)
            .map(doc => doc.data().subject)
        )];
      }
      subjects.sort();
    }
        
    elements.subjectSelect.innerHTML = '<option value="">Semua Mata Kuliah</option>';
    subjects.forEach(subject => {
      elements.subjectSelect.innerHTML += `<option value="${subject}">${subject}</option>`;
    });
  },

  handleSearch: () => {
    const query = elements.nameInput.value.trim().toLowerCase();
    const showCalendar = !query;
    
    // Toggle UI Elements
    elements.calendarEl.style.display = showCalendar ? '' : 'none';
    if(elements.printContainer) elements.printContainer.style.display = showCalendar ? '' : 'none';
    
    // Show Loading
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    elements.resultsDiv.innerHTML = '';
    elements.resultsDiv.appendChild(spinner);

    // Process Data
    const filteredData = dataManager.getFilteredDataFromFirestore(
      allSchedulesFromFirestore,
      elements.classSelect.value,
      elements.subjectSelect.value,
      query
    );
    // Render Results
    setTimeout(() => {
      spinner.remove();
      dataManager.renderResults(filteredData, query);
    }, 300);
  },

  handleDriveSelect: function(event) {
    const url = event.target.value;
    if(url && url.startsWith('https://drive.google.com')) {
      window.open(url, "_blank");
    } else {
      alert('Link Google Drive tidak valid!');
    }
    event.target.selectedIndex = 0;
  },

  closePopup: () => {
    elements.popup.overlay.style.display = 'none';
    elements.popup.container.style.display = 'none';
  },

  initPWA: () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      uiController.deferredPrompt = e; // Simpan event ke properti controller
      if (!utils.isStandalone()) uiController.showInstallPrompt(); // Tampilkan prompt jika belum standalone
    });

    // Manual trigger untuk iOS
    if(utils.detectIOS() && !utils.isStandalone()) {
      setTimeout(uiController.showInstallPrompt, 3000);
    }
  },

  showInstallPrompt: () => {
    if(utils.detectIOS()) {
      elements.pwaPopup.querySelector('p').textContent = 
        'Untuk menambahkan ke Layar Utama: tekan tombol "Bagikan" lalu pilih "Tambah ke Layar Utama".';
      elements.pwaPopup.querySelector('#add-to-home').style.display = 'none';
    } else {
      elements.pwaPopup.querySelector('#add-to-home').style.display = 'inline-block';
    }
    elements.pwaPopup.style.display = 'flex';
  },

  handlePWAInstall: async () => {
    if (uiController.deferredPrompt) {
      await uiController.deferredPrompt.prompt();
      const { outcome } = await uiController.deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      uiController.deferredPrompt = null; // Kosongkan setelah digunakan
    }
    elements.pwaPopup.style.display = 'none';
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', uiController.init);
