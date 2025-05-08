// service-worker-registration.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async() => {
    navigator.serviceWorker.register('/sw.js')    
      .then(registration => console.log('ServiceWorker registered'))
      .catch(err => console.log('ServiceWorker registration failed:', err));
  });
}

// Firebase SDK (gunakan versi yang sesuai, contoh v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"; // Pastikan ini diimpor
import { getFirestore, collection, getDocs, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy, where, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
const auth = getAuth(fbApp); // Dapatkan instance Firebase Auth
console.log("Firebase Initialized. Firestore instance:", db ? "OK" : "Failed");

// app.js
let dataByClass = {}; // Akan diisi dari Firestore, atau bisa juga tidak digunakan lagi jika struktur data utama adalah array
let currentUser = null; // Untuk menyimpan informasi pengguna yang login
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
    container: document.getElementById('popup'),
    visibleTitle: document.getElementById('popupVisibleTitle') // Tambahkan referensi judul popup
  },
  pwaPopup: document.getElementById('add-to-home-popup'),
  viewToggleButtons: { // Tambahkan elemen tombol view
    calendar: document.getElementById('show-calendar-btn'),
    datacard: document.getElementById('show-datacard-btn')
  },
  hamburgerBtn: document.getElementById('hamburger-menu-btn'),
  mobileMenuPanel: document.getElementById('mobile-menu-panel'),
  closeMobileMenuBtn: document.getElementById('close-mobile-menu-btn'),
  loginBtn: document.getElementById('login-btn'), // Pastikan ini ada
  logoutBtn: document.getElementById('logout-btn') // Pastikan ini ada

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
        right: 'dayGridMonth,timeGridWeek,listWeek' // Tambahkan opsi tampilan di sini
      },
      events: calendarManager.generateEventsFromFirestore(scheduleDocs),
      eventClick: (info) => {
        elements.popup.visibleTitle.textContent = 'Detail Jadwal Kalender'; // Set judul popup
        elements.popup.content.innerHTML = info.event.extendedProps.detail; // Langsung gunakan HTML dari detail
        elements.popup.overlay.style.display = 'block';
        elements.popup.overlay.setAttribute('aria-hidden', 'false');
        elements.popup.container.style.display = 'block';
        elements.popup.container.setAttribute('aria-hidden', 'false');
        elements.popup.content.focus(); // Fokus ke konten popup
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
              detail: `<strong>Kelas:</strong> ${className}<br><strong>Mata Kuliah:</strong> ${subjectName}<br><strong>Waktu:</strong> ${entry.time || 'N/A'}<br><strong>Peserta:</strong> ${entry.peserta.join(', ')}<br><strong>Materi:</strong> ${entry.materi || 'Belum ada materi'}`
            }
          });
        });
      });
      return events;
    }, []);
  },

  generateEventsFromFirestore: (firestoreDocs) => {
    console.log("calendarManager.generateEventsFromFirestore - Input docs:", firestoreDocs);
    if (!firestoreDocs || firestoreDocs.length === 0) return [];

    let relevantDocs = firestoreDocs;
    return relevantDocs.map(doc => {
      const data = doc.data();
      return {
        title: `${data.peserta.slice(0, 2).join(', ')}${data.peserta.length > 2 ? ', ...' : ''}`,
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
    console.log("dataManager.getFilteredDataFromFirestore - Input schedules:", schedules, "Class:", selectedClass, "Subject:", selectedSubject, "Query:", nameQuery);
    if (!schedules || schedules.length === 0) return [];
    const today = new Date().setHours(0,0,0,0);
    
    let filteredSchedules = schedules.filter(doc => {
      const data = doc.data();
      const eventDate = new Date(data.date).setHours(0, 0, 0, 0);
      if (eventDate < today) return false;

      // Filter berdasarkan class
      if (selectedClass !== 'all' && data.className !== selectedClass) return false;
      // Filter berdasarkan subject
      if (selectedSubject && data.subject !== selectedSubject) return false;
      // Filter berdasarkan nameQuery
      const queryText = nameQuery ? nameQuery.toLowerCase() : '';
      return !queryText || data.peserta.some(name => name.toLowerCase().includes(queryText));
    }).map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => new Date(a.date) - new Date(b.date));
    // console.log("dataManager.getFilteredDataFromFirestore - Output filteredData:", filteredSchedules); // Bisa di-uncomment

    // Jika ada pengguna yang login, filter lebih lanjut berdasarkan email pengguna di field peserta
    if (currentUser && currentUser.email) {
      console.log(`Filtering for user: ${currentUser.email}`);
      filteredSchedules = filteredSchedules.filter(schedule => 
        schedule.peserta && schedule.peserta.some(p => p.toLowerCase().includes(currentUser.email.toLowerCase()))
      );
    }
    return filteredSchedules;
  },

  renderResults: (results, query) => {
    console.log("dataManager.renderResults - Input results:", results, "Query:", query);
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
          <span class="clickable-item" data-type="matkul" data-value="${subject.replace(/"/g, '&quot;')}">${subject}</span>
        </div>
        <div class="card-group">
          <i class="fa-solid fa-users"></i>
          ${peserta.map(name => { // Tambahkan kurung kurawal di sini
            const isHighlighted = query && name.toLowerCase().includes(query.toLowerCase());
            const nameDisplay = isHighlighted ? `<span class="highlight">${name}</span>` : name;
            // Escape quotes in data-value
            const escapedName = name.replace(/"/g, '&quot;');
            return `<span class="clickable-item" data-type="peserta" data-value="${escapedName}">${nameDisplay}</span>`;
          }).join(', ')} 
        </div>
        <div class="card-meta">
          <i class="fa-solid fa-lightbulb"></i>
          <span>Materi: ${materi || 'Belum ada materi'}</span> 
        </div>
        <div class="card-meta">
          <i class="fa-solid fa-chalkboard-user"></i>
          <span>Kelas: <span class="clickable-item" data-type="kelas" data-value="${className.replace(/"/g, '&quot;')}">${className}</span></span>
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
      // Tombol Drive, Kelas, dan Matkul tidak lagi dikelola di sini karena select langsung digunakan
      // { trigger: '#google-drive-control .control-trigger-btn', content: '#driveDropdownContent' }, // Dihapus
      // { trigger: '#class-filter-control .control-trigger-btn', content: '#classSelectContent' }, // Dihapus
      // { trigger: '#subject-filter-control .control-trigger-btn', content: '#subjectSelectContent' }, // Dihapus
      { trigger: '#name-search-control .control-trigger-btn', content: '#searchNameInputWrapper' }
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
        const associatedTrigger = panel.closest('.icon-control-wrapper').querySelector('.control-trigger-btn');
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
      const associatedTrigger = panel.closest('.icon-control-wrapper').querySelector('.control-trigger-btn');
      if (associatedTrigger) associatedTrigger.setAttribute('aria-expanded', 'false');
    });
  }
};

