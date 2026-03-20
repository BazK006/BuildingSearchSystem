// ปุ่มสามขีด hamburger //
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
}

//-----------Header--------------//
const header = document.getElementById("mainHeader");
const triggerPoint = 1;

header.classList.add("header-hide");

let lastScroll = 0;

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= triggerPoint) {
        header.classList.add("header-hide");
        header.classList.remove("header-show");
    }
    else if (currentScroll > lastScroll) {
        header.classList.remove("header-hide");
        header.classList.add("header-show");
    }
    lastScroll = currentScroll;
});

// เอฟเฟคขยายเข้า
window.addEventListener("load", () => {
    const mapBox = document.querySelector(".map-animate");
    mapBox.classList.add("show");
});

// Map Animation 
const mapItems = document.querySelectorAll(
    ".map-animate, .map-img-animate, .map-text-animate, .map-btn-animate"
);

const mapObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    {
        threshold: 0.2
    }
);

mapItems.forEach(item => mapObserver.observe(item));