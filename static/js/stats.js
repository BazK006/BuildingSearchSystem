/**
 * Pibun Building Statistics - Dashboard Logic 2026
 */

let allBuildingsData = []; // เก็บข้อมูลต้นฉบับไว้กรอง (Global Scope)

// 1. ฟังก์ชันย่อตัวเลข (เช่น 10,500 -> 10.5K)
function formatCompactNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 10000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
}

// ฟังก์ชันหลักสำหรับวาด Dashboard
function initDashboard(buildingsData) {
    if (!buildingsData || !Array.isArray(buildingsData)) {
        console.error("Data error: ข้อมูลอาคารไม่ถูกต้อง");
        return;
    }
    const existingChart = Chart.getChart("topBuildingsChart");
    if (existingChart) {
        existingChart.destroy();
    }

    // --- จัดเตรียมข้อมูล ---
    const sorted = [...buildingsData].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    const total = sorted.reduce((s, b) => s + (b.viewCount || 0), 0);
    const maxViews = sorted.length > 0 ? sorted[0].viewCount : 0;

    // --- แสดงตัวเลขสรุป ---
    const totalDisplay = document.getElementById('totalViewsDisplay');
    const countDisplay = document.getElementById('buildingCountDisplay');

    if (totalDisplay) {
        totalDisplay.innerText = formatCompactNumber(total);
        totalDisplay.title = `ยอดรวมทั้งหมด: ${total.toLocaleString()}`;
    }
    if (countDisplay) countDisplay.innerText = `${sorted.length} อาคารในระบบ`;

    const ctx = document.getElementById('topBuildingsChart');
    if (ctx) {
        const top5 = sorted.slice(0, 5);
        const bgColors = top5.map(b => {
            const val = b.viewCount || 0;
            if (val === 0) return 'rgba(33, 37, 41, 0.8)';
            if (val >= maxViews * 0.8) return 'rgba(40, 167, 69, 0.8)';
            if (val >= maxViews * 0.4) return 'rgba(255, 193, 7, 0.8)';
            return 'rgba(220, 53, 69, 0.8)';
        });

        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: top5.map(b => b.name),
                datasets: [{
                    label: 'ยอดเข้าชม',
                    data: top5.map(b => b.viewCount || 0),
                    backgroundColor: bgColors,
                    borderRadius: 8,
                    barThickness: 35
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1000 },
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f8f9fa' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    const rankingBody = document.getElementById('rankingBody');
    if (rankingBody) {
        let allRows = '';
        sorted.forEach((b, index) => {
            const views = b.viewCount || 0;
            const percent = total > 0 ? ((views / total) * 100).toFixed(1) : 0;

            let statusClass = '';
            let bgClass = '';
            if (views === 0) { statusClass = 'text-dark opacity-50'; bgClass = 'bg-dark'; }
            else if (views >= maxViews * 0.8) { statusClass = 'text-success'; bgClass = 'bg-success'; }
            else if (views >= maxViews * 0.4) { statusClass = 'text-warning'; bgClass = 'bg-warning text-dark'; }
            else { statusClass = 'text-danger'; bgClass = 'bg-danger'; }

            allRows += `
                <tr>
                    <td class="px-4"><span class="badge rounded-pill bg-light text-dark border">${index + 1}</span></td>
                    <td class="fw-semibold text-truncate" style="max-width: 250px;" title="${b.name}">${b.name}</td>
                    <td class="text-center fw-bold ${statusClass}">${views.toLocaleString()}</td>
                    <td>
                        <div class="d-flex align-items-center gap-3">
                            <div class="progress flex-grow-1" style="height: 6px; background-color: #eee;">
                                <div class="progress-bar ${bgClass} rounded-pill shadow-sm" 
                                     style="width: ${percent}%; transition: width 1.5s ease-in-out;"></div>
                            </div>
                            <span class="small text-muted" style="min-width: 45px; text-align: right;">${percent}%</span>
                        </div>
                    </td>
                </tr>`;
        });
        rankingBody.innerHTML = allRows || '<tr><td colspan="4" class="text-center py-4">ไม่พบข้อมูล</td></tr>';
    }
}

// ระบบ Filter การเลือกช่วงเวลา
function handleFilterChange(e) {
    const mode = e.target.value;
    const customInput = document.getElementById('customRangeInput');

    if (mode === 'custom') {
        if (customInput) {
            customInput.classList.remove('d-none');
            customInput.classList.add('d-flex');
        }
        return;
    } else {
        if (customInput) {
            customInput.classList.add('d-none');
            customInput.classList.remove('d-flex');
            document.getElementById('startDate').value = '';
            document.getElementById('endDate').value = '';
        }
    }

    let filtered = allBuildingsData.map(b => {
        let count = b.viewCount;
        if (mode === 'today') count = b.viewCountToday || 0;
        else if (mode === 'month') count = b.viewCountMonth || 0;
        else if (mode === 'year') count = b.viewCountYear || 0;
        return { ...b, viewCount: count };
    });

    initDashboard(filtered);
}

async function applyCustomFilter() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    if (!start || !end) {
        alert("กรุณาเลือกวันที่ให้ครบถ้วนก่อนครับเพื่อน! 📅");
        return;
    }

    const rankingBody = document.getElementById('rankingBody');
    if (rankingBody) rankingBody.innerHTML = `<tr><td colspan="4" class="text-center py-5 text-muted"><div class="spinner-border spinner-border-sm me-2"></div>กำลังดึงข้อมูล...</td></tr>`;

    try {
        const response = await fetch(`/api/custom_stats?start=${start}&end=${end}`);
        const customData = await response.json();

        if (response.ok) {
            initDashboard(customData);
        } else {
            alert("เกิดข้อผิดพลาด: " + customData.error);
        }
    } catch (error) {
        console.error("Error fetching custom stats:", error);
        initDashboard(allBuildingsData);
    }
}

// Header Logic 
const header = document.getElementById("mainHeader");
let lastScroll = 0;
window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll <= 20) {
        header.classList.add("header-hide");
        header.classList.remove("header-show");
    } else if (currentScroll > lastScroll) {
        header.classList.remove("header-hide");
        header.classList.add("header-show");
    }
    lastScroll = currentScroll;
});

