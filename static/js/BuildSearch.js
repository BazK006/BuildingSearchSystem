const buildings = [
    { name: "อาคาร 1", desc: "กลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี", img: "../static/images/b1.jpg", mapsLink: "https://maps.app.goo.gl/nZFH8kwD6MDAuQiz8" },
    { name: "อาคาร 2", desc: "กลุ่มสาระการเรียนรู้ภาษาไทย", img: "../static/images/b2.jpg", mapsLink: "https://maps.app.goo.gl/fxMauFn8NfmZigus6" },
    { name: "อาคาร 3", desc: "อาคารเรียน 3", img: "../static/images/b3.jpg", mapsLink: "https://maps.app.goo.gl/qRpjWGfwyvYGYNSJ7" },
    { name: "อาคาร 4", desc: "กลุ่มสาระการเรียนรู้คณิตศาสตร์", img: "../static/images/b4.jpg", mapsLink: "https://maps.app.goo.gl/xrUJxdd7ujcuT6Vr7" },
    { name: "อาคาร 5", desc: "กลุ่มสาระการเรียนรู้ภาษาต่างประเทศ", img: "../static/images/b5.jpg", mapsLink: "https://maps.app.goo.gl/vja6D4NVZzo4AQyS9" },
    { name: "อาคาร 6", desc: "กลุ่มสาระการเรียนรู้สังคมศึกษาและวัฒนธรรม", img: "../static/images/b6.jpg", mapsLink: "https://maps.app.goo.gl/vi1P3aN9jSsYHzb97" },
    { name: "อาคาร 7", desc: "อาคารเรียนโปรแกรม IEP Programme", img: "../static/images/build7.jpg", mapsLink: "https://maps.app.goo.gl/VYp2mtXVE7xHLMvw87" },
    { name: "อาคาร 8", desc: "อาคารเรียน 8 ICT DEPARTMENT", img: "../static/images/b8.jpg", mapsLink: "https://maps.app.goo.gl/uchkkTjDrey34NQX7" },
    { name: "อาคาร 9", desc: "กลุ่มสาระการเรียนรู้ศิลปะและดนตรี", img: "../static/images/b9.jpg", mapsLink: "https://maps.app.goo.gl/FW5H3qhPBiEziDqZ6" },
    { name: "อาคาร 10", desc: "อาคารเรียนโปรแกรม AP Programme", img: "../static/images/b10.jpg", mapsLink: "https://maps.app.goo.gl/yAxLa6RyWtNFLgpRA" },
    { name: "สนามกีฬา", desc: "สนามกีฬาฟุตบอลโรงเรียนพิบูลมังสาหาร", img: "../static/images/court.jpg", mapsLink: "https://maps.app.goo.gl/ND8TqQQWvzhLcnV56" },
    { name: "โดมอเนกประสงค์", desc: "โดมอเนกประสงค์หรือจัดกิจกรรม", img: "../static/images/domphibun.jpg", mapsLink: "https://maps.app.goo.gl/rvbWmnPwQ9DjEcZ39" },
    { name: "หอประชุมศรีวนาลัย", desc: "หอประชุมติดแอร์หรือจัดกิจกรรม", img: "../static/images/swn.jpg", mapsLink: "https://maps.app.goo.gl/aFYGLXQBPDXPPTTQ7" },
    { name: "โรงอาหารครบรอบ 60 ปี", desc: "โรงอาหารครบรอบ 60 ปี โรงเรียนพิบูลมังสาหาร", img: "../static/images/canteen60year.jpg", mapsLink: "https://maps.app.goo.gl/R7w5Pp6SJSHnrdKf8" },
    { name: "โรงจอดรถนักเรียน", desc: "โรงจอดรถนักเรียน โรงเรียนพิบูลมังสาหาร", img: "../static/images/parkcar.jpg", mapsLink: "https://maps.app.goo.gl/CLKxWNiq3jzYiT6YA" },
    { name: "ประตู 1", desc: "หน้าโรงเรียน ประตู 1", img: "../static/images/door1.png", mapsLink: "https://maps.app.goo.gl/JK7ivyJXjFs8Mwqz9" },
    { name: "ประตู 2", desc: "หน้าโรงเรียน ประตู 2", img: "../static/images/door2.jpg", mapsLink: "https://maps.app.goo.gl/4Jn1m8zvAv8QaFvL7" },
    { name: "ประตู 3", desc: "หลังโรงเรียน ประตู 3", img: "../static/images/door3.jpg", mapsLink: "https://maps.app.goo.gl/kjgL1M36hjmxoHjB9" },
    { name: "ห้องพยาบาล", desc: "ห้องพยาบาล โรงเรียนพิบูลมังสาหาร", img: "../static/images/nursingb.jpg", mapsLink: "https://maps.app.goo.gl/hb6DEgxGiwSELdd68" },
    { name: "อาคารหอประชุมราษฎ์รังสรรค์", desc: "อาคารหอประชุม 2 ตั้งอยู่แถวประตู 2 โรงเรียนพิบูลมังสาหาร", img: "../static/images/meet2.jpg", mapsLink: "https://maps.app.goo.gl/789456123" },
    { name: "อาคารหอประชุม 2", desc: "อาคารหอประชุม 2 ตั้งอยู่แถวประตู 2 โรงเรียนพิบูลมังสาหาร", img: "../static/images/meet2.jpg", mapsLink: "https://maps.app.goo.gl/789456123" },
    { name: "อาคารห้องสมุด", desc: "อาคารห้องสมุด โรงเรียนพิบูลมังสาหาร", img: "../static/images/libraryb.jpg", mapsLink: "https://maps.app.goo.gl/123456789" },
    { name: "ศาลาแห่งความฮักแพง", desc: "ศาลาแห่งความฮักแพง โรงเรียนพิบูลมังสาหาร", img: "../static/images/sala.jpg", mapsLink: "https://maps.app.goo.gl/123456789" },
    { name: "", desc: "", img: "../static/images/", mapsLink: "" },
    { name: "", desc: "", img: "../static/images/", mapsLink: "" },
    { name: "", desc: "", img: "../static/images/", mapsLink: "" },
    { name: "", desc: "", img: "../static/images/", mapsLink: "" },
];

