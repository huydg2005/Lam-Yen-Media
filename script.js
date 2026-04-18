/**
 * 1. DANH SÁCH DỰ ÁN ĐỒNG BỘ
 */
const projects = [
    { title: "ENDLESS", director: "NHAT TU", client: "UEF", color: "#8B0000" },
    { title: "NGOAITHUONG", director: "NHAT TU", client: "UEF", color: "#001F3F" },
    { title: "LOCKNLOCK", director: "NHAT TU", client: "Lock&Lock VN", color: "#D4AF37" },
    { title: "PRODUCT PHOTOGRAPHY", director: "NHAT TU", client: "UEF Multimedia", color: "#2D5A27" },
    { title: "OCEAN FLASHLIGHT", director: "NHAT TU", client: "Nhungduatrecogu", color: "#3C7DBE" }, 
    { title: "EMPTY SCENES", director: "TRI MINH", client: "Nhungduatrecogu", color: "#02024e" } 
];

let currentIndex = 0;

/**
 * 2. TỰ ĐỘNG ĐỔ BANNER VÀO MỤC WORKS
 */
function renderWorksMenu() {
    const worksList = document.getElementById('works-list');
    if (!worksList) return;
    
    let worksHTML = "";
    projects.forEach((p, index) => {
        const num = (index + 1) < 10 ? `0${index + 1}` : index + 1;
        worksHTML += `
            <a href="project.html?id=${index}" class="work-banner-item" style="background-color: ${p.color}">
                <div style="display: flex; align-items: center;">
                    <span class="work-banner-num">${num}</span>
                    <h2 class="work-banner-title rolling-text">
                        <span>${p.title}</span>
                        <span>${p.title}</span>
                    </h2>
                </div>
                <span class="work-banner-client">/ ${p.client}</span>
            </a>
        `;
    });
    worksList.innerHTML = worksHTML;
}

/**
 * 3. CẬP NHẬT GIAO DIỆN TRANG CHỦ
 */
function updateProject(index) {
    const p = projects[index];
    const bgArea = document.getElementById('bg-area');
    const title = document.getElementById('p-title');
    const director = document.getElementById('p-director');
    const client = document.getElementById('p-client');
    
    if (!bgArea || !title) return;

    bgArea.style.backgroundColor = p.color;
    title.classList.remove('fade');
    void title.offsetWidth; 
    
    title.innerText = p.title;
    if (director) director.innerText = p.director;
    if (client) client.innerText = p.client;
    
    title.classList.add('fade');
}

function nextProject() { currentIndex = (currentIndex + 1) % projects.length; updateProject(currentIndex); }
function prevProject() { currentIndex = (currentIndex - 1 + projects.length) % projects.length; updateProject(currentIndex); }

/**
 * 4. ĐIỀU HƯỚNG & OVERLAYS
 */
function goToProjectDetail() {
    if (projects[currentIndex].title === "WASTEFUL") {
        alert("This project is currently in post-production.");
    } else {
        window.location.href = `project.html?id=${currentIndex}`;
    }
}

function toggleOverlay(id) {
    const menus = ['talents-menu', 'about-menu', 'contact-menu', 'works-menu', 'mobile-nav-menu'];
    const mainContainer = document.querySelector('.main-container');
    const target = document.getElementById(id);
    
    if (!target) return;
    const isActive = target.classList.contains('active');

    menus.forEach(m => document.getElementById(m)?.classList.remove('active'));

    if (!isActive) {
        target.classList.add('active');
        if (mainContainer) {
            mainContainer.style.transform = "scale(0.95)";
            mainContainer.style.filter = (id === 'contact-menu') ? "none" : "blur(15px)";
        }
    } else {
        closeAllOverlays();
    }
}

function closeAllOverlays() {
    ['talents-menu', 'about-menu', 'contact-menu', 'works-menu', 'mobile-nav-menu'].forEach(id => {
        document.getElementById(id)?.classList.remove('active');
    });
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.style.transform = "scale(1)";
        mainContainer.style.filter = "none";
    }
}

/**
 * 5. THỜI GIAN THỰC & KHỞI TẠO SỰ KIỆN
 */
document.addEventListener('DOMContentLoaded', () => {
    updateProject(0);
    renderWorksMenu(); // Khởi tạo danh sách banner

    // Đồng hồ
    setInterval(() => {
        const timeDisplay = document.getElementById('live-time') || document.getElementById('current-time');
        if (timeDisplay) {
            const now = new Date();
            timeDisplay.innerText = now.toLocaleTimeString('en-GB') + ' • ' + now.toLocaleDateString('en-GB');
        }
    }, 1000);

    // Bàn phím
    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight") nextProject();
        if (e.key === "ArrowLeft") prevProject();
        if (e.key === "Escape") closeAllOverlays();
    });

    // 6. LOGIC VUỐT (SWIPE) TRÊN MOBILE
    const bgArea = document.getElementById('bg-area');
    let touchstartX = 0;
    let touchstartY = 0;

    // Vuốt ngang đổi dự án (Chỉ ở vùng nền)
    bgArea?.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, {passive: true});

    bgArea?.addEventListener('touchend', e => {
        let touchendX = e.changedTouches[0].screenX;
        if (touchstartX - touchendX > 50) nextProject();
        if (touchendX - touchstartX > 50) prevProject();
    }, {passive: true});

    // VUỐT LÊN ĐỂ ĐÓNG MENU (Chỉ dành cho thiết bị cảm ứng)
    if ('ontouchstart' in window) {
        document.querySelectorAll('.overlay').forEach(overlay => {
            overlay.addEventListener('touchstart', e => {
                touchstartY = e.changedTouches[0].screenY;
            }, {passive: true});

            overlay.addEventListener('touchend', e => {
                let touchendY = e.changedTouches[0].screenY;
                // Nếu vuốt lên (Y bắt đầu lớn hơn Y kết thúc) trên 70px
                if (touchstartY - touchendY > 70) {
                    closeAllOverlays();
                }
            }, {passive: true});
        });
    }

    // Click vùng nền để vào project
    bgArea?.addEventListener('click', (e) => {
        if(e.target.id === 'bg-area' || e.target.id === 'p-title') goToProjectDetail();
    });
});