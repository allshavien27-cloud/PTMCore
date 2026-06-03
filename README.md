# PTMCore - Aplikasi Perhitungan SPM DM HT USPRO

Aplikasi web untuk menghitung metrik kesehatan masyarakat di tingkat desa dengan mudah melalui upload file Excel.

## 🎯 Fitur Utama

- ✅ **Upload File Excel** - Upload data desa dan metrik kesehatan
- ✅ **Perhitungan Otomatis** - Hitung SPM, DM, HT, USPRO secara real-time
- ✅ **Dashboard Desa** - Lihat capaian per desa dalam bentuk tabel
- ✅ **Visualisasi Data** - Tampilan grafik dan chart perbandingan
- ✅ **Export Report** - Download hasil perhitungan dalam format Excel

## 📋 Metrik yang Dihitung

| Kode | Kepanjangan | Deskripsi |
|------|-------------|-----------|
| **SPM** | Standar Pelayanan Minimal | Indikator standar pelayanan kesehatan minimal di desa |
| **DM** | Diabetes Melitus | Deteksi dan pengendalian penyakit diabetes melitus |
| **HT** | Hipertensi | Deteksi dan pengendalian penyakit hipertensi/tekanan darah tinggi |
| **USPRO** | Usia Produktif | Cakupan pelayanan kesehatan pada kelompok usia produktif (15-64 tahun) |

## 📦 Struktur Folder

```
PTMCore/
├── index.html          # Halaman utama aplikasi
├── style.css           # Styling aplikasi
├── script.js           # Logic frontend
├── server.js           # Backend Node.js
├── package.json        # Dependencies project
├── data/
│   ├── sample.xlsx     # File contoh Excel
│   └── uploads/        # Folder untuk file upload
├── js/
│   ├── calculator.js   # Logic perhitungan metrik
│   └── script.js       # Script utama frontend
├── css/
│   └── style.css       # Styling aplikasi
└── README.md           # Dokumentasi ini
```

## 🚀 Cara Memulai

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Server
```bash
npm start
```

### 3. Buka di Browser
```
http://localhost:3000
```

### 4. Upload File Excel
- Klik tombol "Upload Excel"
- Pilih file dengan format yang sesuai
- Aplikasi akan otomatis menghitung metrik per desa

## 📊 Format File Excel

File Excel harus memiliki kolom berikut dalam urutan yang benar:

| No | Kolom | Tipe | Keterangan | Contoh |
|---|-------|------|-----------|---------|
| 1 | Nama Desa | Text | Nama desa | Desa Maju |
| 2 | SPM | Number | Nilai SPM (0-100) | 85 |
| 3 | DM | Number | Nilai Diabetes Melitus (0-100) | 75 |
| 4 | HT | Number | Nilai Hipertensi (0-100) | 80 |
| 5 | USPRO | Number | Nilai Usia Produktif (0-100) | 70 |
| 6 | Target SPM | Number | Target SPM yang ingin dicapai | 80 |
| 7 | Target DM | Number | Target DM yang ingin dicapai | 75 |
| 8 | Target HT | Number | Target HT yang ingin dicapai | 80 |
| 9 | Target USPRO | Number | Target USPRO yang ingin dicapai | 70 |

**Contoh baris data:**
```
Desa Maju, 85, 75, 80, 70, 80, 75, 80, 70
Desa Sejahtera, 80, 72, 78, 68, 80, 75, 80, 70
Desa Sentosa, 90, 88, 85, 75, 80, 75, 80, 70
```

## 🔢 Cara Perhitungan

### Capaian per Metrik
```
Capaian = (Nilai Aktual / Target) × 100%
```

**Contoh:**
- SPM: (85 / 80) × 100% = 106.25%
- DM: (75 / 75) × 100% = 100%

### Rata-rata Capaian per Desa
```
Rata-rata Capaian = (Capaian SPM + Capaian DM + Capaian HT + Capaian USPRO) / 4
```

### Status Berdasarkan Capaian
| Capaian | Status | Keterangan |
|---------|--------|-----------|
| ≥ 100% | ✓ Excellent | Target tercapai atau terlampaui |
| 90% - 99% | ✓ Good | Hampir mencapai target |
| 75% - 89% | ⚠ Fair | Cukup baik tapi masih di bawah target |
| < 75% | ✗ Poor | Perlu perhatian khusus |

## 🔧 Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js, Express.js
- **Excel Parser**: SheetJS (xlsx library)
- **Visualisasi**: Chart.js
- **Styling**: Bootstrap 5
- **Icons**: Font Awesome 6

## 📈 Output Dashboard

Dashboard menampilkan:
1. **Statistik Keseluruhan**
   - Total jumlah desa
   - Rata-rata SPM, DM, HT, USPRO

2. **Tabel Perbandingan per Desa**
   - Data lengkap setiap desa
   - Capaian target
   - Status pencapaian

3. **Visualisasi Grafik**
   - Grafik batang rata-rata metrik
   - Grafik distribusi status capaian

4. **Export Data**
   - Download hasil perhitungan dalam Excel
   - Include statistik keseluruhan

## 📝 Lisensi

MIT License - Bebas digunakan untuk keperluan apapun

## 👨‍💻 Author

Created by: allshavien27-cloud

---

**Silakan mulai dengan mengupload file Excel Anda!** 📤
