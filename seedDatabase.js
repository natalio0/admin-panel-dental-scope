// --- PENTING: Ganti path ini dengan path file kunci Anda ---
// Pastikan file serviceAccountKey.json berada di folder yang sama.
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Anda mungkin perlu menambahkan databaseURL jika menggunakan Realtime Database,
  // tetapi untuk Firestore, ini sudah cukup.
});

const db = admin.firestore();
console.log("Firebase Admin SDK berhasil diinisialisasi.");

// --- DATA GEJALA (FACTS) ---
const gejalaData = [
  {
    id_gejala: "G1",
    deskripsi:
      "Gusi bawah depan sering berdarah saat sikat gigi, tidak sakit/bengkak, belum pernah scalling",
  },
  {
    id_gejala: "G2",
    deskripsi:
      "Gigi terlihat lebih panjang dari biasanya, gusi menyusut, sensitivitas meningkat, perubahan warna dekat garis gusi",
  },
  {
    id_gejala: "G3",
    deskripsi:
      "Gusi bawah depan membesar sejak 1 minggu, tidak sakit, tidak mudah berdarah",
  },
  {
    id_gejala: "G4",
    deskripsi:
      "Gigi bawah terasa kotor dan bau mulut, belum pernah membersihkan karang gigi",
  },
  {
    id_gejala: "G5",
    deskripsi:
      "Gigi depan bawah sedikit goyang, tidak sakit, tidak ada riwayat trauma",
  },
  {
    id_gejala: "G6",
    deskripsi:
      "Gusi turun kanan bawah, nyeri hebat, ada nanah, bau mulut, mobilitas gigi",
  },
  {
    id_gejala: "G7",
    deskripsi:
      "Gigi kuning, ada noda kehitaman tak hilang dengan sikat gigi, perokok berat",
  },
  {
    id_gejala: "G8",
    deskripsi:
      "Gusi turun anterior atas, nyeri hebat, ada nanah, bau mulut, tidak enak sikat gigi",
  },
  {
    id_gejala: "G9",
    deskripsi:
      "Gusi atas sering berdarah saat sikat gigi, nafas bau, gigi kasar, crowding RA/RB",
  },
  {
    id_gejala: "G10",
    deskripsi:
      "Usia 18 th, gusi turun dan goyang keseluruhan rahang, rajin sikat gigi & rutin ke drg",
  },
  {
    id_gejala: "G11",
    deskripsi:
      "Usia 20 th, gusi turun & goyang pada geraham pertama dan gigi depan tengah RB, rajin sikat gigi & rutin ke drg",
  },
  {
    id_gejala: "G12",
    deskripsi:
      "Gigi kanan belakang goyang, gigi tiruan tidak fit, perawatan gigi tiruan buruk, nafas bau",
  },
  {
    id_gejala: "G13",
    deskripsi:
      "Pasien epilepsi, gusi keseluruhan membesar tebal setelah minum obat (Antikonvulsan), tidak sakit",
  },
  {
    id_gejala: "G14",
    deskripsi:
      "Pasien anak, gusi gelap, bengkak, perdarahan spontan, ujung gusi mengendur, tidak suka makan buah",
  },
  {
    id_gejala: "G15",
    deskripsi:
      "Pasien poli jantung, gusi keseluruhan membesar tebal setelah minum obat jantung (calcium channel blockers), tidak sakit",
  },
  {
    id_gejala: "G16",
    deskripsi:
      "Gigi bawah depan sangat linu/ngilu bila minum dingin, belum pernah scalling",
  },
  {
    id_gejala: "G17",
    deskripsi:
      "Gusi bawah depan memerah dan mudah berdarah, baru 2 minggu lalu scalling",
  },
  {
    id_gejala: "G18",
    deskripsi:
      "Gusi depan atas membesar menutupi 1½ gigi, tidak sakit, mengganggu penampilan, tidak mudah berdarah, tidak ada riwayat obat",
  },
  {
    id_gejala: "G19",
    deskripsi:
      "Pasien transplantasi organ, gusi membesar tebal setelah minum obat (Immunosuppresan), tidak sakit",
  },
  {
    id_gejala: "G20",
    deskripsi:
      "Pasien hamil (bulan ke-6), gusi membesar depan atas, tidak sakit, terasa tebal (mulai bulan ke-4)",
  },
  {
    id_gejala: "G21",
    deskripsi:
      "Gigi goyang regio depan atas, gusi turun, tidak mudah berdarah, gigi belakang bawah hilang, perokok aktif",
  },
  {
    id_gejala: "G22",
    deskripsi:
      "Gusi kanan bawah belakang bengkak/membesar/mengganggu, riwayat trauma tertusuk duri ikan, tidak mudah berdarah",
  },
  {
    id_gejala: "G23",
    deskripsi: "Gusi menghitam, perokok berat, belum pernah ke dokter gigi",
  },
  {
    id_gejala: "G24",
    deskripsi:
      "Karang gigi sangat menumpuk, belum pernah membersihkan karang gigi",
  },
  {
    id_gejala: "G25",
    deskripsi:
      "Gigi bawah depan goyang, tidak sakit, riwayat jatuh/terbentur, gigi vital",
  },
  {
    id_gejala: "G26",
    deskripsi:
      "Pasien hamil trimester ketiga, gusi membesar kanan bawah, tidak sakit, tidak mudah berdarah",
  },
  {
    id_gejala: "G27",
    deskripsi:
      "Gusi kiri bawah sariawan karena tertusuk gigi atasnya yang tajam",
  },
  {
    id_gejala: "G28",
    deskripsi:
      "Pasien lansia, gigi depan RB banyak yang goyang, gigi lain sudah hilang",
  },
  {
    id_gejala: "G29",
    deskripsi:
      "Gusi depan bawah membesar, tidak sakit/berdarah, pemakai behel 4 tahun",
  },
  {
    id_gejala: "G30",
    deskripsi:
      "Gigi terasa sakit saat mengigit makanan keras anterior RA/RB, kebersihan mulut baik",
  },
  {
    id_gejala: "G31",
    deskripsi:
      "Gusi kanan/kiri atas mudah berdarah, lama tidak scalling, mengunyah satu sisi",
  },
  {
    id_gejala: "G32",
    deskripsi:
      "Laki-laki 28 th, datang untuk bersihkan karang gigi, rutin ke dokter gigi 6 bulan sekali",
  },
  {
    id_gejala: "G33",
    deskripsi:
      "Gusi depan atas merah/mudah berdarah saat sikat gigi dan belum pernah scalling",
  },
  {
    id_gejala: "G34",
    deskripsi:
      "Gigi memanjang/goyang, bau mulut/mulut kering, konsumsi obat pengencer darah",
  },
  {
    id_gejala: "G35",
    deskripsi:
      "Gigi lepas satu per satu, susah menggigit, nyeri sampai sendi saat mulut menutup",
  },
];

