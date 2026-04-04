const buildings = window.dynamicBuildings || [];
const container = document.getElementById("buildingContainer");

let currentUserCoords = null;
let isGpsActive = false;

const extractCoords = (url) => {
    if (!url) return null;
    const regex = /(?:q=|@|loc:)([-+]?\d*\.\d+|\d+),([-+]?\d*\.\d+|\d+)/;
    const match = url.match(regex);
    return match ? { lat: parseFloat(match[1]), lon: parseFloat(match[2]) } : null;
};

const getPreciseDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

function openModal(b) {
    document.getElementById("modalTitle").textContent = b.name;
    document.getElementById("modalDesc").textContent = b.desc;
    document.getElementById("modalImg").src = b.img;
    document.getElementById("modalViewCount").textContent = b.viewCount;

    const mapBtn = document.getElementById("modalMap");
    mapBtn.href = b.mapsLink;

    mapBtn.onclick = function () {
        fetch(`increment_view/${b.id}`, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    b.viewCount = data.new_count;
                    document.getElementById("modalViewCount").textContent = data.new_count;
                    document.getElementById(`view-card-${b.id}`).textContent = data.new_count;
                }
            })
            .catch(error => console.error('Error:', error));
    };

    new bootstrap.Modal(document.getElementById("detailModal")).show();
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

    items.forEach((b, index) => {
        let distBadge = "";
        let isNearest = (index === 0 && isGpsActive && searchInput.value === "" && categorySelect.value === "");

        const targetMapLink = b.mapsLink;

        if (currentUserCoords && targetMapLink) {
            const bCoords = extractCoords(targetMapLink);
            if (bCoords) {
                const dist = getPreciseDistance(currentUserCoords.lat, currentUserCoords.lon, bCoords.lat, bCoords.lon);
                const distText = dist < 1000 ? `~${Math.round(dist)} ม.` : `~${(dist / 1000).toFixed(2)} กม.`;

                let badgeColor = "bg-secondary";

                if (dist == 0) {
                    badgeColor = "bg-success";
                } else if (dist <= 150) {
                    badgeColor = "bg-primary";
                } else if (dist <= 300) {
                    badgeColor = "bg-warning";
                } else if (dist <= 500) {
                    badgeColor = "bg-danger";
                } else {
                    badgeColor = "bg-dark";
                }



                distBadge = `
                    <div class="position-absolute top-0 start-0 mt-3 ms-3" style="z-index: 2;">
                        <span class="badge ${badgeColor} rounded-pill shadow-sm py-2 px-3">
                            <i class="bi bi-geo-alt-fill"></i> ${isNearest ? 'ใกล้ที่สุด: ' : ''}${distText}
                        </span>
                    </div>`;
            }
        }

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4 fade-in";
        col.style.animationDelay = `${index * 0.1}s`;

        col.innerHTML = `
            <div class="card h-100 shadow-sm position-relative building-card" style="border-radius:18px;">
                ${distBadge}
                
                <span class="badge bg-info text-dark position-absolute top-0 end-0 mt-3 me-3 rounded-pill shadow-sm" style="z-index: 2;">
                    View <span id="view-card-${b.id}">${b.viewCount || 0}</span>
                </span>

                <img src="${b.img}"
                     class="card-img-top"
                     style="height:180px; object-fit:cover; cursor:pointer; border-radius:18px 18px 0 0;"
                     alt="${b.name}"
                     onerror="this.onerror=null; this.src='../static/images/default_building.jpg'">
                
                <div class="card-body">
                    <h5 class="fw-bold">${b.name}</h5>
                    <p class="text-muted small text-truncate-2">${b.desc || ''}</p>
                    <button class="btn btn-primary w-100 mt-2 btnlocation2">
                        ดูรายละเอียดและพิกัดอาคาร
                    </button>
                </div>
            </div>
        `;

        col.querySelector("img").addEventListener("click", () => openModal(b));
        col.querySelector("button.btnlocation2").addEventListener("click", () => openModal(b));

        container.appendChild(col);
    });
}

