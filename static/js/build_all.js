// -----------Header------------ //
const header = document.getElementById("mainHeader");
const triggerPoint = 0;

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


// ปุ่มสามขีด hamburger //
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
}

// modal เด้งขึ้น //
document.querySelectorAll('.open-modal').forEach(card => {
    card.addEventListener('click', function () {
        const img = this.getAttribute('data-img');
        document.getElementById('modalImage').src = img;

        const modal = new bootstrap.Modal(document.getElementById('imgModal'));
        modal.show();
    });
});

const cards = document.querySelectorAll(".animate-card");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

cards.forEach(card => observer.observe(card));