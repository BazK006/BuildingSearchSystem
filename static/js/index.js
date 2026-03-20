// -----------Header------------ //
const header = document.getElementById("mainHeader");
const triggerPoint = 320;

header.classList.add("header-hide");

let lastScroll = 0;

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= triggerPoint) {
        // เลื่อนชิดบนสุด → ซ่อน header
        header.classList.add("header-hide");
        header.classList.remove("header-show");
    }
    else if (currentScroll > lastScroll) {
        // เลื่อนลง → แสดง header
        header.classList.remove("header-hide");
        header.classList.add("header-show");
    }

    lastScroll = currentScroll;
});

// Effect Animation Pages
const pageSection = document.querySelector(".page");
const navBoxes = document.querySelectorAll(".nav-box");
const popularBoxes = document.querySelectorAll('.popular-box');

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                pageSection.classList.add("show");

                navBoxes.forEach((box, index) => {
                    setTimeout(() => {
                        box.classList.add("show");
                    }, index * 150); // ไล่ทีละใบ
                });

                observer.unobserve(pageSection);
            }
        });
    },
    { threshold: 0.3 }
);

observer.observe(pageSection);

const popularObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            popularObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

popularBoxes.forEach(box => popularObserver.observe(box));


// ปุ่มสามขีด hamburger //
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
}

/** ปฏิทินประจำเดือน **/
const thaiHolidays = {
    "1-1": "วันขึ้นปีใหม่",
    "12-1": "วันเด็กแห่งชาติ",
    "16-1": "วันครูแห่งชาติ",
    "14-2": "วันวาเลนไทน์",
    "6-4": "วันจักรี",
    "13-4": "วันสงกรานต์",
    "14-4": "วันสงกรานต์",
    "15-4": "วันสงกรานต์",
    "1-5": "วันแรงงานแห่งชาติ",
    "5-5": "วันฉัตรมงคล",
    "9-6": "วันเฉลิมพระชนมพรรษาสมเด็จพระราชินี",
    "28-7": "วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว",
    "12-8": "วันแม่แห่งชาติ",
    "13-10": "วันคล้ายวันสวรรคต ร.9",
    "23-10": "วันปิยมหาราช",
    "31-10": "วันฮาโลวีน",
    "5-12": "วันพ่อแห่งชาติ",
    "10-12": "วันรัฐธรรมนูญ",
    "25-12": "วันคริสต์มาส",
    "31-12": "วันส่งท้ายปีเก่า"
};

let current = new Date();

function loadCalendar() {
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    document.getElementById("monthYear").textContent =
        current.toLocaleString("th-TH", { month: "long", year: "numeric" });

    const body = document.getElementById("calendarBody");
    body.innerHTML = "";

    let row = document.createElement("tr");
    let cellCount = 0;

    for (let i = 0; i < firstDay; i++) {
        row.appendChild(document.createElement("td"));
        cellCount++;
    }

    for (let day = 1; day <= totalDays; day++) {
        const td = document.createElement("td");
        td.textContent = day;

        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) td.classList.add("today");

        const key = `${day}-${month + 1}`;
        if (thaiHolidays[key]) td.classList.add("holiday");

        td.onclick = () => {
            const [d, m] = key.split("-");
            const thaiMonths = [
                "", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
                "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
            ];

            const dateText = `${parseInt(d)} ${thaiMonths[parseInt(m)]}`;

            document.getElementById("eventText").textContent =
                thaiHolidays[key]
                    ? `วันที่ ${dateText} (${thaiHolidays[key]})`
                    : `วันที่ ${dateText}`;
        };

        row.appendChild(td);
        cellCount++;

        if (cellCount % 7 === 0) {
            body.appendChild(row);
            row = document.createElement("tr");
        }
    }

    if (cellCount % 7 !== 0) body.appendChild(row);
}

function prevMonth() { current.setMonth(current.getMonth() - 1); loadCalendar(); }
function nextMonth() { current.setMonth(current.getMonth() + 1); loadCalendar(); }

loadCalendar();

// JS รูปสไลด์ดดด //
const slider = document.getElementById('slider');
const images = slider.querySelectorAll('img');
const dotsContainer = document.getElementById('dots');
let dots = [];
let currentIndex = 0;
let autoSlideInterval;

// สร้าง dot
images.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
});

// อัปเดต dot
function updateDots(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

// ไปยัง slide ที่เลือก
function goToSlide(index) {
    currentIndex = index;
    slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: 'smooth'
    });
    updateDots(index);
}