const container = document.getElementById("buildingContainer");

function openModal(b) {
    document.getElementById("modalTitle").textContent = b.name;
    document.getElementById("modalDesc").textContent = b.desc;
    document.getElementById("modalImg").src = b.img;
    document.getElementById("modalMap").href = b.mapsLink;

    new bootstrap.Modal(
        document.getElementById("detailModal")
    ).show();
}

function renderCards(items) {
    container.innerHTML = "";

    const noResult = document.getElementById("noResult");

    if (items.length === 0) {
        noResult.style.display = "block";
        return;
    } else {
        noResult.style.display = "none";
    }

    items.forEach(b => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
            <div class="card h-100 shadow-sm" style="border-radius:18px;" id="buildingCard">
                <img src="${b.img}"
                     class="card-img-top"
                     style="height:180px; object-fit:cover; cursor:pointer;
                            border-radius:18px 18px 0 0;"
                     alt="${b.name}">

                <div class="card-body" >
                    <h5 class="fw-bold">${b.name}</h5>
                    <p class="text-muted small">${b.desc}</p>

                    <button class="btn btn-primary w-100 mt-2" id="btnlocation2">
                        ดูรายละเอียดและพิกัดอาคาร
                    </button>
                </div>
            </div>
        `;

        col.querySelector("img").addEventListener("click", () => openModal(b));
        col.querySelector("button").addEventListener("click", () => openModal(b));

        container.appendChild(col);
    });
}

// แสดงทั้งหมด
renderCards(buildings);

// ตัวรันค่าจาก index.html
const params = new URLSearchParams(window.location.search);
const q = params.get("q");

if (q) {
    const searchInput = document.getElementById("searchInput");

    // ใส่คำค้นลงช่องค้นหาอัตโนมัติ
    searchInput.value = q;

    // กรองอาคารตามคำค้น
    const filtered = buildings.filter(b =>
        b.name.toLowerCase().includes(q.toLowerCase())
    );

    renderCards(filtered);
}

// ค้นหาแบบพิมพ์แล้วกรองทันที
document.getElementById("searchInput").addEventListener("input", function () {
    const text = this.value.toLowerCase();

    const filtered = buildings.filter(b =>
        b.name.toLowerCase().includes(text) ||
        b.desc.toLowerCase().includes(text)
    );

    renderCards(filtered);
});


// ปุ่มสามขีด hamburger //
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
}

// -----------Header-----------//
const header = document.getElementById("mainHeader");
const triggerPoint = 1;

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
    // เลื่อนขึ้นแต่ยังไม่ถึงบนสุด → ค้างไว้แบบเดิม
    // ไม่มี else block สำหรับเลื่อนขึ้นแล้วซ่อน

    lastScroll = currentScroll;
});

// Animation Building Card
const group = document.getElementById("buildingContainer");
const groupObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                groupObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.2,
        rootMargin: "0px 0px -80px 0px"
    }
);

groupObserver.observe(group);