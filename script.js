/**
 * 1. DANH SÁCH DỰ ÁN ĐỒNG BỘ
 * Đảm bảo ID trùng khớp với project.html
 */
const projects = [
    { title: "ENDLESS", director: "NHAT TU", client: "UEF", color: "#8B0000" },          // ID 0
    { title: "NGOAITHUONG", director: "NHAT TU", client: "UEF", color: "#001F3F" },      // ID 1
    { title: "LOCKNLOCK", director: "NHAT TU", client: "Lock&Lock VN", color: "#D4AF37" }, // ID 2
    { title: "PRODUCT PHOTOGRAPHY", director: "NHAT TU", client: "UEF Multimedia", color: "#2D5A27" }, // ID 3
    { title: "WASTEFUL", director: "NHAT TU", client: "Travel", color: "#111" }        // ID 4
];

let currentIndex = 0;

/**
 * 2. CẬP NHẬT GIAO DIỆN
 */
function updateProject(index) {
    const p = projects[index];
    const bgArea = document.getElementById('bg-area');
    const title = document.getElementById('p-title');
    const director = document.getElementById('p-director');
    const client = document.getElementById('p-client');
    
    if (!bgArea || !title) return;

    // Chuyển màu nền mượt mà
    bgArea.style.backgroundColor = p.color;

    // Hiệu ứng đổi màu chữ dựa trên độ sáng nền
    const isLight = p.color === "#F5F5F0" || p.color === "#FFFFFF";
    document.body.style.color = isLight ? "#000" : "#fff";

    // Restart Animation tiêu đề
    title.classList.remove('fade');
    void title.offsetWidth; // Trigger reflow
    
    title.innerText = p.title;
    if (director) director.innerText = p.director;
    if (client) client.innerText = p.client;
    
    title.classList.add('fade');
}

function nextProject() {
    currentIndex = (currentIndex + 1) % projects.length;
    updateProject(currentIndex);
}

function prevProject() {
    currentIndex = (currentIndex - 1 + projects.length) % projects.length;
    updateProject(currentIndex);
}

/**
 * 3. ĐIỀU HƯỚNG CHI TIẾT
 */
function goToProjectDetail() {
    // Wasteful là dự án Coming Soon
    if (projects[currentIndex].title === "WASTEFUL") {
        alert("This project is currently in post-production. Stay tuned!");
    } else {
        window.location.href = `project.html?id=${currentIndex}`;
    }
}

/**
 * 4. OVERLAYS (ABOUT, CONTACT, TALENTS)
 */
function toggleOverlay(id) {
    const menus = ['talents-menu', 'about-menu', 'contact-menu'];
    const mainContainer = document.querySelector('.main-container');
    const target = document.getElementById(id);
    
    if (!target) return;
    const isActive = target.classList.contains('active');

    // Đóng tất cả các menu đang mở
    menus.forEach(m => document.getElementById(m)?.classList.remove('active'));

    if (!isActive) {
        target.classList.add('active');
        // Hiệu ứng thu nhỏ và làm mờ nền khi mở menu
        if (mainContainer) {
            mainContainer.style.transform = "scale(0.95)";
            mainContainer.style.filter = (id === 'contact-menu') ? "none" : "blur(15px)";
        }
    } else {
        closeAllOverlays();
    }
}

function closeAllOverlays() {
    const menus = ['talents-menu', 'about-menu', 'contact-menu'];
    menus.forEach(m => document.getElementById(m)?.classList.remove('active'));
    
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.style.transform = "scale(1)";
        mainContainer.style.filter = "none";
    }
}

/**
 * 5. THỜI GIAN THỰC
 */
function updateTime() {
    const timeDisplay = document.getElementById('current-time');
    if (!timeDisplay) return;
    const now = new Date();
    // Format: 14:30:05 • 06/04/2026
    timeDisplay.innerText = now.toLocaleTimeString('en-GB') + ' • ' + now.toLocaleDateString('en-GB');
}

/**
 * 6. XỬ LÝ VUỐT TRÊN MOBILE (SWIPE)
 */
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    const threshold = 50; // Khoảng cách tối thiểu để tính là vuốt
    if (touchStartX - touchEndX > threshold) nextProject(); // Vuốt sang trái
    if (touchEndX - touchStartX > threshold) prevProject(); // Vuốt sang phải
}

/**
 * 7. SỰ KIỆN KHỞI TẠO
 */
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo trang đầu tiên
    updateProject(0);

    // Chạy đồng hồ mỗi giây
    setInterval(updateTime, 1000);
    updateTime();

    // Sự kiện bàn phím
    document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight") nextProject();
        if (e.key === "ArrowLeft") prevProject();
        if (e.key === "Escape") closeAllOverlays();
        if (e.key === "Enter") goToProjectDetail();
    });

    // Sự kiện Swipe Mobile trên vùng bg-area
    const bgArea = document.getElementById('bg-area');
    if (bgArea) {
        bgArea.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        bgArea.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});
        
        // Nhấp vào vùng nền để vào xem chi tiết
        bgArea.addEventListener('click', (e) => {
            // Chỉ vào trang nếu không nhấp trúng các nút điều hướng (nếu có)
            if(e.target.id === 'bg-area' || e.target.id === 'p-title') {
                goToProjectDetail();
            }
        });
    }
});