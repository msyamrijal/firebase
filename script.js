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
import { getFirestore, collection, getDocs, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy, where, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
console.log("Firebase Initialized. Firestore instance:", db ? "OK" : "Failed");

// app.js
let dataByClass = {}; // Akan diisi dari Firestore, atau bisa juga tidak digunakan lagi jika struktur data utama adalah array
let allSchedulesFromFirestore = []; // Untuk menyimpan semua jadwal dari Firestore

// Global Elements
const elements = {
  // Elemen dari struktur baru (gemini - polos)
  menuToggle: document.querySelector('.menu-toggle'),
  floatingMenu: document.querySelector('.floating-menu'),
  searchInput: document.getElementById('searchInput'), // Sebelumnya nameInput
  institutionFilter: document.getElementById('institutionFilter'), // Sebelumnya classSelect
  subjectFilter: document.getElementById('subjectFilter'), // Sebelumnya subjectSelect
  themeToggle: document.getElementById('themeToggle'),
  driveToggleBtn: document.getElementById('driveToggleBtn'),
  driveDropdownMenu: document.getElementById('driveDropdown'), // Kontainer link drive
  gridViewBtn: document.getElementById('gridViewBtn'),
  calendarViewBtn: document.getElementById('calendarViewBtn'),
  scheduleGrid: document.getElementById('scheduleGrid'), // Sebelumnya resultsDiv
  calendarEl: document.getElementById('calendar'),
  calendarView: document.getElementById('calendarView'),
  // loadingIndicator: document.getElementById('loading'), // Dihapus karena elemen HTML-nya dihapus
  emptyState: document.getElementById('emptyState'),
  popup: {
    modal: document.getElementById('genericModal'),
    modalBody: document.getElementById('modalBody'), // Sebelumnya popup-content
  },
  pwaPopup: document.getElementById('installPopup'), // Sebelumnya add-to-home-popup
  installPwaBtn: document.getElementById('installBtn'),
  dismissPwaBtn: document.getElementById('dismissInstallBtn'),
  // Untuk animasi menu
  welcomeTextCircle: null, // Akan dibuat jika ada di HTML contoh
  // Untuk draggable menu
  isDraggingMenu: false,
  menuOffsetX: 0,
  menuOffsetY: 0,
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
        // Menggunakan struktur modal baru dan data asli dari event
        const { className, subject, date, peserta, materi, time } = info.event.extendedProps.originalData;
        const modalContent = `
            <div class="modal-item">
                <div class="card-header">
                    <h3 class="course-title">${subject}</h3>
                    <span class="date-display">${utils.formatDate(date)}</span>
                </div>
                <p class="institute">${className}</p>
                ${materi ? `<div class="discussion-topic"><strong>Materi:</strong> ${materi}</div>` : ''}
                ${time ? `<p class="card-time"><i class="fas fa-clock"></i> ${time}</p>` : ''}
                <div class="participants"><strong>Peserta:</strong> ${peserta.map(name => `<span class="participant-tag">${name}</span>`).join('')}</div>
            </div>
        `;
        // Menggunakan struktur modal baru
        elements.popup.modalBody.innerHTML = modalContent;
        if (elements.popup.modal) elements.popup.modal.classList.add('active');
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
    console.log("calendarManager.generateEventsFromFirestore - Input docs:", firestoreDocs);
    if (!firestoreDocs || firestoreDocs.length === 0) return [];
    return firestoreDocs.map(doc => {
      const data = doc.data();
      return {
        title: `${data.peserta.slice(0, 2).join(', ')}${data.peserta.length > 2 ? ', ...' : ''}`,
        date: data.date, // Pastikan formatnya YYYY-MM-DD
        extendedProps: {
          // Simpan data asli untuk digunakan di modal
          originalData: { ...data, id: doc.id }
        }
      };
    });
    // console.log("calendarManager.generateEventsFromFirestore - Output events:", generatedEvents); // Bisa di-uncomment jika perlu
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
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Pastikan perbandingan tanggal benar
    // console.log("dataManager.getFilteredDataFromFirestore - Output filteredData:", filteredData); // Bisa di-uncomment
  },

  renderResults: (results, query) => {
    console.log("dataManager.renderResults - Input results:", results, "Query:", query);
    elements.scheduleGrid.innerHTML = ''; // Menggunakan scheduleGrid
    elements.emptyState.classList.toggle('active', results.length === 0 && query);

    results.forEach((scheduleData) => { // scheduleData sudah termasuk id dari getFilteredDataFromFirestore
      const { className, subject, date, peserta, materi, time, id } = scheduleData; // Destructure untuk kejelasan
      const card = document.createElement('div');
      card.className = 'schedule-card'; // Sesuai dengan CSS baru
      // Struktur HTML kartu disesuaikan dengan kelas di style.css
      card.innerHTML = `
        <div class="card-header">
            <h3 class="course-title clickable" data-schedule-id="${id}">${subject}</h3>
            <span class="date-display clickable" data-schedule-id="${id}">${utils.formatDate(date)}</span>
        </div>
        <p class="institute clickable" data-schedule-id="${id}">${className}</p>
        ${materi ? `<div class="discussion-topic clickable" data-schedule-id="${id}"><strong>Materi:</strong> ${materi}</div>` : ''}
        ${time ? `<p class="card-time clickable" data-schedule-id="${id}"><i class="fas fa-clock"></i> ${time}</p>` : ''}
        <div class="participants">
                ${peserta.map(name => 
                    `<span class="participant-tag ${query && name.toLowerCase().includes(query.toLowerCase()) ? 'highlight' : ''}">${name}</span>`
                ).join('')}
        </div>
        <!-- Tombol detail bisa dihilangkan jika seluruh kartu clickable -->
      `;
      
      // Membuat seluruh kartu (atau bagian tertentu) clickable untuk membuka modal
      card.querySelectorAll('.clickable').forEach(clickableElement => {
        clickableElement.addEventListener('click', () => {
            // Menggunakan scheduleData yang ditangkap oleh loop untuk modal
            const modalContent = `
              <div class="modal-item">
                <div class="card-header">
                    <h3 class="course-title">${scheduleData.subject}</h3>
                    <span class="date-display">${utils.formatDate(scheduleData.date)}</span>
                </div>
                <p class="institute">${scheduleData.className}</p>
                ${scheduleData.materi ? `<div class="discussion-topic"><strong>Materi:</strong> ${scheduleData.materi}</div>` : ''}
                ${scheduleData.time ? `<p class="card-time"><i class="fas fa-clock"></i> ${scheduleData.time}</p>` : ''}
                <div class="participants">
                    <strong>Peserta:</strong>
                    ${scheduleData.peserta.map(name => `<span class="participant-tag">${name}</span>`).join('')}
                </div>
              </div>
            `;
            elements.popup.modalBody.innerHTML = modalContent;
            if (elements.popup.modal) elements.popup.modal.classList.add('active');
        });
      });
      elements.scheduleGrid.appendChild(card);
    });
  }
};

