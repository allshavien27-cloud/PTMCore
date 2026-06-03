/**
 * Main Frontend Script
 * Mengelola UI dan interaksi pengguna aplikasi PTMCore
 */

let calculator = new MetricsCalculator();
let metricsChart = null;
let statusChart = null;

const excelFile = document.getElementById('excelFile');
const uploadBtn = document.getElementById('uploadBtn');
const uploadProgress = document.getElementById('uploadProgress');
const progressBar = document.getElementById('progressBar');
const dashboardSection = document.getElementById('dashboardSection');
const chartSection = document.getElementById('chartSection');
const legendSection = document.getElementById('legendSection');
const tableBody = document.getElementById('tableBody');
const dataTable = document.getElementById('dataTable');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const alertContainer = document.getElementById('alertContainer');

uploadBtn.addEventListener('click', handleUpload);
exportBtn.addEventListener('click', handleExport);
resetBtn.addEventListener('click', handleReset);

function handleUpload() {
    const file = excelFile.files[0];

    if (!file) {
        showAlert('Pilih file Excel terlebih dahulu!', 'danger');
        return;
    }

    if (!file.name.match(/\.(xlsx|xls)$/)) {
        showAlert('Format file harus .xlsx atau .xls', 'danger');
        return;
    }

    uploadProgress.style.display = 'block';
    progressBar.style.width = '30%';

    setTimeout(() => {
        progressBar.style.width = '60%';
    }, 500);

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            progressBar.style.width = '80%';

            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length < 2) {
                showAlert('File Excel kosong atau tidak valid!', 'danger');
                uploadProgress.style.display = 'none';
                return;
            }

            const results = calculator.processData(jsonData);
            progressBar.style.width = '100%';

            setTimeout(() => {
                displayResults(results);
                uploadProgress.style.display = 'none';
                showAlert('✓ Data berhasil diproses! Total ' + results.length + ' desa.', 'success');
            }, 500);

        } catch (error) {
            console.error('Error reading file:', error);
            showAlert('Gagal membaca file Excel: ' + error.message, 'danger');
            uploadProgress.style.display = 'none';
        }
    };

    reader.readAsArrayBuffer(file);
}

function displayResults(results) {
    dashboardSection.style.display = 'block';
    chartSection.style.display = 'grid';
    legendSection.style.display = 'block';

    const statistik = calculator.hitungStatistik();

    document.getElementById('totalDesa').textContent = statistik.totalDesa;
    document.getElementById('avgSPM').textContent = statistik.avgSPM.toFixed(1) + '%';
    document.getElementById('avgDM').textContent = statistik.avgDM.toFixed(1) + '%';
    document.getElementById('avgHT').textContent = statistik.avgHT.toFixed(1) + '%';

    tableBody.innerHTML = '';

    results.forEach((desa, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${desa.namaDesa}</strong></td>
            <td>${desa.spm.toFixed(1)}</td>
            <td>${desa.dm.toFixed(1)}</td>
            <td>${desa.ht.toFixed(1)}</td>
            <td>${desa.uspro.toFixed(1)}</td>
            <td><strong>${desa.rataRataCapaian.toFixed(1)}%</strong></td>
            <td>${getStatusBadge(desa.status)}</td>
        `;
        tableBody.appendChild(row);
    });

    updateCharts(statistik, calculator.hitungDistribusiStatus());

    setTimeout(() => {
        dashboardSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function getStatusBadge(status) {
    let badgeClass = '';
    let icon = '';

    switch (status) {
        case 'Excellent':
        case 'Good':
            badgeClass = 'success';
            icon = '✓';
            break;
        case 'Fair':
            badgeClass = 'warning';
            icon = '⚠';
            break;
        case 'Poor':
            badgeClass = 'danger';
            icon = '✗';
            break;
    }

    return `<span class="badge badge-status ${badgeClass}">${icon} ${status}</span>`;
}

function updateCharts(statistik, distribusi) {
    const metricsCtx = document.getElementById('metricsChart').getContext('2d');

    if (metricsChart) {
        metricsChart.destroy();
    }

    metricsChart = new Chart(metricsCtx, {
        type: 'bar',
        data: {
            labels: ['SPM', 'DM', 'HT', 'USPRO'],
            datasets: [{
                label: 'Rata-rata Capaian (%)',
                data: [statistik.avgSPM, statistik.avgDM, statistik.avgHT, statistik.avgUSPRO],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { font: { size: 12 } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) { return value + '%'; }
                    }
                }
            }
        }
    });

    const statusCtx = document.getElementById('statusChart').getContext('2d');

    if (statusChart) {
        statusChart.destroy();
    }

    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Excellent', 'Good', 'Fair', 'Poor'],
            datasets: [{
                data: [distribusi.excellent, distribusi.good, distribusi.fair, distribusi.poor],
                backgroundColor: [
                    'rgba(25, 135, 84, 0.8)',
                    'rgba(13, 110, 253, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(220, 53, 69, 0.8)'
                ],
                borderColor: [
                    'rgba(25, 135, 84, 1)',
                    'rgba(13, 110, 253, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(220, 53, 69, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { font: { size: 12 } }
                }
            }
        }
    });
}

function handleExport() {
    try {
        const exportData = calculator.formatForExport();
        const ws = XLSX.utils.aoa_to_sheet(exportData);
        
        ws['!cols'] = [
            { wch: 5 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 18 },
            { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
            { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 12 }
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Hasil Perhitungan');
        
        const filename = 'PTMCore_Report_' + new Date().toISOString().split('T')[0] + '.xlsx';
        XLSX.writeFile(wb, filename);

        showAlert('✓ Report berhasil didownload: ' + filename, 'success');

    } catch (error) {
        console.error('Error exporting:', error);
        showAlert('✗ Gagal mengexport file: ' + error.message, 'danger');
    }
}

function handleReset() {
    excelFile.value = '';
    tableBody.innerHTML = '';
    dashboardSection.style.display = 'none';
    chartSection.style.display = 'none';
    legendSection.style.display = 'none';
    
    if (metricsChart) metricsChart.destroy();
    if (statusChart) statusChart.destroy();

    calculator = new MetricsCalculator();
    showAlert('↻ Aplikasi direset. Siap upload data baru!', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAlert(message, type = 'info') {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    alertContainer.innerHTML = alertHTML;

    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => {
                alertContainer.innerHTML = '';
            }, 150);
        }
    }, 5000);
}

window.addEventListener('load', () => {
    showAlert('👋 Selamat datang di PTMCore! Upload file Excel Anda untuk memulai perhitungan metrik kesehatan.', 'info');
});
