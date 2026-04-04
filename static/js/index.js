// -----------Header------------ //
const header = document.getElementById("mainHeader");
const triggerPoint = 20;

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
document.addEventListener("DOMContentLoaded", function () {
    // --- ส่วนที่ 1: หัวข้อหลักหน้าเว็บ ---
    const pageSection = document.querySelector(".page");
    const navBoxes = document.querySelectorAll(".nav-box");

    const mainObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                navBoxes.forEach((box, index) => {
                    setTimeout(() => { box.classList.add("show"); }, index * 150);
                });
                mainObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (pageSection) mainObserver.observe(pageSection);


    // --- อาคารยอดฮิต ---
    const popularBoxContainer = document.querySelector("#popular-box");

    if (popularBoxContainer) {
        const popularSection = popularBoxContainer.closest('section') || popularBoxContainer.parentElement;

        const popularObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 1. สั่งหัวข้อ (.header-drop) ให้ "หล่น"
                    const header = entry.target.querySelector('.header-drop');
                    if (header) header.classList.add('show');

                    // 2. สั่งบล็อก (.popular-box) ให้ "ไหลตาม"
                    const boxes = entry.target.querySelectorAll('.popular-box');
                    boxes.forEach((box, index) => {
                        setTimeout(() => {
                            box.classList.add('show');
                        }, 400 + (index * 150));
                    });

                    popularObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        popularObserver.observe(popularSection);
    }
});


// ปุ่มสามขีด hamburger //
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
}

/** ข้อมูลวันสำคัญ **/
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
    "3-6": "วันเฉลิมฯ พระราชินี",
    "28-7": "วันเฉลิมฯ ร.10",
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

    document.getElementById("monthYear").textContent =
        current.toLocaleString("th-TH", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const body = document.getElementById("calendarBody");
    body.innerHTML = "";

    let row = document.createElement("tr");

    // 1. เติมช่องว่างวันแรกของเดือน
    for (let i = 0; i < firstDay; i++) {
        row.appendChild(document.createElement("td"));
    }

    // 2. สร้างวันที่
    for (let day = 1; day <= totalDays; day++) {
        const td = document.createElement("td");
        const key = `${day}-${month + 1}`;
        const isHoliday = thaiHolidays[key];
        const today = new Date();

        // ใส่ Class ตามสถานะ
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            td.classList.add("today");
        }
        if (isHoliday) {
            td.classList.add("holiday");
        }

        // โครงสร้างเนื้อหาข้างใน
        td.innerHTML = `<span class="day-num">${day}</span>${isHoliday ? '<div class="event-badge"></div>' : ''}`;

        // Event ตอนคลิก
        td.onclick = function () {
            if (day) {

                document.querySelectorAll("#calendarBody td").forEach(el => el.classList.remove("selected-day"));
                this.classList.add("selected-day");

                const thaiMonths = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
                const eventInfo = isHoliday ? ` (${isHoliday})` : "";
                document.getElementById("eventText").textContent = `วันที่ ${day} ${thaiMonths[month + 1]}${eventInfo}`;
            }
        };

        row.appendChild(td);


        if (new Date(year, month, day).getDay() === 6) {
            body.appendChild(row);
            row = document.createElement("tr");
        }
    }

    if (row.children.length > 0) {
        while (row.children.length < 7) {
            row.appendChild(document.createElement("td"));
        }
        body.appendChild(row);
    }
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
        resetAutoSlide();
    }, 150);
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

    const thailandTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );

    let hours = thailandTime.getHours();
    let minutes = thailandTime.getMinutes();
    let seconds = thailandTime.getSeconds();

    const hh = hours.toString().padStart(2, "0");
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");

    document.getElementById("timeText").textContent = `${hh}:${mm}:${ss}`;

    const ampmEl = document.getElementById("ampmText");
    if (ampmEl) ampmEl.textContent = "";

    const daysTH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
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

// อัปเดตสภาพอากาศปัจจุบัน
const LAT = 15.114993;
const LON = 105.266293;