// Icon Toggle Manager for new icon controls
// const iconToggleManager = { ... } // Logika ini digantikan oleh floating menu

// UI Controller
const uiController = {
  deferredPrompt: null, // Untuk menyimpan event beforeinstallprompt
  currentView: 'grid', // 'grid' or 'calendar'
  isMenuInitialized: false,
  init: async () => {
    // Tampilkan spinner loading awal
    // if (elements.loadingIndicator) elements.loadingIndicator.classList.add('active'); // Dihapus
    
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

    // Selalu coba siapkan listener Firestore, baik persistence berhasil atau tidak (kecuali ada error fatal)
    try {
      const schedulesCollection = collection(db, "schedules");
      console.log("Setting up Firestore onSnapshot listener for 'schedules' collection...");
      onSnapshot(query(schedulesCollection, orderBy("date")), (querySnapshot) => {
        console.log("Firestore snapshot diterima. Jumlah dokumen:", querySnapshot.size);
        allSchedulesFromFirestore = querySnapshot.docs;
        if (querySnapshot.empty) {
          console.warn("Tidak ada dokumen jadwal yang ditemukan di Firestore.");
          if(elements.scheduleGrid) elements.scheduleGrid.innerHTML = "<p>Tidak ada jadwal yang tersedia saat ini.</p>";
        }
        // Pastikan allSchedulesFromFirestore adalah array sebelum dikirim
        uiController.processInitialData(allSchedulesFromFirestore); // Panggil ini hanya ketika data benar-benar ada
        // Menghapus initialSpinner yang tidak didefinisikan, kita gunakan loadingIndicator
        if (elements.loadingIndicator && elements.loadingIndicator.classList.contains('active')) {
            // Dihapus di processInitialData atau di sini jika processInitialData tidak selalu dipanggil
        }
      }, (error) => {
        console.error("Firestore onSnapshot error:", error);
        console.error("Error fetching schedules from Firestore: ", error);
        if(elements.scheduleGrid) elements.scheduleGrid.innerHTML = "<p>Gagal memuat data jadwal. Silakan periksa koneksi Anda atau coba lagi nanti.</p>";
        // if (elements.loadingIndicator) elements.loadingIndicator.classList.remove('active'); // Dihapus
      });
    } catch (error) {
      console.error("Gagal setup listener Firestore (kesalahan lebih lanjut):", error);
      // if (elements.loadingIndicator) elements.loadingIndicator.classList.remove('active'); // Dihapus
    }

    // Event Listeners untuk UI Utama
    if (elements.menuToggle) elements.menuToggle.addEventListener('click', uiController.toggleMenu);
    if (elements.searchInput) elements.searchInput.addEventListener('input', utils.debounce(uiController.handleSearch, 300));
    if (elements.institutionFilter) elements.institutionFilter.addEventListener('change', uiController.handleClassChange);
    if (elements.subjectFilter) elements.subjectFilter.addEventListener('change', uiController.handleSearch);
    if (elements.themeToggle) elements.themeToggle.addEventListener('click', uiController.toggleTheme);
    if (elements.driveToggleBtn) elements.driveToggleBtn.addEventListener('click', uiController.toggleDriveDropdown);
    if (elements.gridViewBtn) elements.gridViewBtn.addEventListener('click', () => uiController.switchView('grid'));
    if (elements.calendarViewBtn) elements.calendarViewBtn.addEventListener('click', () => uiController.switchView('calendar'));
    
    // Close modal
    const modalOverlay = elements.popup.modal ? elements.popup.modal.querySelector('.modal-overlay') : null;
    const closeModalBtn = elements.popup.modal ? elements.popup.modal.querySelector('.close-modal') : null;
    if (modalOverlay) modalOverlay.addEventListener('click', uiController.closePopup);
    if (closeModalBtn) closeModalBtn.addEventListener('click', uiController.closePopup);

    // PWA Install
    if (elements.installPwaBtn) elements.installPwaBtn.addEventListener('click', uiController.handlePWAInstall);
    if (elements.dismissPwaBtn) elements.dismissPwaBtn.addEventListener('click', () => {
      if (elements.pwaPopup) elements.pwaPopup.classList.add('hidden');
    });

    // Load Saved Preferences
    const savedClass = localStorage.getItem('selectedClass');
    if(savedClass && elements.institutionFilter) elements.institutionFilter.value = savedClass;
    uiController.loadTheme(); // Load saved theme
    uiController.initPWA(); // Pindahkan inisialisasi PWA ke sini
    uiController.initFloatingMenu(); // Inisialisasi fitur menu

    uiController.switchView(localStorage.getItem('lastView') || 'grid'); // Load last view or default to grid
  },

  processInitialData: (schedulesDocs) => {
    console.log("Memproses data awal. Jumlah dokumen diterima:", schedulesDocs ? schedulesDocs.length : 'null/undefined');
    // if (elements.loadingIndicator) elements.loadingIndicator.classList.remove('active'); // Dihapus

    // Initialize Calendar
    if (elements.calendarEl) {
        calendarManager.init(schedulesDocs);
    } else {
        console.error("Elemen #calendar tidak ditemukan untuk FullCalendar.");
    }

    if (!calendarManager.calendarInstance) {
        console.error("Calendar instance GAGAL diinisialisasi di processInitialData.");
        // Tetap lanjutkan untuk UI lain jika kalender gagal
    }
    if(calendarManager.calendarInstance) {
        calendarManager.calendarInstance.render();
    }
    uiController.updateSubjects();
    uiController.handleSearch(); // Lakukan pencarian awal

    // iconToggleManager.init(); // Ini sudah tidak digunakan
  },

  handleClassChange: () => {
    if (elements.institutionFilter) localStorage.setItem('selectedClass', elements.institutionFilter.value);
    uiController.updateSubjects();
    uiController.handleSearch();
  },

  updateSubjects: () => {
    const selectedClass = elements.institutionFilter ? elements.institutionFilter.value : 'all';
    let subjects = [];
    console.log("updateSubjects - allSchedulesFromFirestore:", allSchedulesFromFirestore);

    if (allSchedulesFromFirestore && allSchedulesFromFirestore.length > 0) {
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
        
    if (elements.subjectFilter) {
        elements.subjectFilter.innerHTML = '<option value="">Semua Mata Kuliah</option>';
        subjects.forEach(subject => {
          elements.subjectFilter.innerHTML += `<option value="${subject}">${subject}</option>`;
        });
    }
  },

  handleSearch: () => {
    console.log("handleSearch dipanggil.");
    const query = elements.searchInput ? elements.searchInput.value.trim().toLowerCase() : "";
    
    // if (elements.loadingIndicator) elements.loadingIndicator.classList.add('active'); // Dihapus
    if (elements.scheduleGrid) elements.scheduleGrid.innerHTML = ''; 

    console.log("handleSearch - allSchedulesFromFirestore sebelum filter:", allSchedulesFromFirestore);
    // Process Data
    const filteredData = dataManager.getFilteredDataFromFirestore(
      allSchedulesFromFirestore,
      elements.institutionFilter ? elements.institutionFilter.value : 'all',
      elements.subjectFilter ? elements.subjectFilter.value : '',
      query
    );
    // Render Results
    setTimeout(() => {
      // if (elements.loadingIndicator) elements.loadingIndicator.classList.remove('active'); // Dihapus
      dataManager.renderResults(filteredData, query);
      // Update calendar events if calendar is visible
      if (uiController.currentView === 'calendar' && calendarManager.calendarInstance) {
          calendarManager.rerenderEvents(filteredData); // Atau allSchedulesFromFirestore jika kalender tidak difilter nama
      }
      // Logika emptyState sudah ditangani di renderResults dengan:
      // elements.emptyState.classList.toggle('active', results.length === 0 && query);
      // Jika tidak ada query dan tidak ada hasil (data awal kosong), emptyState akan disembunyikan.
      }
    }, 300);
  },

  toggleMenu: () => {
    if (elements.floatingMenu) elements.floatingMenu.classList.toggle('active');
  },

  toggleTheme: () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    // CSS akan menghandle perubahan ikon melalui atribut data-theme
  },

  loadTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light'); // Default ke light
    }
    // CSS akan menghandle ikon berdasarkan atribut data-theme
  },

  toggleDriveDropdown: () => {
    if (elements.driveDropdownMenu) elements.driveDropdownMenu.classList.toggle('active');
  },

  switchView: (view) => {
    uiController.currentView = view;
    if (view === 'grid') {
      if (elements.scheduleGrid) elements.scheduleGrid.classList.add('active');
      if (elements.calendarView) elements.calendarView.classList.remove('active');
      if (elements.gridViewBtn) elements.gridViewBtn.classList.add('active');
      if (elements.calendarViewBtn) elements.calendarViewBtn.classList.remove('active');
      uiController.handleSearch(); // Refresh grid view
      if (elements.emptyState && elements.scheduleGrid && elements.scheduleGrid.children.length === 0 && (!elements.searchInput || !elements.searchInput.value)) {
          elements.emptyState.classList.remove('active');
      }
    } else if (view === 'calendar') {
      if (elements.emptyState) elements.emptyState.classList.remove('active'); // Sembunyikan empty state di tampilan kalender
      if (elements.scheduleGrid) elements.scheduleGrid.classList.remove('active');
      if (elements.calendarView) elements.calendarView.classList.add('active');
      if (elements.gridViewBtn) elements.gridViewBtn.classList.remove('active');
      if (elements.calendarViewBtn) elements.calendarViewBtn.classList.add('active');
      if (calendarManager.calendarInstance) {
        calendarManager.rerenderEvents(allSchedulesFromFirestore); // Tampilkan semua di kalender
        setTimeout(() => calendarManager.calendarInstance.render(), 0); // Force rerender
      }
    }
    localStorage.setItem('lastView', view);
  },

  // handleDriveSelect: function(event) { // Fungsi ini tidak lagi relevan karena drive dropdown adalah link
  //   const url = event.target.value;
  //   if(url && url.startsWith('https://drive.google.com')) {
  //     window.open(url, "_blank");
  //   } else {
  //     alert('Link Google Drive tidak valid!');
  //   }
  //   event.target.selectedIndex = 0;
  // },

  closePopup: () => {
    if (elements.popup.modal) elements.popup.modal.classList.remove('active');
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
      if (elements.pwaPopup) elements.pwaPopup.querySelector('p').textContent = 
        'Untuk menambahkan ke Layar Utama: tekan tombol "Bagikan" lalu pilih "Tambah ke Layar Utama".';
      if (elements.installPwaBtn) elements.installPwaBtn.style.display = 'none';
    } else {
      if (elements.installPwaBtn) elements.installPwaBtn.style.display = 'inline-block';
    }
    if (elements.pwaPopup) elements.pwaPopup.classList.remove('hidden');
  },

  handlePWAInstall: async () => {
    if (uiController.deferredPrompt) {
      await uiController.deferredPrompt.prompt();
      const { outcome } = await uiController.deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      uiController.deferredPrompt = null; // Kosongkan setelah digunakan
    }
    if (elements.pwaPopup) elements.pwaPopup.classList.add('hidden');
  },

  // --- Fitur dari gemini - polos ---
  initFloatingMenu: () => {
    if (!elements.floatingMenu || !elements.menuToggle) return;

    // Welcome Animation (jika ini adalah kunjungan pertama atau logika tertentu)
    // Untuk contoh ini, kita akan jalankan sekali saat load jika menu belum diinisialisasi
    if (!uiController.isMenuInitialized && !localStorage.getItem('menuMoved')) {
      elements.floatingMenu.classList.add('welcome-animation');
      elements.menuToggle.innerHTML = `<span class="assistive-icon"></span>
        <svg class="welcome-text-circle" viewBox="0 0 100 100">
          <path id="textPathCircle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none"/>
          <text dy="-2">
            <textPath xlink:href="#textPathCircle" startOffset="50%" text-anchor="middle">
              GESER MENU
            </textPath>
          </text>
        </svg>`;
      elements.welcomeTextCircle = elements.floatingMenu.querySelector('.welcome-text-circle');
      // Pastikan SVG terlihat selama animasi
      if(elements.welcomeTextCircle) elements.welcomeTextCircle.style.opacity = '1';

      setTimeout(() => {
        elements.floatingMenu.classList.remove('welcome-animation');
        if (elements.welcomeTextCircle) elements.welcomeTextCircle.style.opacity = '0';
        // Kembalikan ke posisi default atau yang tersimpan
        uiController.positionMenu();
        if (elements.menuToggle.querySelector('svg')) elements.menuToggle.querySelector('svg').remove(); // Hapus SVG teks
        // Kembalikan ikon menu default jika perlu (jika SVG menggantikannya sepenuhnya)
        if (!elements.menuToggle.querySelector('.assistive-icon')) {
            elements.menuToggle.innerHTML = '<span class="assistive-icon"></span>';
        }
      }, 3500); // Durasi animasi selamat datang
    } else {
      uiController.positionMenu(); // Langsung posisikan jika bukan animasi welcome
    }

    // Draggable Menu
    elements.menuToggle.addEventListener('mousedown', (e) => {
      if (e.target.closest('.menu-content')) return; // Jangan drag jika klik di dalam konten menu
      elements.isDraggingMenu = true;
      elements.floatingMenu.classList.add('dragging'); // Tambah kelas saat drag
      elements.floatingMenu.style.transition = 'none'; // Matikan transisi saat drag
      const rect = elements.floatingMenu.getBoundingClientRect();
      elements.menuOffsetX = e.clientX - rect.left;
      elements.menuOffsetY = e.clientY - rect.top;
      document.body.style.userSelect = 'none'; // Cegah seleksi teks saat drag
    });

    document.addEventListener('mousemove', (e) => {
      if (!elements.isDraggingMenu) return;
      let newX = e.clientX - elements.menuOffsetX;
      let newY = e.clientY - elements.menuOffsetY;

      // Batasi pergerakan menu di dalam viewport
      const menuRect = elements.floatingMenu.getBoundingClientRect();
      newX = Math.max(0, Math.min(newX, window.innerWidth - menuRect.width));
      newY = Math.max(0, Math.min(newY, window.innerHeight - menuRect.height));

      elements.floatingMenu.style.left = `${newX}px`;
      elements.floatingMenu.style.top = `${newY}px`;
      elements.floatingMenu.style.right = 'auto'; // Override CSS jika ada
      elements.floatingMenu.style.bottom = 'auto'; // Override CSS jika ada
    });

    document.addEventListener('mouseup', () => {
      if (elements.isDraggingMenu) {
        elements.isDraggingMenu = false;
        elements.floatingMenu.classList.remove('dragging'); // Hapus kelas saat drag selesai
        elements.floatingMenu.style.transition = ''; // Aktifkan kembali transisi
        document.body.style.userSelect = '';
        // Simpan posisi menu
        localStorage.setItem('menuPosition', JSON.stringify({
          left: elements.floatingMenu.style.left,
          top: elements.floatingMenu.style.top
        }));
        localStorage.setItem('menuMoved', 'true'); // Tandai bahwa menu pernah digeser
      }
    });
    uiController.isMenuInitialized = true;
  },

  positionMenu: () => {
    const savedPosition = localStorage.getItem('menuPosition');
    if (savedPosition && elements.floatingMenu) {
      const pos = JSON.parse(savedPosition);
      elements.floatingMenu.style.left = pos.left;
      elements.floatingMenu.style.top = pos.top;
      elements.floatingMenu.style.right = 'auto';
      elements.floatingMenu.style.bottom = 'auto';
    } else if (elements.floatingMenu) {
        // Set posisi default jika tidak ada yang tersimpan (misalnya, kanan atas)
        elements.floatingMenu.style.top = '20px';
        elements.floatingMenu.style.right = '20px';
        elements.floatingMenu.style.left = 'auto';
        elements.floatingMenu.style.bottom = 'auto';
    }
  },
};

// Initialize Application
document.addEventListener('DOMContentLoaded', uiController.init);
