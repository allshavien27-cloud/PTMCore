/**
 * Calculator Module
 * Menghitung metrik kesehatan:
 * - SPM (Standar Pelayanan Minimal)
 * - DM (Diabetes Melitus)
 * - HT (Hipertensi)
 * - USPRO (Usia Produktif)
 */

class MetricsCalculator {
    constructor() {
        this.data = [];
        this.results = [];
    }

    /**
     * Parse data dari Excel dan hitung metrik
     * @param {Array} rawData - Data mentah dari Excel
     * @returns {Array} Data dengan hasil perhitungan
     */
    processData(rawData) {
        this.data = rawData;
        this.results = [];

        rawData.forEach((row, index) => {
            if (index === 0) return; // Skip header

            const desa = {
                namaDesa: row[0] || `Desa ${index}`,
                spm: parseFloat(row[1]) || 0,          // Standar Pelayanan Minimal
                dm: parseFloat(row[2]) || 0,           // Diabetes Melitus
                ht: parseFloat(row[3]) || 0,           // Hipertensi
                uspro: parseFloat(row[4]) || 0,        // Usia Produktif
                targetSPM: parseFloat(row[5]) || 80,
                targetDM: parseFloat(row[6]) || 80,
                targetHT: parseFloat(row[7]) || 80,
                targetUSPRO: parseFloat(row[8]) || 80
            };

            // Hitung capaian target untuk setiap metrik
            desa.capaianSPM = this.hitungCapaian(desa.spm, desa.targetSPM);
            desa.capaianDM = this.hitungCapaian(desa.dm, desa.targetDM);
            desa.capaianHT = this.hitungCapaian(desa.ht, desa.targetHT);
            desa.capaianUSPRO = this.hitungCapaian(desa.uspro, desa.targetUSPRO);

            // Hitung rata-rata capaian semua metrik
            desa.rataRataCapaian = (
                desa.capaianSPM + 
                desa.capaianDM + 
                desa.capaianHT + 
                desa.capaianUSPRO
            ) / 4;

            // Tentukan status berdasarkan rata-rata capaian
            desa.status = this.tentukanStatus(desa.rataRataCapaian);

            this.results.push(desa);
        });

        return this.results;
    }

    /**
     * Hitung persentase capaian
     * Formula: (Nilai Aktual / Target) × 100%
     * 
     * @param {number} nilai - Nilai aktual yang dicapai
     * @param {number} target - Target yang ingin dicapai
     * @returns {number} Persentase capaian (2 desimal)
     */
    hitungCapaian(nilai, target) {
        if (target === 0) return 0;
        const capaian = (nilai / target) * 100;
        return Math.round(capaian * 100) / 100;
    }

    /**
     * Tentukan status berdasarkan capaian
     * - Excellent: >= 100%
     * - Good: 90% - 99%
     * - Fair: 75% - 89%
     * - Poor: < 75%
     * 
     * @param {number} capaian - Persentase capaian
     * @returns {string} Status: Excellent, Good, Fair, Poor
     */
    tentukanStatus(capaian) {
        if (capaian >= 100) return 'Excellent';
        if (capaian >= 90) return 'Good';
        if (capaian >= 75) return 'Fair';
        return 'Poor';
    }

    /**
     * Hitung statistik keseluruhan untuk semua desa
     * @returns {Object} Statistik global
     */
    hitungStatistik() {
        if (this.results.length === 0) {
            return {
                totalDesa: 0,
                avgSPM: 0,
                avgDM: 0,
                avgHT: 0,
                avgUSPRO: 0,
                avgCapaian: 0
            };
        }

        const jumlahDesa = this.results.length;
        
        const totalSPM = this.results.reduce((sum, d) => sum + d.spm, 0);
        const totalDM = this.results.reduce((sum, d) => sum + d.dm, 0);
        const totalHT = this.results.reduce((sum, d) => sum + d.ht, 0);
        const totalUSPRO = this.results.reduce((sum, d) => sum + d.uspro, 0);
        const totalCapaian = this.results.reduce((sum, d) => sum + d.rataRataCapaian, 0);

        return {
            totalDesa: jumlahDesa,
            avgSPM: Math.round((totalSPM / jumlahDesa) * 100) / 100,
            avgDM: Math.round((totalDM / jumlahDesa) * 100) / 100,
            avgHT: Math.round((totalHT / jumlahDesa) * 100) / 100,
            avgUSPRO: Math.round((totalUSPRO / jumlahDesa) * 100) / 100,
            avgCapaian: Math.round((totalCapaian / jumlahDesa) * 100) / 100
        };
    }

    /**
     * Hitung distribusi status desa
     * @returns {Object} Jumlah desa per status
     */
    hitungDistribusiStatus() {
        const distribusi = {
            excellent: 0,
            good: 0,
            fair: 0,
            poor: 0
        };

        this.results.forEach(desa => {
            const status = desa.status.toLowerCase();
            if (status === 'excellent') distribusi.excellent++;
            else if (status === 'good') distribusi.good++;
            else if (status === 'fair') distribusi.fair++;
            else if (status === 'poor') distribusi.poor++;
        });

        return distribusi;
    }

    /**
     * Format data untuk export Excel
     * @returns {Array} Data terformat untuk export dengan header dan statistik
     */
    formatForExport() {
        const header = [
            'No',
            'Nama Desa',
            'SPM (Std. Pelayanan Minimal)',
            'DM (Diabetes Melitus)',
            'HT (Hipertensi)',
            'USPRO (Usia Produktif)',
            'Target SPM',
            'Target DM',
            'Target HT',
            'Target USPRO',
            'Capaian SPM (%)',
            'Capaian DM (%)',
            'Capaian HT (%)',
            'Capaian USPRO (%)',
            'Rata-rata Capaian (%)',
            'Status'
        ];

        const rows = this.results.map((desa, index) => [
            index + 1,
            desa.namaDesa,
            desa.spm,
            desa.dm,
            desa.ht,
            desa.uspro,
            desa.targetSPM,
            desa.targetDM,
            desa.targetHT,
            desa.targetUSPRO,
            desa.capaianSPM,
            desa.capaianDM,
            desa.capaianHT,
            desa.capaianUSPRO,
            desa.rataRataCapaian,
            desa.status
        ]);

        const statistik = this.hitungStatistik();
        rows.push([]);
        rows.push(['STATISTIK KESELURUHAN']);
        rows.push(['Total Desa', statistik.totalDesa]);
        rows.push(['Rata-rata SPM', statistik.avgSPM]);
        rows.push(['Rata-rata DM', statistik.avgDM]);
        rows.push(['Rata-rata HT', statistik.avgHT]);
        rows.push(['Rata-rata USPRO', statistik.avgUSPRO]);
        rows.push(['Rata-rata Capaian', statistik.avgCapaian]);

        return [header, ...rows];
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MetricsCalculator;
}