async function fetchWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&hourly=temperature_2m,relativehumidity_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.current_weather) {
            updateWeatherUI(data);
        } else {
            throw new Error("Data format error");
        }
    } catch (error) {
        console.error("Weather Fetch Error:", error);
        document.getElementById("descText").innerText = "โหลดข้อมูลไม่สำเร็จ";
    }
}

function updateWeatherUI(data) {
    const current = data.current_weather;
    const temp = Math.round(current.temperature);
    const weatherCode = current.weathercode; // เลข Code สภาพอากาศ
    const windSpeedKmH = current.windspeed.toFixed(1);
    const hi = Math.round(data.daily.temperature_2m_max[0]);
    const low = Math.round(data.daily.temperature_2m_min[0]);

    document.getElementById("hiLowText").innerText = `สูงสุด: ${hi}° ต่ำสุด: ${low}°`;
    document.getElementById("tempText").innerText = `${temp}°C`;
    const weatherInfo = getWeatherInfo(weatherCode);

    document.getElementById("descText").innerText = weatherInfo.text;
    const humidity = data.hourly.relativehumidity_2m[0];

    document.getElementById("humidityText").innerHTML = `<i class="bi bi-droplets-fill text-info"></i> ความชื้น: ${humidity}%`;
    document.getElementById("windText").innerHTML = `<i class="bi bi-wind text-secondary"></i> ลม: ${windSpeedKmH} กม./ชม.`;

    const card = document.getElementById("weatherCard");
    const iconZone = document.getElementById("weatherIcon");

    iconZone.innerHTML = `<i class="bi ${weatherInfo.icon}" style="font-size: 2rem; margin-right: 10px;"></i>`;
    card.style.transition = "background 1s ease";

    if (weatherInfo.state === "Rain") {
        card.style.background = "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)";
        card.style.color = "#ffffff";
    } else if (weatherInfo.state === "Clear") {
        card.style.background = "linear-gradient(135deg, #FFEFBA 0%, #FFFFFF 100%)";
        card.style.color = "#212529";
    } else if (weatherInfo.state === "Clouds") {
        card.style.background = "linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)";
        card.style.color = "#212529";
    } else {
        card.style.background = "#ffffff";
        card.style.color = "#212529";
    }
}

// ฟังก์ชันช่วยแปลง WMO Weather Code เป็นข้อมูลที่เราเข้าใจ
function getWeatherInfo(code) {
    if (code === 0) return { text: "ท้องฟ้าแจ่มใส", icon: "bi-brightness-high-fill", state: "Clear" };
    if (code <= 3) return { text: "มีเมฆบางส่วน", icon: "bi-cloud-sun-fill", state: "Clouds" };
    if (code >= 51 && code <= 67) return { text: "ฝนตกเล็กน้อย", icon: "bi-cloud-drizzle-fill", state: "Rain" };
    if (code >= 71 && code <= 82) return { text: "หิมะตก/ฝนน้ำแข็ง", icon: "bi-snow", state: "Rain" };
    if (code >= 95) return { text: "พายุฝนฟ้าคะนอง", icon: "bi-cloud-lightning-rain-fill", state: "Rain" };
    return { text: "เมฆครึ้ม", icon: "bi-cloud-fill", state: "Clouds" };
}

// เรียกใช้งาน
fetchWeather();

// ค้นหาอาารต่างๆ
function goSearch() {
    const q = document.getElementById("quickSearch").value.trim();
    if (!q) return;
    window.location.href = `${SEARCH_PAGE_URL}?q=${encodeURIComponent(q)}`;
}

// กด enter ได้
function handleEnter(e) {
    if (e.key === "Enter") {
        goSearch();
    }
}

// ไปตามลิ้งคนั้นๆ
function goTo(pageName) {
    if (APP_URLS[pageName]) {
        window.location.href = APP_URLS[pageName];
    } else {
        console.error("หาลิงก์ไม่เจอครับ สำหรับหน้า: " + pageName);
    }
}

// เปิด Model ขึ้นได้
function openImage(img) {
    const overlay = document.getElementById("imageOverlay");
    const overlayImg = document.getElementById("overlayImg");

    overlayImg.src = img.src;
    overlay.classList.add("show");
}

function closeImage() {
    document.getElementById("imageOverlay").classList.remove("show");
}