// --- DATA DIAGNOSIS (CONCLUSIONS) ---
const diagnosisData = [
  {
    id_diagnosis: "D1",
    nama: "Gingivitis marginalis kronis RB",
    perawatan: ["Scalling RA RB", "medikasi obat kumur", "DHE dan KIE"],
  },
  {
    id_diagnosis: "D2",
    nama: "Gingival Resesion",
    perawatan: [
      "Scalling dan Root Planning",
      "Penggunaan Obat Kumur Antiseptik",
      "DHE & KIE (Perubahan teknik menyikat gigi)",
      "Perawatan Bedah Gusi",
    ],
  },
  {
    id_diagnosis: "D3",
    nama: "Inflammatory Gingival Enlargement gigi 41,42, 43",
    perawatan: [
      "Scalling dan Root Planning",
      "Penggunaan Obat Kumur Antiseptik",
      "Eksisi hiperplasi gingiva (bedah gusi)",
      "DHE dan KIE",
    ],
  },
  {
    id_diagnosis: "D4",
    nama: "Gingivitis kronis RB",
    perawatan: [
      "Scalling RA RB",
      "DHE dan KIE",
      "pro bedah mulut ekstraksi gigi 38 dan 48 (impaksi)",
    ],
  },
  {
    id_diagnosis: "D5",
    nama: "Periodontitis kronis anterior RB",
    perawatan: [
      "Scalling RA RB",
      "splinting anterior RB",
      "DHE dan KIE",
      "pro prostodonsia pembuatan gigi tiruan RA",
    ],
  },
  {
    id_diagnosis: "D6",
    nama: "Acute Periodontitis RB",
    perawatan: [
      "Scalling & Root Planning",
      "Drainase Abses",
      "Irigasi Antiseptik",
      "Pemberian antibiotik sistemik",
      "Bedah Periodontal",
      "Pencabutan Gigi",
    ],
  },
  {
    id_diagnosis: "D7",
    nama: "Periodontitis kronis anterior RB",
    perawatan: [
      "Scalling RA RB",
      "medikasi obat kumur antiseptik",
      "edukasi pola hidup sehat",
    ],
  },
  {
    id_diagnosis: "D8",
    nama: "Acute Periodontitis anterior RA",
    perawatan: [
      "Scalling & Root Planning",
      "Drainase Abses",
      "Irigasi Antiseptik",
      "Pemberian antibiotik sistemik",
      "Bedah Periodontal",
      "Pencabutan Gigi",
    ],
  },
  {
    id_diagnosis: "D9",
    nama: "Gingivitis kronis anterior RA",
    perawatan: ["Scalling RA RB", "DHE dan KIE", "pro ortodonsia cekat"],
  },
  {
    id_diagnosis: "D10",
    nama: "Periodontitis Agressive RA & RB",
    perawatan: [
      "Scalling RA RB",
      "medikasi obat kumur antiseptik",
      "edukasi pola hidup sehat",
      "medikasi antibiotik sistemik",
      "penambahan jaringan tulang alveolar",
    ],
  },
  {
    id_diagnosis: "D11",
    nama: "Periodontitis Aggresive RB",
    perawatan: [
      "Scalling RA RB",
      "medikasi obat kumur antiseptik",
      "edukasi pola hidup sehat",
    ],
  },
  {
    id_diagnosis: "D12",
    nama: "Periodontitis kronis gigi 46",
    perawatan: [
      "Scalling RA RB",
      "medikasi obat kumur antiseptik",
      "edukasi pemakaian gigi tiruan",
      "pro bedah mulut ekstraksi gigi 46",
      "pro prostodonsia",
    ],
  },
  {
    id_diagnosis: "D13",
    nama: "Gingival Enlargement With Drug Induced (Antikonvulsan)",
    perawatan: [
      "Scalling RA RB",
      "medikasi obat kumur antiseptik",
      "konsultasi dengan dokter pemberi obat",
      "pengurangan gusi apabila obat dihentikan",
      "Pro konservasi gigi 27",
    ],
  },
  {
    id_diagnosis: "D14",
    nama: "Gingivitis oleh Malnutrisi Vitamin C",
    perawatan: [
      "DHE & KIE mengenai makanan mengandung vitamin C dan pentingnya menjaga status gizi",
    ],
  },
  {
    id_diagnosis: "D15",
    nama: "Gingival Enlargement With Drug Induced (calcium channel blockers)",
    perawatan: [
      "Scalling RA RB",
      "medikasi obat kumur antiseptik",
      "konsultasi dengan dokter pemberi obat",
      "pengurangan gusi apabila obat dihentikan",
      "Pro ekstraksi sisa akar gigi 15,17",
    ],
  },
  {
    id_diagnosis: "D16",
    nama: "Gingival recession gigi 31,32,41,42",
    perawatan: [
      "Scalling RA RB",
      "pro desensitisasi gigi 31,32,41,42",
      "pro bedah mulut ekstraksi SA gigi 36 dan 47",
      "DHE dan KIE",
    ],
  },
  {
    id_diagnosis: "D17",
    nama: "Gingivitis kronis anterior RB",
    perawatan: [
      "Kuretase gigi 31,32,41,42,43,44",
      "DHE dan KIE",
      "pro kontrol H+7",
    ],
  },
  {
    id_diagnosis: "D18",
    nama: "Epulis fibromatosa gigi 21,22",
    perawatan: [
      "Gingivektomi gigi 21,22",
      "pro pemeriksaan HPA",
      "DHE dan KIE",
    ],
  },
  {
    id_diagnosis: "D19",
    nama: "Gingival Enlargement With Drug Induced (Immunosuppresan)",
    perawatan: [
      "Scalling RA RB",
      "medikasi obat kumur antiseptik",
      "konsultasi dengan dokter pemberi obat",
      "pengurangan gusi apabila obat dihentikan",
    ],
  },
  {
    id_diagnosis: "D20",
    nama: "Pregnancy Gingivitis",
    perawatan: [
      "Pembersihan gigi",
      "DHE & KIE menjaga kebersihan mulut selama masa kehamilan",
      "meningkatkan asupan vitamin B & C",
    ],
  },
  {
    id_diagnosis: "D21",
    nama: "Periodontitis Kronis Anterior RA",
    perawatan: [
      "Scalling & Root Planning",
      "Perencanaan Splinting dengan menggunakan gigi tiruan sebagian kerangka logam",
      "DHE & KIE",
    ],
  },
  {
    id_diagnosis: "D22",
    nama: "Epulis fibromatosa gingiva 44",
    perawatan: ["Gingivektomi gingiva 44", "DHE dan KIE"],
  },
  {
    id_diagnosis: "D23",
    nama: "Hiperpigmentasi gingiva RA dan RB",
    perawatan: [
      "Scalling dan Root Planning RA RB",
      "DHE dan KIE pola hidup sehat",
      "rujuk Sp. Perio untuk gingival scraping",
    ],
  },
  {
    id_diagnosis: "D24",
    nama: "Periodontitis kronis gigi 31,32,33,34,41,42,44",
    perawatan: [
      "Scalling dan Root Planning RA RB",
      "DHE dan KIE",
      "pro prostodonsia pembuatan gigi tiruan",
    ],
  },
  {
    id_diagnosis: "D25",
    nama: "Trauma From Occlussion gigi 31,32",
    perawatan: [
      "Scalling dan Root Planning RA RB",
      "splinting anterior RB",
      "DHE dan KIE",
    ],
  },
  {
    id_diagnosis: "D26",
    nama: "Epulis Gravidarum gigi 43,44",
    perawatan: ["Insisi jaringan berlebih", "DHE dan KIE", "pro kontrol H+7"],
  },
  {
    id_diagnosis: "D27",
    nama: "Periodontitis kronis gigi 25",
    perawatan: [
      "Scalling RA dan RB",
      "occlusal grinding gigi 25",
      "medikasi salep triamcinolone acetonide",
      "pro prostodonsia",
      "DHE dan KIE",
    ],
  },
  {
    id_diagnosis: "D28",
    nama: "Periodontitis Kronis Anterior RB",
    perawatan: [
      "Scalling & Root Planning",
      "Perencanaan Splinting dengan menggunakan gigi tiruan sebagian lepasan RA & gigi tiruan kerangka logam RB dengan splinting (permanen)",
      "DHE & KIE",
    ],
  },
  {
    id_diagnosis: "D29",
    nama: "Gingival enlargement gigi 32,33",
    perawatan: [
      "Scalling RA dan RB",
      "DHE KIE",
      "penanganan gusi membesar setelah proses orthodonsia cekat selesai",
      "Edukasi peningkatan oral hygiene",
    ],
  },
  {
    id_diagnosis: "D30",
    nama: "Trauma From Occlusion Anterior RA & RB",
    perawatan: [
      "Test gigit",
      "selective grinding",
      "pro ortodonsia",
      "DHE dan KIE",
    ],
  },
  {
    id_diagnosis: "D31",
    nama: "Gingivitis associated with dental plaque only gigi 14,15,16,17",
    perawatan: [
      "Scalling dan root planning RA dan RB",
      "edukasi mengunyah menggunakan 2 sisi",
      "pro ekstraksi gigi 46",
    ],
  },
  {
    id_diagnosis: "D32",
    nama: "Gingivitis associated with dental plaque only",
    perawatan: ["Scalling dan root planning RA dan RB", "DHE dan KIE"],
  },
  {
    id_diagnosis: "D33",
    nama: "Gingivitis marginalis kronis anterior RA",
    perawatan: [
      "Scalling dan root planning RA dan RB",
      "pro kuretase gigi 12,11,21,22,23",
      "DHE dan KIE",
    ],
  },
  {
    id_diagnosis: "D34",
    nama: "Periodontitis kronis anterior RB",
    perawatan: [
      "Scalling dan root planning RA dan RB",
      "pro periodonsia untuk bedah flap anterior RB",
      "DHE dan KIE efek samping obat",
    ],
  },
  {
    id_diagnosis: "D35",
    nama: "Trauma Oklusi",
    perawatan: ["Test gigit", "grinding", "Pro Prostodonsia", "DHE & KIE"],
  },
];

