/**
 * 1. DANH SÁCH DỰ ÁN ĐỒNG BỘ
 */
const projects = [
    { title: "ENDLESS", director: "NHAT TU", client: "THEFIRSTTAKE", color: "#8B0000" },
    { title: "NGOAITHUONG", director: "NHAT TU", client: "UEF", color: "#001F3F" },
    { title: "LOCKNLOCK", director: "NHAT TU", client: "Lock&Lock VN", color: "#D4AF37" },
    { title: "PRODUCT PHOTOGRAPHY", director: "NHAT TU", client: "UEF Multimedia", color: "#2D5A27" },
    { title: "OCEAN FLASHLIGHT", director: "NHAT TU", client: "Nhungduatrecogu", color: "#3C7DBE" }, 
    { title: "EMPTY SCENES", director: "TRI MINH", client: "Phongcanhcogu", color: "#02024e" } 
];

const textData = {
    title: "LAMYENMEDIA",
    p1: "Tại LAMYENMEDIA, chúng tôi không chỉ tạo ra hình ảnh, chúng tôi kiến tạo những trải nghiệm thị giác mang hơi thở của thời đại. Được dẫn dắt bởi đội ngũ những nhà sáng tạo trẻ đầy khao khát, chúng tôi tin rằng mỗi khung hình là một mảnh ghép của thực tại được tái hiện bằng trái tim.",
    p2: "Dù là chụp ảnh sản phẩm tinh xảo hay những thước phim điện ảnh sâu lắng, mục tiêu duy nhất của chúng tôi là lưu giữ những gì quý giá nhất trong lớp vỏ bọc của nghệ thuật."
};

let currentIndex = 0;
let isTyping = false; 
let isSwiping = false; 

/**
 * 2. HIỆU ỨNG ĐÁNH MÁY (TYPING)
 */
function runTypingEffect() {
    if (isTyping) return; 

    const titleEl = document.getElementById('type-title');
    const p1El = document.getElementById('type-p1');
    const p2El = document.getElementById('type-p2');

    if (!titleEl || !p1El || !p2El) return;

    titleEl.innerText = ""; p1El.innerText = ""; p2El.innerText = "";
    isTyping = true;

    function type(element, text, speed, callback) {
        let charIndex = 0;
        element.classList.add('typing');
        
        function typing() {
            if (charIndex < text.length) {
                element.innerText += text.charAt(charIndex);
                charIndex++;
                setTimeout(typing, speed);
            } else {
                element.classList.remove('typing');
                if (callback) callback();
                else isTyping = false; 
            }
        }
        typing();
    }

    type(titleEl, textData.title, 50, () => {
        type(p1El, textData.p1, 20, () => {
            type(p2El, textData.p2, 20);
        });
    });
}

/**
 * 3. GIAO DIỆN & ĐIỀU HƯỚNG
 */
function updateProject(index) {
    const p = projects[index];
    const bgArea = document.getElementById('bg-area');
    const title = document.getElementById('p-title');
    const directorEl = document.getElementById('p-director');
    const clientEl = document.getElementById('p-client');

    if (!bgArea || !title) return;

    bgArea.style.backgroundColor = p.color;
    title.classList.remove('fade');
    void title.offsetWidth; 
    title.innerText = p.title;
    
    if (directorEl) directorEl.innerText = p.director;
    if (clientEl) clientEl.innerText = p.client;
    
    title.classList.add('fade');
}

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
                    <h2 class="work-banner-title rolling-text"><span>${p.title}</span><span>${p.title}</span></h2>
                </div>
                <span class="work-banner-client">/ ${p.client}</span>
            </a>`;
    });
    worksList.innerHTML = worksHTML;
}

function nextProject() { currentIndex = (currentIndex + 1) % projects.length; updateProject(currentIndex); }
function prevProject() { currentIndex = (currentIndex - 1 + projects.length) % projects.length; updateProject(currentIndex); }

function toggleOverlay(id) {
    const menus = ['talents-menu', 'about-menu', 'contact-menu', 'works-menu', 'mobile-nav-menu'];
    const mainContainer = document.querySelector('.main-container');
    const target = document.getElementById(id);
    if (!target) return;

    const isActive = target.classList.contains('active');
    menus.forEach(m => document.getElementById(m)?.classList.remove('active'));

    if (!isActive) {
        target.classList.add('active');
        if (mainContainer) mainContainer.style.transform = "scale(0.95)";
        if (id === 'about-menu') {
            setTimeout(runTypingEffect, 600);
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
    if (mainContainer) mainContainer.style.transform = "scale(1)";
    isTyping = false; 
}

/**
 * 4. KHỞI TẠO & SỰ KIỆN
 */
document.addEventListener('DOMContentLoaded', () => {
    updateProject(0);
    renderWorksMenu();

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

    // VUỐT (SWIPE) MOBILE
    const bgArea = document.getElementById('bg-area');
    let startX = 0, startY = 0;

    bgArea?.addEventListener('touchstart', e => { 
        startX = e.changedTouches[0].screenX; 
        isSwiping = false; 
    }, {passive: true});

    bgArea?.addEventListener('touchend', e => {
        let diff = startX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) { 
            isSwiping = true; 
            diff > 0 ? nextProject() : prevProject(); 
        }
    }, {passive: true});

    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.addEventListener('touchstart', e => { startY = e.changedTouches[0].screenY; }, {passive: true});
        overlay.addEventListener('touchend', e => {
            if (startY - e.changedTouches[0].screenY > 70) closeAllOverlays();
        }, {passive: true});
    });

    bgArea?.addEventListener('click', (e) => {
        if (!isSwiping && (e.target.id === 'bg-area' || e.target.id === 'p-title')) {
            window.location.href = `project.html?id=${currentIndex}`;
        }
    });
});