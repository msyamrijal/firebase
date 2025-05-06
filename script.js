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
      "2025-04-21": { peserta: ["Noviyatul Badriyah", "Ibnatul Mardiah"], materi: "", time: "" },
      "2025-04-28": { peserta: ["Nailul Khoiril Marom", "M. Syamsur Rijal"], materi: "", time: "" },
      "2025-05-05": { peserta: ["Nurul Huda", "M. Iskhak Nawawi"], materi: "", time: "" },
      "2025-05-12": { peserta: ["Nur Kholisah", "Nurul Jannah"], materi: "", time: "" },
      "2025-05-19": { peserta: ["Saepul", "M. Imdadur Rachman"], materi: "", time: "" },
      "2025-05-26": { peserta: ["Yolan Hardika Pratama", "Muh. Ikbal Amsah"], materi: "", time: "" },
      "2025-06-02": { peserta: ["Farhani Azkia", "Putri Salsabila Azkya"], materi: "", time: "" },
      "2025-06-09": { peserta: ["Salman Alfarezi", "M. Subulul Hikam"], materi: "", time: "" },
      "2025-06-16": { peserta: ["M. Imran", "Zaky Zimmatillah Zulfikar"], materi: "", time: "" },
      "2025-06-23": { peserta: ["M. Imdadur Rachman", "Muh. Ikbal Amsah"], materi: "", time: "" }
    },
    "Filsafat Ilmu": {
      "2025-04-21": { peserta: ["M. Subulul Hikam", "Zaeni Anwar"], materi: "", time: "" },
      "2025-04-28": { peserta: ["Nurul Jannah", "Farhani Azkia"], materi: "", time: "" },
      "2025-05-05": { peserta: ["M. Iskhak Nawawi", "Zaky Zimmatillah Zulfikar"], materi: "", time: "" },
      "2025-05-12": { peserta: ["Nailul Khoiril Marom", "Yolan Hardika Pratama"], materi: "", time: "" },
      "2025-05-19": { peserta: ["Siti Muliana", "Noviyatul Badriyah"], materi: "", time: "" },
      "2025-05-26": { peserta: ["M. Syamsur Rijal", "Nur Ardhiansyah KH"], materi: "", time: "" },
      "2025-06-02": { peserta: ["Muh. Ikbal Amsah", "Zulfi Fadhlurrahman"], materi: "", time: "" },
      "2025-06-09": { peserta: ["Saepul", "Rusdi"], materi: "", time: "" }
    },
    "Pendekatan dalam Kajian Islam": {
      "2025-04-28": { peserta: ["Saepul", "Salman Alfarezi", "Nurul Huda", "Rusdi"], materi: "", time: "" },
      "2025-05-05": { peserta: ["Yolan Hardika Pratama", "Zaeni Anwar"], materi: "", time: "" },
      "2025-05-12": { peserta: ["Zaky Zimmatillah Zulfikar", "Zulfi Fadhlurrahman"], materi: "", time: "" },
      "2025-05-19": { peserta: ["Farhani Azkia", "Hilya Hasna Nabila"], materi: "", time: "" },
      "2025-05-26": { peserta: ["Ibnatul Mardiah", "Noviyatul Badriyah"], materi: "", time: "" },
      "2025-06-02": { peserta: ["Nur Kholisah", "Nurul Jannah"], materi: "", time: "" },
      "2025-06-09": { peserta: ["Putri Salsabila Azkya", "Siti Muliana"], materi: "", time: "" }
    },
    "Ulumul Qur’an": {
      "2025-04-24": { peserta: ["M. Imran", "Putri Salsabila Azkya"], materi: "", time: "" },
      "2025-05-01": { peserta: ["M. Imdadur Rachman", "Rusdi"], materi: "", time: "" },
      "2025-05-08": { peserta: ["Zaky Zimmatillah Zulfikar", "Nur Ardhiansyah KH"], materi: "", time: "" },
      "2025-05-15": { peserta: ["M. Syamsur Rijal", "Farhani Azkia"], materi: "", time: "" },
      "2025-05-22": { peserta: ["Saepul", "M. Subulul Hikam"], materi: "", time: "" },
      "2025-05-29": { peserta: ["Zaeni Anwar", "Muh. Ikbal Amsah"], materi: "", time: "" },
      "2025-06-05": { peserta: ["Siti Muliana", "Nurul Huda"], materi: "", time: "" },
      "2025-06-12": { peserta: ["Yolan Hardika Pratama"], materi: "", time: "" },
      "2025-06-19": { peserta: ["Nailul Khoiril Marom"], materi: "", time: "" }
    },
    "Sejarah dan Pemikiran Tafsir di Indonesia": {
      "2025-04-24": { peserta: ["Farhani Azkia", "Putri Salsabila Azkya"], materi: "", time: "" },
      "2025-05-01": { peserta: ["Muhamad Imdadur Rachman", "Zaky Zimmatillah Zulfikar"], materi: "", time: "" },
      "2025-05-08": { peserta: ["Zaeni Anwar", "Zulfi Fadhlurrahman"], materi: "", time: "" },
      "2025-05-15": { peserta: ["Nurul Huda", "Muchamad Subulul Hikam"], materi: "", time: "" },
      "2025-05-22": { peserta: ["Yolan Hardika Pratama", "Rusdi"], materi: "", time: "" },
      "2025-05-29": { peserta: ["Muhammad Syamsur Rijal", "Nur Ardhiansyah Khalillurahman Ibrahim"], materi: "", time: "" },
      "2025-06-05": { peserta: ["Mukhamad Iskhak Nawawi", "Nailul Khoiril Marom"], materi: "", time: "" },
      "2025-06-12": { peserta: ["Saepul", "Salman Alfarezi"], materi: "", time: "" },
      "2025-06-19": { peserta: ["Hilya Hasna Nabila", "Nur Kholisah"], materi: "", time: "" }
    },
    "Sejarah Pemikiran Islam": {
      "2025-04-24": { peserta: ["M. Syamsur Rijal", "Nur Kholisah", "Nurul Huda", "Zaky Zimmatillah Zulfikar"], materi: "", time: "" },
      "2025-05-01": { peserta: ["M. Subulul Hikam", "Zaeni Anwar", "M. Imdadur Rachman", "M. Imran"], materi: "", time: "" },
      "2025-05-08": { peserta: ["Nailul Khoiril Marom", "Saepul", "Zulfi Fadhlurrahman", "Salman Alfarezi"], materi: "", time: "" },
      "2025-05-15": { peserta: ["Yolan Hardika Pratama", "Rusdi", "Hilya Hasna Nabila", "Muh. Ikbal Amsah"], materi: "", time: "" },
      "2025-05-22": { peserta: ["Nur Ardhiansyah KH", "Siti Muliana", "Nurul Jannah", "Noviyatul Badriyah"], materi: "", time: "" },
      "2025-05-29": { peserta: ["Putri Salsabila Azkya", "Farhani Azkia", "Ibnatul Mardiah", "M. Iskhak Nawawi"], materi: "", time: "" },
      "2025-06-05": { peserta: ["M. Syamsur Rijal", "Nur Kholisah", "Nurul Huda", "Zaky Zimmatillah Zulfikar"], materi: "", time: "" },
      "2025-06-12": { peserta: ["M. Subulul Hikam", "Zaeni Anwar", "M. Imdadur Rachman", "M. Imran"], materi: "", time: "" },
      "2025-06-19": { peserta: ["Nailul Khoiril Marom", "Saepul", "Zulfi Fadhlurrahman", "Salman Alfarezi"], materi: "", time: "" }
    }
  },
  
  "PKU B": {
  "Tarjih": {
    "2025-04-19": { peserta: ["Triyanti Nurhikmah", "Muhammad Syamsur Rijal", "Nailul Khoiril Marom", "Zaky Zimmatillah Zulfikar", "Zaeni Anwar", "Nurul Huda", "Muhamad Imdadur Rachman"], materi: "", time: "" },
    "2025-04-26": { peserta: ["Nurfaizah Jamaluddin", "Rusdi", "Mukhamad Iskhak Nawawi", "Muhammad Imran", "Salman Alfarezi Muchamad", "Zulfi Fadhlurrahman"], materi: "", time: "" },
    "2025-05-03": { peserta: ["Saepul", "Subulul Hikam", "Umiatu Rohmah", "Yolan Hardika Pratama", "Muh. Ikbal Amsah", "Nur Ardhiansyah Khalillurahman Ibrahim"], materi: "", time: "" }
  },
  "Epistemologi Islam": {
    "2025-04-23": { peserta: ["Umiatu Rohmah", "Muchamad Subulul Hikam"], materi: "", time: "" },
    "2025-04-30": { peserta: ["Yolan Hardika Pratama"], materi: "", time: "" },
    "2025-05-07": { peserta: ["Triyanti Nurhikmah"], materi: "", time: "" },
    "2025-05-14": { peserta: ["Salman Alfarezi"], materi: "", time: "" },
    "2025-05-21": { peserta: ["Zaeni Anwar"], materi: "", time: "" },
    "2025-05-28": { peserta: ["Zaky Zimmatillah Zulfikar"], materi: "", time: "" },
    "2025-06-04": { peserta: ["Nurul Huda"], materi: "", time: "" },
    "2025-06-11": { peserta: ["Saepul"], materi: "", time: "" },
    "2025-06-18": { peserta: ["Nurfaizah Jamaluddin"], materi: "", time: "" },
    "2025-06-25": { peserta: ["Mukhamad Iskhak Nawawi"], materi: "", time: "" }
  },
  "Bahasa Arab": {
    "2025-04-22": { peserta: ["Muhammad Imran", "Muh. Ikbal Amsah"], materi: "", time: "" },
    "2025-04-29": { peserta: ["Nailul Khoiril Marom", "Muhamad Imdadur Rachman"], materi: "", time: "" },
    "2025-05-06": { peserta: ["Zulfi Fadhlurrahman", "Muhammad Syamsur Rijal"], materi: "", time: "" },
    "2025-05-13": { peserta: ["Triyanti Nurhikmah", "Rusdi"], materi: "", time: "" },
    "2025-05-20": { peserta: ["Yolan Hardika Pratama", "Mukhamad Iskhak Nawawi"], materi: "", time: "" },
    "2025-05-27": { peserta: ["Nurul Huda", "Muchamad Subulul Hikam"], materi: "", time: "" },
    "2025-06-03": { peserta: ["Nur Ardiansyah K. I."], materi: "", time: "" }
  },
  "Perbandingan Madzhab": {
    "2025-04-22": { peserta: ["Nur Ardhiansyah Khalillurahman Ibrahim", "Nurfaizah Jamaluddin", "Zaky Zimmatillah Zulfikar", "Zulfi Fadhlurrahman"], materi: "", time: "" },
    "2025-04-29": { peserta: ["Nurul Huda", "Rusdi"], materi: "", time: "" },
    "2025-05-06": { peserta: ["Saepul", "Salman Al Farezi"], materi: "", time: "" },
    "2025-05-13": { peserta: ["Triyanti Nurkhikmah", "Umiatu Rohmah"], materi: "", time: "" }
  },
  "Kajian Lintas Agama": {
    "2025-04-30": { peserta: ["Salman Alfarezi", "Nurul Huda"], materi: "", time: "" },
    "2025-05-07": { peserta: ["Nurfaizah Jamaluddin", "Muhammad Syamsur Rijal"], materi: "", time: "" },
    "2025-05-14": { peserta: ["Triyanti Nurhikmah", "Muhamad Imdadur Rachman"], materi: "", time: "" },
    "2025-05-21": { peserta: ["Nailul Khoiril Marom", "Saepul"], materi: "", time: "" },
    "2025-05-28": { peserta: ["Muchamad Subulul Hikam", "Umiatu Rohmah"], materi: "", time: "" },
    "2025-06-04": { peserta: ["Yolan Hardika Pratama", "Muh. Ikbal Amsah"], materi: "", time: "" },
    "2025-06-11": { peserta: ["Rusdi", "Mukhamad Iskhak Nawawi"], materi: "", time: "" },
    "2025-06-18": { peserta: ["Zaeni Anwar", "Zulfi Fadhlurrahman"], materi: "", time: "" }

  },
  "Tafsir Gender dan Sufisme": {
    "2025-04-25": { peserta: ["Nailul Khoiril Marom", "Umiatu Rohmah"], materi: "", time: "" },
    "2025-05-02": { peserta: ["Muchamad Subulul Hikam", "Rusdi"], materi: "", time: "" },
    "2025-05-09": { peserta: ["Muhammad Syamsur Rijal", "Muhamad Imdadur Rachman"], materi: "", time: "" },
    "2025-05-16": { peserta: ["Salman Alfarezi", "Muh. Ikbal Amsah"], materi: "", time: "" },
    "2025-05-23": { peserta: ["Yolan Hardika Pratama"], materi: "", time: "" },
    "2025-05-30": { peserta: ["Triyanti Nurhikmah"], materi: "", time: "" },
    "2025-06-06": { peserta: ["Saepul"], materi: "", time: "" },
    "2025-06-13": { peserta: ["Muhammad Imran"], materi: "", time: "" },
    "2025-06-20": { peserta: ["Nur Ardhiansyah Khalillurahman Ibrahim"], materi: "", time: "" }

  },
  "Bahasa Inggris": {
    "2025-04-18": { peserta: ["M. Iskhak Nawawi", "Nailul Khoiril Marom", "Nurul Huda", "Ahmad Mahrus"], materi: "", time: "" },
    "2025-04-25": { peserta: ["Ince", "Triyanti Nurhikmah", "Adam Azizi", "Zulfi Fadhlurrahman"], materi: "", time: "" },
    "2025-05-02": { peserta: ["Nurfaizah Jamaluddin", "Abdul Jabar", "Moh. Fadlurrahman"], materi: "", time: "" },
    "2025-05-09": { peserta: ["Umiatu Rohmah", "M. Iqbal", "Muhammad Imran"], materi: "", time: "" },
    "2025-05-16": { peserta: ["Azhar", "Hilal", "Salman Alfarezi"], materi: "", time: "" },
    "2025-05-23": { peserta: ["Darmawangsa", "Lukman", "Saepul"], materi: "", time: "" },
    "2025-05-30": { peserta: ["Muh. Ikbal Amsah", "Imamull Burhan", "Iqbal Salafuddin"], materi: "", time: "" },
    "2025-06-06": { peserta: ["Nur Ardiansyah K. I.", "Ahmad Sayyid", "M. Imdadur Rachman"], materi: "", time: "" },
    "2025-06-13": { peserta: ["Dannu", "Agung Setiabudi", "Yolan Hardika Pratama"], materi: "", time: "" },
    "2025-06-20": { peserta: ["Al Fahrizal", "Zaky Zimmatillah Zulfikar", "Muchamad Subulul Hikam"], materi: "", time: "" },
    "2025-06-27": { peserta: ["Fasrul", "Zaeni Anwar", "Muhammad Syamsur Rijal"], materi: "", time: "" }
  },
  "Dakwah dan Komunikasi Islam": {
    "2025-04-18": { peserta: ["Muchamad Subulul Hikam (B)"], materi: "", time: "" },
    "2025-04-25": { peserta: ["Muh. Ikbal Amsah (B)"], materi: "", time: "" },
    "2025-05-02": { peserta: ["Muhamad Imdadur Rachman (B)"], materi: "", time: "" },
    "2025-05-09": { peserta: ["Muhammad Imran (B)"], materi: "", time: "" },
    "2025-05-16": { peserta: ["Muhammad Syamsur Rijal (B)"], materi: "", time: "" },
    "2025-05-23": { peserta: ["Mukhamad Iskhak Nawawi (B)"], materi: "", time: "" },
    "2025-05-30": { peserta: ["Nailul Khairil Marom (B)"], materi: "", time: "" },
    "2025-06-06": { peserta: ["Nur Ardhiansyah Khalillurahman Ibrahim (B)"], materi: "", time: "" },
    "2025-06-13": { peserta: ["Triyanti Nurhikmah (B)", "Nurfaizah Jamaluddin (B)"], materi: "", time: "" },
    "2025-06-20": { peserta: ["Umiatu Rohmah (B)", "Nurul Huda (B)"], materi: "", time: "" },
    "2025-06-27": { peserta: ["Yolan Hardika Pratama (B)", "Rusdi (B)"], materi: "", time: "" },
    "2025-07-04": { peserta: ["Zaeni Anwar (B)", "Saepul (B)"], materi: "", time: "" },
    "2025-07-11": { peserta: ["Zaky Zimmatillah Zulfikar (B)", "Salman Alfarezi (B)", "Zulfi Fadlurrahman (B)"], materi: "", time: "" }
  }
},
  
  "PKUP": {
  "Tafsir Prespektif Gender dan Sufisme": {
    "2025-04-25": { peserta: ["Noviatul Badriyah", "Nurul Jannah"], materi: "", time: "" },
    "2025-05-02": { peserta: ["Siti Muliana", "Ibnatul Mardhiyah"], materi: "", time: "" },
    "2025-05-09": { peserta: ["Nur Khalisah", "Farhani Azkiya"], materi: "", time: "" },
    "2025-05-16": { peserta: ["Hilya Hasna Nabila", "Putri Salsabila Azkiya"], materi: "", time: "" }
  },
  "Bahasa Arab": {
    "2025-04-18": { peserta: ["Hilya Hasna Nabila", "Nur Khalisah"], materi: "", time: "" },
    "2025-04-22": { peserta: ["Putri Salsabila Azkiya", "Farhani Azkiya"], materi: "", time: "" },
    "2025-04-25": { peserta: ["Siti Muliana", "Ibnatul Mardhiyah"], materi: "", time: "" },
    "2025-04-29": { peserta: ["Noviatul Badriyah", "Nurul Jannah"], materi: "", time: "" }
  },
  "Perbandingan Mazhab": {
    "2025-02-12": { peserta: ["Noviatul Badriyah", "Nurul Jannah"], materi: "", time: "" },
    "2025-02-19": { peserta: ["Nur Khalisah", "Farhani Azkiya"], materi: "", time: "" },
    "2025-02-26": { peserta: ["Hilya Hasna Nabila", "Ibnatul Mardhiyah"], materi: "", time: "" },
    "2025-04-16": { peserta: ["Putri Salsabila Azkiya", "Siti Muliana"], materi: "", time: "" },
    "2025-04-23": { peserta: ["Noviatul Badriyah", "Nurul Jannah"], materi: "", time: "" },
    "2025-04-30": { peserta: ["Nur Khalisah", "Farhani Azkiya"], materi: "", time: "" },
    "2025-05-07": { peserta: ["Hilya Hasna Nabila", "Ibnatul Mardhiyah"], materi: "", time: "" },
    "2025-05-14": { peserta: ["Putri Salsabila Azkiya", "Siti Muliana"], materi: "", time: "" },
    "2025-05-21": { peserta: ["Noviatul Badriyah", "Nurul Jannah"], materi: "", time: "" },
    "2025-05-28": { peserta: ["Nur Khalisah", "Farhani Azkiya"], materi: "", time: "" },
    "2025-06-04": { peserta: ["Hilya Hasna Nabila", "Ibnatul Mardhiyah"], materi: "", time: "" }
  },
  "Tafsir dan Fiqh Gender": {
    "2025-04-25": { peserta: ["Siti Muliana"], materi: "", time: "" },
    "2025-05-02": { peserta: ["Noviatul Badriyah"], materi: "", time: "" },
    "2025-05-09": { peserta: ["Hilya Hasna Nabila"], materi: "", time: "" },
    "2025-05-16": { peserta: ["Nurul Jannah"], materi: "", time: "" },
    "2025-05-23": { peserta: ["Farhani Azkiya"], materi: "", time: "" },
    "2025-05-30": { peserta: ["Putri Salsabila Azkiya"], materi: "", time: "" },
    "2025-06-06": { peserta: ["Nur Khalisah"], materi: "", time: "" },
    "2025-06-13": { peserta: ["Ibnatul Mardhiyyah"], materi: "", time: "" }
  },
  "Konsep dan Teori Gender": {
    "2025-02-14": { peserta: ["Farhani Azkiya"], materi: "", time: "" },
    "2025-02-21": { peserta: ["Hilya Hasna Nabila"], materi: "", time: "" },
    "2025-02-28": { peserta: ["Ibnatul Mardhiyyah"], materi: "", time: "" },
    "2025-04-18": { peserta: ["Noviatul Badriyah"], materi: "", time: "" },
    "2025-04-25": { peserta: ["Nur Khalisah"], materi: "", time: "" },
    "2025-05-02": { peserta: ["Nurul Jannah"], materi: "", time: "" },
    "2025-05-09": { peserta: ["Putri Salsabila Azkiya"], materi: "", time: "" },
    "2025-05-16": { peserta: ["Siti Muliana"], materi: "", time: "" }
  }
},