// Auto Slide 5 วิ //
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        goToSlide(currentIndex);
    }, 5000); // 5 วิ
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// อัปเดตเมื่อ scroll (เช่น ใช้ mouse wheel หรือลาก)
let scrollTimeout;
slider.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const index = Math.round(slider.scrollLeft / slider.clientWidth);
        currentIndex = index;
        updateDots(index);
        resetAutoSlide(); // reset เวลาใหม่หลังจากเลื่อนเอง
    }, 150); // หน่วงเล็กน้อยเพื่อจับการ scroll
});

// เริ่ม auto slide
startAutoSlide();

// ลากเลื่อนรูปได้ //
let isDragging = false;
let startX;

slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    clearInterval(autoSlideInterval);
    slider.style.cursor = 'grabbing';
});

slider.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.pageX - startX;

    if (diff < -30) { // ลากซ้าย > 30px → next
        currentIndex = (currentIndex + 1) % images.length;
    } else if (diff > 30) { // ลากขวา > 30px → prev
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    goToSlide(currentIndex); // snap ไป slide
    slider.style.cursor = 'grab';
    startAutoSlide();
});

slider.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        goToSlide(currentIndex);
        slider.style.cursor = 'grab';
        startAutoSlide();
    }
});

// ป้องกันลากรูป default
slider.addEventListener('dragstart', e => e.preventDefault());

// -------ปรับความสูงรูปตามขนาดหน้าจอ-------------
function adjustHeight() {
    let imgs = document.querySelectorAll(".slide-img");
    let w = window.innerWidth;
    let h, wd;

    // ถ้ากว้าง > สูง = โหมดแนวนอน (Desktop / Laptop)
    if (w > window.innerHeight) {

        if (w >= 2560) {
            h = "62vh";
            wd = "90vw";
        }
        else if (w >= 1920) {
            h = "58vh";
            wd = "85vw";
        }
        else if (w >= 1440) {
            h = "65vh";
            wd = "82vw";
        }
        else if (w >= 1200) {
            h = "52vh";
            wd = "80vw";
        }
        else if (w >= 992) {
            h = "65vh";
            wd = "78vw";
        }
        else if (w >= 768) {
            h = "65vh";
            wd = "95vw";
        }
        else {
            h = "30vh";
            wd = "95vw";
        }

    }
    // แนวตั้ง (Mobile / Tablet)
    else {

        if (w >= 1200) {
            h = "65vh";
            wd = "85vw";
        }
        else if (w >= 768) {
            h = "50vh";
            wd = "90vw";
        }
        else {
            h = "35vh";
            wd = "95vw";
        }
    }

    imgs.forEach(img => {
        img.style.height = h;
        img.style.width = wd;
    });
}

adjustHeight();
window.onresize = adjustHeight;

//------------- mini widget -------------//
function updateClock() {
    const now = new Date();

    // เวลาไทย
    const thailandTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );

    let hours = thailandTime.getHours();
    let minutes = thailandTime.getMinutes();
    let seconds = thailandTime.getSeconds();

    // เติม 0 หน้าเลข
    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");

    // แสดงเวลา (24 ชม.)
    document.getElementById("timeText").textContent = `${hh}:${mm}:${ss}`;

    // ไม่ใช้ AM / PM
    const ampmEl = document.getElementById("ampmText");
    if (ampmEl) ampmEl.textContent = "";

    // ชื่อวันไทย
    const daysTH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    // เดือนไทย
    const monthsTH = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const dayName = daysTH[thailandTime.getDay()];
    const date = thailandTime.getDate();
    const monthName = monthsTH[thailandTime.getMonth()];
    const year = thailandTime.getFullYear() + 543;

    document.getElementById("dateLine").textContent =
        `วัน${dayName}ที่ ${date} ${monthName} ${year}`;
}

setInterval(updateClock, 1000);
updateClock();

// Mini Search 
function goSearch() {
    const q = document.getElementById("quickSearch").value.trim();
    if (!q) return;

    // ส่งคำค้นไปหน้า BuildingFindSystem
    window.location.href =
        `pages/BuildingFindSystem.html?q=${encodeURIComponent(q)}`;
}

function handleEnter(e) {
    if (e.key === "Enter") {
        goSearch();
    }
}

function goTo(page) {
    window.location.href = page;
}

// modal ในหน้าหลักอาคารยอดฮิต
function openImage(img) {
    const overlay = document.getElementById("imageOverlay");
    const overlayImg = document.getElementById("overlayImg");

    overlayImg.src = img.src;
    overlay.classList.add("show");
}

function closeImage() {
    document.getElementById("imageOverlay").classList.remove("show");
}