// --- DATA ATURAN (RULES) ---
const aturanData = [
  { id_aturan: "R1", premis: ["G1"], konklusi: "D1", urutan_prioritas: 1 },
  { id_aturan: "R2", premis: ["G2"], konklusi: "D2", urutan_prioritas: 2 },
  { id_aturan: "R3", premis: ["G3"], konklusi: "D3", urutan_prioritas: 3 },
  { id_aturan: "R4", premis: ["G4"], konklusi: "D4", urutan_prioritas: 4 },
  { id_aturan: "R5", premis: ["G5"], konklusi: "D5", urutan_prioritas: 5 },
  { id_aturan: "R6", premis: ["G6"], konklusi: "D6", urutan_prioritas: 6 },
  { id_aturan: "R7", premis: ["G7"], konklusi: "D7", urutan_prioritas: 7 },
  { id_aturan: "R8", premis: ["G8"], konklusi: "D8", urutan_prioritas: 8 },
  { id_aturan: "R9", premis: ["G9"], konklusi: "D9", urutan_prioritas: 9 },
  { id_aturan: "R10", premis: ["G10"], konklusi: "D10", urutan_prioritas: 10 },
  { id_aturan: "R11", premis: ["G11"], konklusi: "D11", urutan_prioritas: 11 },
  { id_aturan: "R12", premis: ["G12"], konklusi: "D12", urutan_prioritas: 12 },
  { id_aturan: "R13", premis: ["G13"], konklusi: "D13", urutan_prioritas: 13 },
  { id_aturan: "R14", premis: ["G14"], konklusi: "D14", urutan_prioritas: 14 },
  { id_aturan: "R15", premis: ["G15"], konklusi: "D15", urutan_prioritas: 15 },
  { id_aturan: "R16", premis: ["G16"], konklusi: "D16", urutan_prioritas: 16 },
  { id_aturan: "R17", premis: ["G17"], konklusi: "D17", urutan_prioritas: 17 },
  { id_aturan: "R18", premis: ["G18"], konklusi: "D18", urutan_prioritas: 18 },
  { id_aturan: "R19", premis: ["G19"], konklusi: "D19", urutan_prioritas: 19 },
  { id_aturan: "R20", premis: ["G20"], konklusi: "D20", urutan_prioritas: 20 },
  { id_aturan: "R21", premis: ["G21"], konklusi: "D21", urutan_prioritas: 21 },
  { id_aturan: "R22", premis: ["G22"], konklusi: "D22", urutan_prioritas: 22 },
  { id_aturan: "R23", premis: ["G23"], konklusi: "D23", urutan_prioritas: 23 },
  { id_aturan: "R24", premis: ["G24"], konklusi: "D24", urutan_prioritas: 24 },
  { id_aturan: "R25", premis: ["G25"], konklusi: "D25", urutan_prioritas: 25 },
  { id_aturan: "R26", premis: ["G26"], konklusi: "D26", urutan_prioritas: 26 },
  { id_aturan: "R27", premis: ["G27"], konklusi: "D27", urutan_prioritas: 27 },
  { id_aturan: "R28", premis: ["G28"], konklusi: "D28", urutan_prioritas: 28 },
  { id_aturan: "R29", premis: ["G29"], konklusi: "D29", urutan_prioritas: 29 },
  { id_aturan: "R30", premis: ["G30"], konklusi: "D30", urutan_prioritas: 30 },
  { id_aturan: "R31", premis: ["G31"], konklusi: "D31", urutan_prioritas: 31 },
  { id_aturan: "R32", premis: ["G32"], konklusi: "D32", urutan_prioritas: 32 },
  { id_aturan: "R33", premis: ["G33"], konklusi: "D33", urutan_prioritas: 33 },
  { id_aturan: "R34", premis: ["G34"], konklusi: "D34", urutan_prioritas: 34 },
  { id_aturan: "R35", premis: ["G35"], konklusi: "D35", urutan_prioritas: 35 },
];

