// service-worker-registration.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('ServiceWorker registered'))
      .catch(err => console.log('ServiceWorker registration failed:', err));
  });
}

// app.js
const dataByClass = {
  "PTIQ": {
    "Sejarah Peradaban Islam": {
      "2025-04-21": ["Noviyatul Badriyah", "Ibnatul Mardiah"],
      "2025-04-28": ["Nailul Khoiril Marom", "M. Syamsur Rijal"],
      "2025-05-05": ["Nurul Huda", "M. Iskhak Nawawi"],
      "2025-05-12": ["Nur Kholisah", "Nurul Jannah"],
      "2025-05-19": ["Saepul", "M. Imdadur Rachman"],
      "2025-05-26": ["Yolan Hardika Pratama", "Muh. Ikbal Amsah"],
      "2025-06-02": ["Farhani Azkia", "Putri Salsabila Azkya"],
      "2025-06-09": ["Salman Alfarezi", "M. Subulul Hikam"],
      "2025-06-16": ["M. Imran", "Zaky Zimmatillah Zulfikar"],
      "2025-06-23": ["M. Imdadur Rachman", "Muh. Ikbal Amsah"]
    },
    "Filsafat Ilmu": {
      "2025-04-21": ["M. Subulul Hikam", "Zaeni Anwar"],
      "2025-04-28": ["Nurul Jannah", "Farhani Azkia"],
      "2025-05-05": ["M. Iskhak Nawawi", "Zaky Zimmatillah Zulfikar"],
      "2025-05-12": ["Nailul Khoiril Marom", "Yolan Hardika Pratama"],
      "2025-05-19": ["Siti Muliana", "Noviyatul Badriyah"],
      "2025-05-26": ["M. Syamsur Rijal", "Nur Ardhiansyah KH"],
      "2025-06-02": ["Muh. Ikbal Amsah", "Zulfi Fadhlurrahman"],
      "2025-06-09": ["Saepul", "Rusdi"]
    },
    "Pendekatan dalam Kajian Islam": {
      "2025-04-28": ["Saepul", "Salman Alfarezi", "Nurul Huda", "Rusdi"],
      "2025-05-05": ["Yolan Hardika Pratama", "Zaeni Anwar"],
      "2025-05-12": ["Zaky Zimmatillah Zulfikar", "Zulfi Fadhlurrahman"],
      "2025-05-19": ["Farhani Azkia", "Hilya Hasna Nabila"],
      "2025-05-26": ["Ibnatul Mardiah", "Noviyatul Badriyah"],
      "2025-06-02": ["Nur Kholisah", "Nurul Jannah"],
      "2025-06-09": ["Putri Salsabila Azkya", "Siti Muliana"]
    },
    "Ulumul Qur’an": {
      "2025-04-24": ["M. Imran", "Putri Salsabila Azkya"],
      "2025-05-01": ["M. Imdadur Rachman", "Rusdi"],
      "2025-05-08": ["Zaky Zimmatillah Zulfikar", "Nur Ardhiansyah KH"],
      "2025-05-15": ["M. Syamsur Rijal", "Farhani Azkia"],
      "2025-05-22": ["Saepul", "M. Subulul Hikam"],
      "2025-05-29": ["Zaeni Anwar", "Muh. Ikbal Amsah"],
      "2025-06-05": ["Siti Muliana", "Nurul Huda"],
      "2025-06-12": ["Yolan Hardika Pratama"],
      "2025-06-19": ["Nailul Khoiril Marom"]
    },
    "Sejarah dan Pemikiran Tafsir di Indonesia": {
      "2025-04-24": ["Farhani Azkia", "Putri Salsabila Azkya"],
      "2025-05-01": ["Muhamad Imdadur Rachman", "Zaky Zimmatillah Zulfikar"],
      "2025-05-08": ["Zaeni Anwar", "Zulfi Fadhlurrahman"],
      "2025-05-15": ["Nurul Huda", "Muchamad Subulul Hikam"],
      "2025-05-22": ["Yolan Hardika Pratama", "Rusdi"],
      "2025-05-29": ["Muhammad Syamsur Rijal", "Nur Ardhiansyah Khalillurahman Ibrahim"],
      "2025-06-05": ["Mukhamad Iskhak Nawawi", "Nailul Khoiril Marom"],
      "2025-06-12": ["Saepul", "Salman Alfarezi"],
      "2025-06-19": ["Hilya Hasna Nabila", "Nur Kholisah"]
    },
    "Sejarah Pemikiran Islam": {
      "2025-04-24": ["M. Syamsur Rijal", "Nur Kholisah", "Nurul Huda", "Zaky Zimmatillah Zulfikar"],
      "2025-05-01": ["M. Subulul Hikam", "Zaeni Anwar", "M. Imdadur Rachman", "M. Imran"],
      "2025-05-08": ["Nailul Khoiril Marom", "Saepul", "Zulfi Fadhlurrahman", "Salman Alfarezi"],
      "2025-05-15": ["Yolan Hardika Pratama", "Rusdi", "Hilya Hasna Nabila", "Muh. Ikbal Amsah"],
      "2025-05-22": ["Nur Ardhiansyah KH", "Siti Muliana", "Nurul Jannah", "Noviyatul Badriyah"],
      "2025-05-29": ["Putri Salsabila Azkya", "Farhani Azkia", "Ibnatul Mardiah", "M. Iskhak Nawawi"],
      "2025-06-05": ["M. Syamsur Rijal", "Nur Kholisah", "Nurul Huda", "Zaky Zimmatillah Zulfikar"],
      "2025-06-12": ["M. Subulul Hikam", "Zaeni Anwar", "M. Imdadur Rachman", "M. Imran"],
      "2025-06-19": ["Nailul Khoiril Marom", "Saepul", "Zulfi Fadhlurrahman", "Salman Alfarezi"]
    }
  },
  
  "PKU B": {
  "Tarjih": {
    "2025-04-19": ["Triyanti Nurhikmah", "Muhammad Syamsur Rijal", "Nailul Khoiril Marom", "Zaky Zimmatillah Zulfikar", "Zaeni Anwar", "Nurul Huda", "Muhamad Imdadur Rachman"],
    "2025-04-26": ["Nurfaizah Jamaluddin", "Rusdi", "Mukhamad Iskhak Nawawi", "Muhammad Imran", "Salman Alfarezi Muchamad", "Zulfi Fadhlurrahman"],
    "2025-05-03": ["Saepul", "Subulul Hikam", "Umiatu Rohmah", "Yolan Hardika Pratama", "Muh. Ikbal Amsah", "Nur Ardhiansyah Khalillurahman Ibrahim"]
  },
  "Epistemologi Islam": {
    "2025-04-23": ["Umiatu Rohmah", "Muchamad Subulul Hikam"],
    "2025-04-30": ["Yolan Hardika Pratama"],
    "2025-05-07": ["Triyanti Nurhikmah"],
    "2025-05-14": ["Salman Alfarezi"],
    "2025-05-21": ["Zaeni Anwar"],
    "2025-05-28": ["Zaky Zimmatillah Zulfikar"],
    "2025-06-04": ["Nurul Huda"],
    "2025-06-11": ["Saepul"],
    "2025-06-18": ["Nurfaizah Jamaluddin"],
    "2025-06-25": ["Mukhamad Iskhak Nawawi"]
  },
  "Bahasa Arab": {
    "2025-04-22": ["Muhammad Imran", "Muh. Ikbal Amsah"],
    "2025-04-29": ["Nailul Khoiril Marom", "Muhamad Imdadur Rachman"],
    "2025-05-06": ["Zulfi Fadhlurrahman", "Muhammad Syamsur Rijal"],
    "2025-05-13": ["Triyanti Nurhikmah", "Rusdi"],
    "2025-05-20": ["Yolan Hardika Pratama", "Mukhamad Iskhak Nawawi"],
    "2025-05-27": ["Nurul Huda", "Muchamad Subulul Hikam"],
    "2025-06-03": ["Nur Ardiansyah K. I."]
  },
  "Perbandingan Madzhab": {
    "2025-04-22": ["Nur Ardhiansyah Khalillurahman Ibrahim", "Nurfaizah Jamaluddin", "Zaky Zimmatillah Zulfikar", "Zulfi Fadhlurrahman"],
    "2025-04-29": ["Nurul Huda", "Rusdi"],
    "2025-05-06": ["Saepul", "Salman Al Farezi"],
    "2025-05-13": ["Triyanti Nurkhikmah", "Umiatu Rohmah"]
  },
  "Kajian Lintas Agama": {
    "2025-04-30": ["Salman Alfarezi", "Nurul Huda"],
    "2025-05-07": ["Nurfaizah Jamaluddin", "Muhammad Syamsur Rijal"],
    "2025-05-14": ["Triyanti Nurhikmah", "Muhamad Imdadur Rachman"],
    "2025-05-21": ["Nailul Khoiril Marom", "Saepul"],
    "2025-05-28": ["Muchamad Subulul Hikam", "Umiatu Rohmah"],
    "2025-06-04": ["Yolan Hardika Pratama", "Muh. Ikbal Amsah"],
    "2025-06-11": ["Rusdi", "Mukhamad Iskhak Nawawi"],
    "2025-06-18": ["Zaeni Anwar", "Zulfi Fadhlurrahman"]

  },
  "Tafsir Gender dan Sufisme": {
    "2025-04-25": ["Nailul Khoiril Marom", "Umiatu Rohmah"],
    "2025-05-02": ["Muchamad Subulul Hikam", "Rusdi"],
    "2025-05-09": ["Muhammad Syamsur Rijal", "Muhamad Imdadur Rachman"],
    "2025-05-16": ["Salman Alfarezi", "Muh. Ikbal Amsah"],
    "2025-05-23": ["Yolan Hardika Pratama"],
    "2025-05-30": ["Triyanti Nurhikmah"],
    "2025-06-06": ["Saepul"],
    "2025-06-13": ["Muhammad Imran"],
    "2025-06-20": ["Nur Ardhiansyah Khalillurahman Ibrahim"]

  },
  "Bahasa Inggris": {
    "2025-04-18": ["M. Iskhak Nawawi", "Nailul Khoiril Marom", "Nurul Huda", "Ahmad Mahrus"],
    "2025-04-25": ["Ince", "Triyanti Nurhikmah", "Adam Azizi", "Zulfi Fadhlurrahman"],
    "2025-05-02": ["Nurfaizah Jamaluddin", "Abdul Jabar", "Moh. Fadlurrahman"],
    "2025-05-09": ["Umiatu Rohmah", "M. Iqbal", "Muhammad Imran"],
    "2025-05-16": ["Azhar", "Hilal", "Salman Alfarezi"],
    "2025-05-23": ["Darmawangsa", "Lukman", "Saepul"],
    "2025-05-30": ["Muh. Ikbal Amsah", "Imamull Burhan", "Iqbal Salafuddin"],
    "2025-06-06": ["Nur Ardiansyah K. I.", "Ahmad Sayyid", "M. Imdadur Rachman"],
    "2025-06-13": ["Dannu", "Agung Setiabudi", "Yolan Hardika Pratama"],
    "2025-06-20": ["Al Fahrizal", "Zaky Zimmatillah Zulfikar", "Muchamad Subulul Hikam"],
    "2025-06-27": ["Fasrul", "Zaeni Anwar", "Muhammad Syamsur Rijal"]
  },
  "Dakwah dan Komunikasi Islam": {
    "2025-04-18": ["Muchamad Subulul Hikam (B)"],
    "2025-04-25": ["Muh. Ikbal Amsah (B)"],
    "2025-05-02": ["Muhamad Imdadur Rachman (B)"],
    "2025-05-09": ["Muhammad Imran (B)"],
    "2025-05-16": ["Muhammad Syamsur Rijal (B)"],
    "2025-05-23": ["Mukhamad Iskhak Nawawi (B)"],
    "2025-05-30": ["Nailul Khairil Marom (B)"],
    "2025-06-06": ["Nur Ardhiansyah Khalillurahman Ibrahim (B)"],
    "2025-06-13": ["Triyanti Nurhikmah (B)", "Nurfaizah Jamaluddin (B)"],
    "2025-06-20": ["Umiatu Rohmah (B)", "Nurul Huda (B)"],
    "2025-06-27": ["Yolan Hardika Pratama (B)", "Rusdi (B)"],
    "2025-07-04": ["Zaeni Anwar (B)", "Saepul (B)"],
    "2025-07-11": ["Zaky Zimmatillah Zulfikar (B)", "Salman Alfarezi (B)", "Zulfi Fadlurrahman (B)"]
  }
},
  
  "PKUP": {
  "Tafsir Prespektif Gender dan Sufisme": {
    "2025-04-25": ["Noviatul Badriyah", "Nurul Jannah"],
    "2025-05-02": ["Siti Muliana", "Ibnatul Mardhiyah"],
    "2025-05-09": ["Nur Khalisah", "Farhani Azkiya"],
    "2025-05-16": ["Hilya Hasna Nabila", "Putri Salsabila Azkiya"]
  },
  "Bahasa Arab": {
    "2025-04-18": ["Hilya Hasna Nabila", "Nur Khalisah"],
    "2025-04-22": ["Putri Salsabila Azkiya", "Farhani Azkiya"],
    "2025-04-25": ["Siti Muliana", "Ibnatul Mardhiyah"],
    "2025-04-29": ["Noviatul Badriyah", "Nurul Jannah"]
  },
  "Perbandingan Mazhab": {
    "2025-02-12": ["Noviatul Badriyah", "Nurul Jannah"],
    "2025-02-19": ["Nur Khalisah", "Farhani Azkiya"],
    "2025-02-26": ["Hilya Hasna Nabila", "Ibnatul Mardhiyah"],
    "2025-04-16": ["Putri Salsabila Azkiya", "Siti Muliana"],
    "2025-04-23": ["Noviatul Badriyah", "Nurul Jannah"],
    "2025-04-30": ["Nur Khalisah", "Farhani Azkiya"],
    "2025-05-07": ["Hilya Hasna Nabila", "Ibnatul Mardhiyah"],
    "2025-05-14": ["Putri Salsabila Azkiya", "Siti Muliana"],
    "2025-05-21": ["Noviatul Badriyah", "Nurul Jannah"],
    "2025-05-28": ["Nur Khalisah", "Farhani Azkiya"],
    "2025-06-04": ["Hilya Hasna Nabila", "Ibnatul Mardhiyah"]
  },
  "Tafsir dan Fiqh Gender": {
    "2025-04-25": ["Siti Muliana"],
    "2025-05-02": ["Noviatul Badriyah"],
    "2025-05-09": ["Hilya Hasna Nabila"],
    "2025-05-16": ["Nurul Jannah"],
    "2025-05-23": ["Farhani Azkiya"],
    "2025-05-30": ["Putri Salsabila Azkiya"],
    "2025-06-06": ["Nur Khalisah"],
    "2025-06-13": ["Ibnatul Mardhiyyah"]
  },
  "Konsep dan Teori Gender": {
    "2025-02-14": ["Farhani Azkiya"],
    "2025-02-21": ["Hilya Hasna Nabila"],
    "2025-02-28": ["Ibnatul Mardhiyyah"],
    "2025-04-18": ["Noviatul Badriyah"],
    "2025-04-25": ["Nur Khalisah"],
    "2025-05-02": ["Nurul Jannah"],
    "2025-05-09": ["Putri Salsabila Azkiya"],
    "2025-05-16": ["Siti Muliana"]
  }
}

};

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
  init: () => {
    return new FullCalendar.Calendar(elements.calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'id',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: calendarManager.generateEvents(),
      eventClick: info => {
        elements.popup.content.innerHTML = `<p>${info.event.extendedProps.detail}</p>`;
        elements.popup.overlay.style.display = 'block';
        elements.popup.container.style.display = 'block';
      }
    });
  },

  generateEvents: () => {
    return Object.entries(dataByClass).reduce((events, [className, subjects]) => {
      Object.entries(subjects).forEach(([subject, dates]) => {
        Object.entries(dates).forEach(([date, names]) => {
          events.push({
            title: `${names.slice(0,2).join(', ')}${names.length>2 ? ', ...' : ''}`,
            date,
            extendedProps: {
              detail: `Kelas: ${className}<br>Mata Kuliah: ${subject}<br>Nama: ${names.join(', ')}`
            }
          });
        });
      });
      return events;
    }, []);
  }
};

