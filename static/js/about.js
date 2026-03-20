// Introduction Hero
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    {
        threshold: 0.15
    }
);

document.querySelectorAll(".hero-about").forEach(card => {
    observer.observe(card);
});

// Introduction System
const Systemandpurpose_observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.25 }
);

document.querySelectorAll(".about-card").forEach(card => {
    observer.observe(card);
});

// Background and Importance
const BGandImportance_observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.25 }
);

document.querySelectorAll(".fade-left, .fade-right, .fade-up").forEach(el => {
    observer.observe(el);
});

const Systemscope_observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");

                // ถ้ามี ul ข้างใน ให้มันโชว์ด้วย
                const list = entry.target.querySelector(".stagger-list");
                if (list) list.classList.add("show");

                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.25 }
);

document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

const Feature_observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");

                const featureList = entry.target.querySelector(".feature-list");
                if (featureList) featureList.classList.add("show");

                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.3 }
);

document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));


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

// ปุ่มสามขีด hamburger //
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
}