// UI Controller
const uiController = {
  deferredPrompt: null, // Untuk menyimpan event beforeinstallprompt
  currentViewMode: 'datacard', // Default ke tampilan datacard
  init: async () => {
    // Tampilkan spinner loading awal
    const initialSpinner = document.createElement('div');
    initialSpinner.className = 'loading-spinner';
    initialSpinner.style.display = 'block';
    document.body.insertBefore(initialSpinner, document.querySelector('.container'));

    
    let persistenceEnabled = false;
    try {
      // Aktifkan Firestore Offline Persistence
      await enableIndexedDbPersistence(db, { synchronizeTabs: true, cacheSizeBytes: CACHE_SIZE_UNLIMITED });
      console.log("Attempted to enable Firestore offline persistence.");
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
      } else {
        console.error("Error enabling persistence:", error);
      }
      // Untuk error lain, kita mungkin ingin menghentikan atau menanganinya secara berbeda
      // Namun, untuk saat ini, kita akan tetap mencoba mengambil data.
    }

    // Event listeners untuk login/logout
    elements.loginBtn.addEventListener('click', authManager.signInWithGoogle);
    elements.logoutBtn.addEventListener('click', authManager.signOutUser);

    //initialize auth state
    onAuthStateChanged(auth, async(user) => {
      authManager.handleAuthStateChange(user);
      // Selalu coba siapkan listener Firestore, baik persistence berhasil atau tidak (kecuali ada error fatal)
      try {
        const schedulesCollection = collection(db, "schedules");
        console.log("Setting up Firestore onSnapshot listener for 'schedules' collection...");
        onSnapshot(query(schedulesCollection, orderBy("date")), (querySnapshot) => {
          console.log("Firestore snapshot diterima. Jumlah dokumen:", querySnapshot.size);
          allSchedulesFromFirestore = querySnapshot.docs;
          if (querySnapshot.empty) {
            console.warn("Tidak ada dokumen jadwal yang ditemukan di Firestore.");
            elements.resultsDiv.innerHTML = "<p>Tidak ada jadwal yang tersedia saat ini.</p>";
          }
          // Pastikan allSchedulesFromFirestore adalah array sebelum dikirim
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
      elements.popup.overlay.addEventListener('click', uiController.closePopup); // Tambahkan listener untuk klik overlay
      elements.resultsDiv.addEventListener('click', uiController.handleDatacardClick); // Event delegation untuk klik datacard
      elements.driveDropdown.addEventListener("change", uiController.handleDriveSelect);

      const savedClass = localStorage.getItem('selectedClass');
      if(savedClass) elements.classSelect.value = savedClass;    
    });
        }
  ,
  // Listener untuk tombol tutup PWA Install Prompt
    const closePwaInstallBtn = document.getElementById('closePwaInstallPromptBtn');
    if (closePwaInstallBtn) {
      // Pastikan elemen pwaPopup ada sebelum menambahkan event listener
      if (!elements.pwaPopup) {
        elements.pwaPopup = document.getElementById('add-to-home-popup');
      }
      closePwaInstallBtn.addEventListener('click', () => {
        if (elements.pwaPopup) elements.pwaPopup.style.display = 'none';
      });
    }

    document.getElementById('add-to-home').addEventListener('click', uiController.handlePWAInstall);
    // Load Saved Preferences
    // Tambahkan event listener untuk tombol view toggle
    elements.viewToggleButtons.calendar.addEventListener('click', () => uiController.setView('calendar'));elements.viewToggleButtons.datacard.addEventListener('click', () => uiController.setView('datacard'));

   // Event listeners untuk menu mobile
   elements.hamburgerBtn.addEventListener('click', uiController.toggleMobileMenu);
   elements.closeMobileMenuBtn.addEventListener('click', uiController.closeMobileMenu);

  processInitialData: (schedulesDocs) => {
    // Jika belum ada pengguna yang login, atau jika data tidak bergantung pada pengguna,
    // kita bisa langsung proses. Jika data bergantung pada pengguna,
    // pemanggilan ini mungkin perlu ditunda atau dipanggil ulang setelah login.
    console.log("Memproses data awal. Jumlah dokumen diterima:", schedulesDocs.length);
    // Initialize Calendar
    calendarManager.init(schedulesDocs); // Inisialisasi data kalender
    if (!calendarManager.calendarInstance) {
        console.error("Calendar instance GAGAL diinisialisasi di processInitialData.");
        return;
    }
    // Jangan render kalender di sini jika defaultnya adalah datacard. setView akan menanganinya.

    uiController.updateSubjects();

    // Atur tampilan awal berdasarkan currentViewMode
    // Ini juga akan memicu handleSearch jika tampilan awalnya adalah 'datacard'
    uiController.setView(uiController.currentViewMode);

    // Initialize PWA & Icon Toggles after data is processed and UI is ready
    uiController.initPWA();
    iconToggleManager.init();
  },

  setView: (view) => {
    uiController.currentViewMode = view;

    if (view === 'calendar') {
      elements.calendarEl.style.display = '';
      if(elements.printContainer) elements.printContainer.style.display = ''; // Tampilkan tombol print dengan kalender
      elements.resultsDiv.style.display = 'none';
      elements.viewToggleButtons.calendar.classList.add('active');
      elements.viewToggleButtons.calendar.setAttribute('aria-pressed', 'true');
      elements.viewToggleButtons.datacard.classList.remove('active');
      elements.viewToggleButtons.datacard.setAttribute('aria-pressed', 'false');
      if (calendarManager.calendarInstance) {
        calendarManager.calendarInstance.render(); // Render kalender saat ditampilkan
      }
    } else { // 'datacard'
      elements.calendarEl.style.display = 'none';
      if(elements.printContainer) elements.printContainer.style.display = 'none'; // Sembunyikan tombol print dengan datacard
      elements.resultsDiv.style.display = ''; // Atau 'grid' jika itu defaultnya
      elements.viewToggleButtons.datacard.classList.add('active');
      elements.viewToggleButtons.datacard.setAttribute('aria-pressed', 'true');
      elements.viewToggleButtons.calendar.classList.remove('active');
      elements.viewToggleButtons.calendar.setAttribute('aria-pressed', 'false');
      // Panggil handleSearch untuk mengisi datacards saat beralih ke tampilan ini
      uiController.handleSearch();
    }
  },

  handleDatacardClick: (event) => {
    const target = event.target.closest('.clickable-item');
    if (target) {
      const type = target.dataset.type;
      const value = target.dataset.value;
      if (type && value) {
        uiController.showRelatedSchedules(type, value);
      }
    }
  },

  showRelatedSchedules: (type, value) => {
    const today = new Date().setHours(0, 0, 0, 0);
    let titleText = '';
    let filteredSchedules = [];

    if (allSchedulesFromFirestore && allSchedulesFromFirestore.length > 0) {
      filteredSchedules = allSchedulesFromFirestore.filter(doc => {
        const data = doc.data();
        const eventDate = new Date(data.date).setHours(0,0,0,0);
        if (eventDate < today) return false; // Hanya jadwal mendatang

        switch(type) {
          case 'peserta':
            titleText = `Jadwal Mendatang untuk ${value}`;
            return data.peserta && data.peserta.includes(value);
          case 'kelas':
            titleText = `Jadwal Mendatang untuk Kelas ${value}`;
            return data.className === value;
          case 'matkul':
            titleText = `Jadwal Mendatang untuk Mata Kuliah ${value}`;
            return data.subject === value;
          default: return false;
        }
      }).map(doc => doc.data()).sort((a,b) => new Date(a.date) - new Date(b.date));
    }

    elements.popup.visibleTitle.textContent = titleText;
    if (filteredSchedules.length > 0) {
      elements.popup.content.innerHTML = `
        <ul class="related-schedules-list">
          ${filteredSchedules.map(s => `<li><strong>${utils.formatDate(s.date)}</strong> (${s.time || 'N/A'})<br><strong>Kelas:</strong> ${s.className}<br><strong>Matkul:</strong> ${s.subject}<br><strong>Peserta:</strong> ${s.peserta.join(', ')}<br><strong>Materi:</strong> ${s.materi || 'Belum ada'}</li>`).join('')}
        </ul>`;
    } else {
      elements.popup.content.innerHTML = `<p>Tidak ada jadwal mendatang yang ditemukan untuk ${value}.</p>`;
    }
    elements.popup.overlay.style.display = 'block';
    elements.popup.overlay.setAttribute('aria-hidden', 'false');
    elements.popup.container.style.display = 'block';
    elements.popup.container.setAttribute('aria-hidden', 'false');
    elements.popup.content.focus();
  },

  handleClassChange: () => {
    localStorage.setItem('selectedClass', elements.classSelect.value);
    uiController.updateSubjects();
    uiController.handleSearch();
  },

  updateSubjects: () => {
    const selectedClass = elements.classSelect.value;
    let subjects = [];
    console.log("updateSubjects - allSchedulesFromFirestore:", allSchedulesFromFirestore);

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
    console.log("handleSearch dipanggil.");
    const query = elements.nameInput.value.trim().toLowerCase();

    // Jika ada query dan tampilan saat ini adalah kalender, alihkan ke tampilan datacard
    if (query && uiController.currentViewMode === 'calendar') {
      uiController.setView('datacard'); // Ini akan menyembunyikan kalender dan menampilkan resultsDiv
                                       // setView('datacard') juga akan memanggil handleSearch lagi
      return; // Keluar karena setView('datacard') akan memanggil handleSearch
    }

    // Hanya lanjutkan untuk memperbarui resultsDiv jika tampilan saat ini adalah 'datacard'
    if (uiController.currentViewMode === 'datacard') {
      // Show Loading
      const spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.style.display = 'block'; // Pastikan spinner terlihat
      elements.resultsDiv.innerHTML = ''; // Bersihkan hasil sebelumnya
      elements.resultsDiv.appendChild(spinner);

      console.log("handleSearch (mode datacard) - allSchedulesFromFirestore sebelum filter:", allSchedulesFromFirestore);
      // Process Data
      const filteredData = dataManager.getFilteredDataFromFirestore(
        allSchedulesFromFirestore,
        elements.classSelect.value,
        elements.subjectSelect.value,
        query
      );
      // Render Results
      setTimeout(() => {
        if (spinner.parentNode) { // Pastikan spinner masih ada sebelum dihapus
          spinner.remove();
        }
        dataManager.renderResults(filteredData, query);
      }, 300);
    }
    // Jika mode kalender dan tidak ada query, tidak perlu melakukan apa-apa pada resultsDiv
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
    elements.popup.overlay.setAttribute('aria-hidden', 'true');
    elements.popup.container.style.display = 'none';
    elements.popup.container.setAttribute('aria-hidden', 'true');
    elements.popup.visibleTitle.textContent = 'Detail Jadwal'; // Reset judul
    elements.popup.content.innerHTML = ''; // Bersihkan konten
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
  },

  toggleMobileMenu: () => {
    const isActive = elements.mobileMenuPanel.classList.contains('active');
    elements.mobileMenuPanel.classList.toggle('active', !isActive);
    elements.hamburgerBtn.setAttribute('aria-expanded', String(!isActive));
    elements.mobileMenuPanel.setAttribute('aria-hidden', String(isActive));
  },

  closeMobileMenu: () => {
    if (elements.mobileMenuPanel.classList.contains('active')) {
      uiController.toggleMobileMenu(); // Gunakan toggle untuk konsistensi state aria
    }
    // elements.pwaPopup.style.display = 'none'; // Baris ini sepertinya salah tempat, mungkin ingin dihapus atau dipindahkan
  }
};





const authManager = {
  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Pengguna berhasil login
      console.log("User signed in:", result.user);
      console.log("User email:", result.user.email);
      console.log("User UID:", result.user.uid);

      // Check if user data exists in Firestore
      const userRef = doc(db, "participants", result.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // If user data doesn't exist, add it
        console.log("User data not found. Creating new user data.");
        const userData = {
          name: "Muhammad Syamsur Rijal", // Fixed name
          email: result.user.email, // User's email
        };
        try {
          await setDoc(userRef, userData);
          console.log("New user data added to Firestore.");
        } catch (error) {
          console.error("Error adding new user data to Firestore:", error);
          alert(`Gagal menyimpan data pengguna: ${error.message}`);
        }
      } else {
        console.log("User data already exists.");
      }


      // UI akan diupdate oleh onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert(`Gagal login dengan Google: ${error.message}`);
    }
  },

  signOutUser: async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      // UI akan diupdate oleh onAuthStateChanged
    } catch (error) {
      console.error("Error signing out:", error);
      alert(`Gagal logout: ${error.message}`);
    }
  },

  handleAuthStateChange: (user) => {
    currentUser = user; // Update global currentUser
    if (user) {
      // Pengguna login
      elements.loginBtn.style.display = 'none';
      elements.logoutBtn.style.display = 'block';
      elements.logoutBtn.textContent = `Logout (${user.email.split('@')[0]})`; // Tampilkan bagian email sebelum @
      console.log("Auth state changed: User is logged in", user);
    } else {
      // Pengguna logout
      elements.loginBtn.style.display = 'block';
      elements.logoutBtn.style.display = 'none';
      console.log("Auth state changed: User is logged out");
    }
    // Setelah status auth berubah, muat ulang atau filter data
    uiController.handleSearch(); // Ini akan memfilter data berdasarkan currentUser yang baru
    calendarManager.rerenderEvents(allSchedulesFromFirestore); // Update kalender juga
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', uiController.init);