document.getElementById('btnNearMe')?.addEventListener('click', function () {
    const btn = this;
    const btnText = document.getElementById('btnNearMeText');
    const spinner = document.getElementById('nearMeSpinner');
    const icon = btn.querySelector('i');

    if (isGpsActive) {
        isGpsActive = false;
        currentUserCoords = null;
        btn.classList.remove('bg-danger');
        btn.classList.add('bg-primary');

        if (icon) {
            icon.className = 'bi bi-geo-alt-fill';
            icon.classList.remove('d-none');
        }

        btnText.innerText = "ค้นหาอาคารใกล้ฉัน";

        // รีเซ็ตหน้าจอ
        if (searchInput) searchInput.value = "";
        if (categorySelect) categorySelect.value = "";
        filterBuildings();
        return;
    }

    if (!navigator.geolocation)
        return alert("เครื่องคุณไม่รองรับ GPS");

    btn.disabled = true;
    if (icon) icon.classList.add('d-none');
    spinner.classList.remove('d-none');
    btnText.innerText = "กำลังคำนวณ...";

    navigator.geolocation.getCurrentPosition((pos) => {
        isGpsActive = true;
        currentUserCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };

        if (searchInput) searchInput.value = "";
        if (categorySelect) categorySelect.value = "";

        filterBuildings();

        btn.disabled = false;
        btn.classList.remove('bg-primary');
        btn.classList.add('bg-danger');

        if (icon) {
            icon.className = 'bi bi-x-circle';
            icon.classList.remove('d-none');
        }
        spinner.classList.add('d-none');
        btnText.innerText = "ยกเลิกการค้นหา";

    }, (err) => {
        let errorTitle = "ระบุพิกัดไม่สำเร็จ";
        let errorMsg = "กรุณาเปิดใช้งาน GPS และกด 'อนุญาต' (Allow) ในเบราว์เซอร์ด้วย";

        if (err.code === 1) {
            errorTitle = "สิทธิ์การเข้าถึงถูกปฏิเสธ";
            errorMsg = "รบกวนคุณอนุญาตให้เว็บเข้าถึงตำแหน่ง (Location) เพื่อใช้ฟีเจอร์ค้นหาอาคารใกล้ฉัน";
        } else if (err.code === 3) {
            errorTitle = "ใช้เวลานานเกินไป";
            errorMsg = "ระบบไม่สามารถดึงพิกัดได้ทันเวลา กรุณาลองใหม่อีกครั้งในที่โล่ง";
        }

        Swal.fire({
            title: errorTitle,
            text: errorMsg,
            icon: 'warning',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#007bff',
            borderRadius: '18px',
            customClass: {
                popup: 'rounded-4 shadow-sm'
            }
        });

        btn.disabled = false;
        if (icon) {
            icon.className = 'bi bi-geo-alt-fill';
            icon.classList.remove('d-none');
        }
        spinner.classList.add('d-none');
        btnText.innerText = "ค้นหาอาคารใกล้ฉัน";

    }, { enableHighAccuracy: true });
});

function filterBuildings() {
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const selectedCat = categorySelect ? categorySelect.value : "";

    let filtered = buildings.filter(b => {
        const matchText = b.name.toLowerCase().includes(searchText) || (b.desc && b.desc.toLowerCase().includes(searchText));
        const matchCategory = selectedCat === "" || String(b.categoryId) === String(selectedCat);
        return matchText && matchCategory;
    });

    if (isGpsActive && currentUserCoords) {
        filtered.sort((a, b) => {
            const ca = extractCoords(a.mapsLink);
            const cb = extractCoords(b.mapsLink);
            if (!ca || !cb) return 0;
            return getPreciseDistance(currentUserCoords.lat, currentUserCoords.lon, ca.lat, ca.lon) -
                getPreciseDistance(currentUserCoords.lat, currentUserCoords.lon, cb.lat, cb.lon);
        });
    }

    renderCards(filtered);
}

if (searchInput) searchInput.addEventListener("input", filterBuildings);
if (categorySelect) categorySelect.addEventListener("change", filterBuildings);

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const cat = params.get("select_cat");

    if (q && searchInput) searchInput.value = q;
    if (cat && categorySelect) categorySelect.value = cat;

    filterBuildings();
});

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
    document.querySelector(".hamburger").classList.toggle("active");
}

const header = document.getElementById("mainHeader");
const triggerPoint = 1;
let lastScroll = 0;

if (header) {
    header.classList.add("header-hide");
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;
        if (currentScroll <= triggerPoint) {
            header.classList.add("header-hide");
            header.classList.remove("header-show");
        } else if (currentScroll > lastScroll) {
            header.classList.remove("header-hide");
            header.classList.add("header-show");
        }
        lastScroll = currentScroll;
    });
}

const group = document.getElementById("buildingContainer");
if (group) {
    const groupObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                groupObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });
    groupObserver.observe(group);
}