// --- FUNGSI PENGISIAN DATABASE ---
async function seedDatabase() {
  console.log("Memulai pengisian database Firestore...");

  const collections = [
    { name: "gejala", data: gejalaData, idField: "id_gejala" },
    { name: "diagnosis", data: diagnosisData, idField: "id_diagnosis" },
    { name: "aturan", data: aturanData, idField: "id_aturan" },
  ];

  for (const collectionItem of collections) {
    let successCount = 0;
    console.log(`\nMemproses koleksi: '${collectionItem.name}'...`);

    // Menggunakan Batch Write
    const batch = db.batch();

    collectionItem.data.forEach((data) => {
      const docRef = db
        .collection(collectionItem.name)
        .doc(data[collectionItem.idField]);
      batch.set(docRef, data);
      successCount++;
    });

    await batch
      .commit()
      .then(() => {
        console.log(
          `✅ Berhasil menambahkan ${successCount} dokumen ke koleksi '${collectionItem.name}'`
        );
      })
      .catch((error) => {
        // Jika batch commit gagal, log error dan hentikan
        console.error(
          `❌ Gagal mengeksekusi batch commit untuk koleksi '${collectionItem.name}': `,
          error.message
        );
        process.exit(1);
      });
  }

  console.log("\n🎉 Pengisian database selesai!");
}

// Jalankan fungsi
seedDatabase();