// Data Manager
const dataManager = {
  getFilteredData: (selectedClass, selectedSubject, nameQuery) => {
    const today = new Date().setHours(0,0,0,0);
    const classes = selectedClass === 'all' ? Object.keys(dataByClass) : [selectedClass];
    
    return classes.flatMap(className => {
      const subjects = dataByClass[className] || {};
      return Object.entries(subjects).flatMap(([subject, dates]) => {
        if(selectedSubject && subject !== selectedSubject) return [];
        return Object.entries(dates).flatMap(([date, names]) => {
          const eventDate = new Date(date).setHours(0,0,0,0);
          if(eventDate < today) return [];
          const hasMatch = nameQuery ? 
            names.some(name => name.toLowerCase().includes(nameQuery)) : true;
          return hasMatch ? [{ className, subject, date, names }] : [];
        });
      });
    }).sort((a,b) => new Date(a.date) - new Date(b.date));
  },

  renderResults: (results, query) => {
    elements.resultsDiv.innerHTML = '';
    
    results.forEach(({ className, subject, date, names }) => {
      const card = document.createElement('div');
      card.className = 'result-card';
      
      card.innerHTML = `
        <div class="card-meta">
          <i class="fa-solid fa-calendar-day"></i>
          <span class="card-date">${utils.formatDate(date)}</span>
        </div>
        <div class="card-meta">
          <i class="fa-solid fa-book"></i>
          <span>${subject}</span>
        </div>
        <div class="card-group">
          <i class="fa-solid fa-users"></i>
          ${names.map(name => 
            name.toLowerCase().includes(query) ? 
            `<span class="highlight">${name}</span>` : name
          ).join(', ')}
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

// UI Controller
const uiController = {
  deferredPrompt: null, // Untuk menyimpan event beforeinstallprompt
  init: () => {
    // Event Listeners
    elements.classSelect.addEventListener('change', uiController.handleClassChange);
    elements.subjectSelect.addEventListener('change', uiController.handleSearch);
    elements.nameInput.addEventListener('input', utils.debounce(uiController.handleSearch, 300));
    elements.driveDropdown.addEventListener("change", uiController.handleDriveSelect);
    document.getElementById('close-popup').addEventListener('click', uiController.closePopup);
    
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
    
    // Initialize Calendar
    const calendar = calendarManager.init();
    calendar.render();

    // Initialize PWA
    uiController.initPWA();
  },

  handleClassChange: () => {
    localStorage.setItem('selectedClass', elements.classSelect.value);
    uiController.updateSubjects();
    uiController.handleSearch();
  },

  updateSubjects: () => {
    const selectedClass = elements.classSelect.value;
    const subjects = selectedClass === 'all' ? 
      [...new Set(Object.values(dataByClass).flatMap(c => Object.keys(c)))] : 
      Object.keys(dataByClass[selectedClass] || {});
    
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
    const filteredData = dataManager.getFilteredData(
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