// ปุ่ม Hamburger & Sidebar
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
}

// ส่งข้อมูลออก Excel
function exportToExcel() {
    Swal.fire({
        title: 'กำลังเตรียมข้อมูล',
        html: 'ระบบกำลังประมวลผลไฟล์<b>.</b>',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const b = Swal.getHtmlContainer().querySelector('b');
            let dotCount = 1;

            timerInterval = setInterval(() => {
                dotCount = (dotCount % 3) + 1;
                b.textContent = '.'.repeat(dotCount);
            }, 400);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        try {
            const now = new Date();
            const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
            const fileName = `Phibun_Stats_${timestamp}.xlsx`;
            const table = document.getElementById("statsTable");
            const wb = XLSX.utils.table_to_book(table, { sheet: "Building Stats" });
            XLSX.writeFile(wb, fileName);

            Swal.fire({
                icon: 'success',
                title: 'ส่งออกสำเร็จ!',
                text: 'ไฟล์ Excel ของคุณพร้อมใช้งานแล้ว',
                confirmButtonColor: '#0d6efd',
                timer: 2000
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถส่งออกไฟล์ได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonColor: '#dc3545'
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const dataElement = document.getElementById('buildings-data');
    if (!dataElement) return;

    try {
        allBuildingsData = JSON.parse(dataElement.textContent);
        const timeFilter = document.getElementById('timeFilter');

        // ตัวกำหนดค่าเริ่มต้นสถิติ เช่น วันนี้
        if (timeFilter) {
            timeFilter.value = 'all'; // today = วันนี้
            handleFilterChange({ target: { value: 'all' } });
            timeFilter.addEventListener('change', handleFilterChange);
        } else {
            initDashboard(allBuildingsData);
        }

        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (el) { return new bootstrap.Tooltip(el) });

    } catch (e) {
        console.error("JSON Parsing Error:", e);
    }
});