"PTIQ G": {
  "Filsafat Ilmu": {
    "2025-02-10": { peserta: ["Dannu Akbar", "Lukman"], materi: "Cara sederhana berfikir kritis, Asal mula pengetahuan", time: "10:00" },
    "2025-02-17": { peserta: ["Al Fahrizal", "Ahmad Mahrus Mariadi"], materi: "Pergulatan antara rasionalitas dan takhayyul, Kritisisme rasional", time: "10:00" },
    "2025-02-24": { peserta: ["Abdul Jabbar", "Azhar Ahmad Falahan"], materi: "Argumen lego-atom democritus, Takdir dalam dunia filsafat", time: "10:00" },
    "2025-04-14": { peserta: ["Elvin Maulidin Ikhsan", "Agung Setiabudi"], materi: "Rasionalisme mistis socrates, Idealisme plato", time: "10:00" }
  },
  "Sejarah Peradaban Islam": {
    "2025-06-09": { peserta: ["Agung Setiabudi"], materi: "Peradaban Islam Dinasti Ottoman", time: "08:00" },
    "2025-06-16": { peserta: ["Iqbal Salafuddin Zaini"], materi: "Renaissance dan Kemajuan Peradaban Barat", time: "08:00" },
    "2025-06-23": { peserta: ["Lukman"], materi: "Teori-teori Kebangkitan Peradaban Islam dan Realitasnya", time: "08:00" }
  },
  "Pendekatan Dalam Pengkajian Islam": {
    "2025-02-10": { peserta: ["Agung Setiabudi", "Lukman", "Ahmad Sayyid Al Adam"], materi: "Urgensi aneka pendekatan dalam Kajian Islam", time: "13:00" },
    "2025-02-17": { peserta: ["Darmawangsa", "Ahmad Mahrus Mariadi"], materi: "Konsep Tauhid, Kholifah Fil Ardh, dan Integrasi Keilmuan", time: "13:00" }
  },
  "Sejarah Dan Pemikiran Tafsir Di Indonesia": {
    "2025-06-05": { peserta: ["Agung Setiabudi", "Ince Atika Ramadhani"], materi: "Tafsir Surah 'Amma Bil-Lughah al-Buqisiyyah - Tafasere Bahasa Ugi'na Surah Amma", time: "10:00" },
    "2025-06-12": { peserta: ["Khofawati Khoiriyyah", "Al Fahrizal"], materi: "ترجمان المستفيد", time: "10:00" },
    "2025-06-19": { peserta: ["Azhar Ahmad Falahan", "Nurfaizah Jamaluddin"], materi: "فيض الرحمن", time: "10:00" }
  },
  "Ulumul Qur'An": {
    "2025-02-13": { peserta: ["Muhamad Iqbal", "Imamul Burhan"], materi: "Ulumul Quran: Pengertian, Sejarah, Ruang Lingkup Bahasan, dan Tokoh-Tokoh Penting", time: "08:00" },
    "2025-02-20": { peserta: ["Agung Setiabudi", "Abdul Jabar"], materi: "Metodologi Tafsir: Pengertian, Sejarah, dan Kecenderungan Sunni dan Syiah di Dalamnya", time: "08:00" }
  },
  "Sejarah Pemikiran Islam": {
    "2025-06-19": { peserta: ["Ahmad Sayyid Al Adam"], materi: "Pembaharuan Islam di Indonesia: Sejarah Lahirnya Muhammadiyah serta Pemikirannya", time: "13:00" },
    "2025-06-26": { peserta: ["Al Fahrizal"], materi: "Pembaharuan Islam di Indonesia: Sejarah Lahirnya NU serta Pemikirannya", time: "13:00" }
  }
},

"PTIQ H": {
  "Sejarah Peradaban Islam": {
    "2025-05-12": { peserta: ["Nurul Huda", "Muhammad Iskhak Nawawi"], materi: "Peradaban Islam Masa Khulafaur Rosyidin", time: "08:00" },
    "2025-05-19": { peserta: ["Nur Kholisah", "Nurul Jannah"], materi: "Peradaban Islam Daulah Amawiyah", time: "08:00" }
  },
  "Filsafat Ilmu": {
    "2025-05-26": { peserta: ["Muhammad Syamsur Rijal", "Nur Ardhiansyah KH"], materi: "Hegel, Kierkegaard", time: "10:00" },
    "2025-06-02": { peserta: ["Muh. Ikbal Amsah", "Zulfi Fadhlurrahman"], materi: "Marx, Darwin", time: "10:00" },
    "2025-06-09": { peserta: ["Saepul", "Rusdi"], materi: "Freud, Dentuman Besar", time: "10:00" }
  },
  "Pendekatan dalam Kajian Islam": {
    "2025-04-28": { peserta: ["Saepul", "Salman Alfarezi", "Nurul Huda", "Rusdi"], materi: "Pendekatan ekonomi", time: "13:00" },
    "2025-05-05": { peserta: ["Yolan Hardika Pratama", "Zaeni Anwar"], materi: "Pendekatan seni dan budaya", time: "13:00" }
  },
  "Ulumul Qur'an": {
    "2025-05-29": { peserta: ["Saepul", "Muhammad Subulul Hikam"], materi: "Al-Qur’an dalam Tujuh Huruf: Hadis-hadis Relevan dan Perbedaan Qiraat Tujuh dan Tujuh Huruf", time: "08:00" },
    "2025-06-05": { peserta: ["Zaeni Anwar", "Muh. Ikbal Amsah"], materi: "Ilmi AI’Qur'an Sumber Ilmu Pengetahuan: Ilmu Pengetahuan Agama, Ilmu Pengetahuan Umum, Teori Ilmu Pengetahuan Qurani, dan Tafsir", time: "08:00" },
    "2025-06-12": { peserta: ["Siti Muliana", "Nurul Huda"], materi: "Kisah-kisah dalam Al-Qursan: Esensi, Pengulangan, Hikmah, dan Macam-macamnya", time: "08:00" },
    "2025-06-19": { peserta: ["Yolan Hardika Pratama"], materi: "Amtsal Al-Qursan: Esensi, Hikmah, dan Macam-macamnya", time: "08:00" },
    "2025-06-26": { peserta: ["Nailul Khoiril Marom"], materi: "Aqsam Al-Qur’an: Esensi, Unsur-unsur, Hikmah, dan Macam-macamnya", time: "08:00" }
  },
  "Sejarah dan Pemikiran Tafsir di Indonesia": {
    "2025-04-24": { peserta: ["Farhani Azkia", "Putri Salsabila Azkya"], materi: "Turjumanul Mustafid", time: "10:00" },
    "2025-05-08": { peserta: ["Muhamad Imdadur Rachman", "Zaky Zimmatillah Zulfikar"], materi: "Faidurrahman", time: "10:00" }
  },
  "Sejarah Pemikiran Islam": {
    "2025-06-12": { peserta: ["Muhammad Subulul Hikam", "Zaeni Anwar", "Muhammad Imdadur Rachman", "Muhammad Imran"], materi: "Latar Belakang lahirnya Muhammadiyah dan Nahdlatul ‘Ulama di Indonesia", time: "13:00" },
    "2025-06-19": { peserta: ["Nailul Khoiril Marom", "Saepul", "Zulfi Fadhlurrahman", "Salman Alfarezi"], materi: "Posisi dan peran akal dan wahyu dalam memahami pesan keagamaan", time: "13:00" }
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
      locale: 'id', // Bahasa Indonesia
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      events: calendarManager.generateEvents(),
      eventClick: (info) => {
        elements.popup.content.innerHTML = info.event.extendedProps.detail; // Langsung gunakan HTML dari detail
        elements.popup.overlay.style.display = 'block';
        elements.popup.container.style.display = 'block';
      }
    });
  },

  generateEvents: () => {
    return Object.entries(dataByClass).reduce((events, [className, subjects]) => {
      Object.entries(subjects).forEach(([subject, dates]) => {
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
  init: () => {
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
    
    // Initialize Calendar
    const calendar = calendarManager.init();
    calendar.render();

    // Initialize PWA
    uiController.initPWA();

    // Initialize Icon Toggles
    iconToggleManager.init();
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
