// 1. Danh sách dự án đồng bộ với project.html
const projects = [
    { title: "ENDLESS", director: "NHAT TU", client: "UEF", color: "#8B0000" },          // ID 0
    { title: "NGOAITHUONG", director: "NHAT TU", client: "UEF", color: "#001F3F" },      // ID 1
    { title: "LOCKNLOCK", director: "Huy Dương", client: "Lock&Lock VN", color: "#D4AF37" }, // ID 2
    { title: "PRODUCT PHOTOGRAPHY", director: "D.G. Huy", client: "UEF Multimedia", color: "#2D5A27" }, // ID 3
    { title: "WASTEFUL", director: "Media Team", client: "Travel", color: "#111" }    // ID 4 - Coming Soon (Nền đen)
];

let currentIndex = 0;

/**
 * Cập nhật giao diện khi chuyển đổi dự án
 */
function updateProject(index) {
    const p = projects[index];
    const bgArea = document.getElementById('bg-area');
    const title = document.getElementById('p-title');
    
    bgArea.style.backgroundColor = p.color;

    // Đổi màu chữ nếu nền là Wasteful hoặc các nền tối khác
    document.body.style.color = (p.color === "#F5F5F0") ? "#000" : "#fff";

    title.classList.remove('fade');
    void title.offsetWidth; 
    
    // Nếu là Wasteful thì thêm chữ (Coming Soon) cạnh tiêu đề cho rõ ràng
    title.innerText = (p.title === "WASTEFUL") ? p.title + " (SOON)" : p.title;
    
    document.getElementById('p-director').innerText = p.director;
    document.getElementById('p-client').innerText = p.client;
    
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
 * Điều hướng hoặc báo Coming Soon
 */
function goToProjectDetail() {
    if (projects[currentIndex].title === "WASTEFUL") {
        alert("This project is currently in post-production. Stay tuned!");
    } else {
        window.location.href = `project.html?id=${currentIndex}`;
    }
}

/**
 * Xử lý Overlays (Talents, About, Contact)
 */
function toggleOverlay(id) {
    const menus = ['talents-menu', 'about-menu', 'contact-menu'];
    const mainContainer = document.querySelector('.main-container');
    const target = document.getElementById(id);
    
    if (!target) return;
    const isActive = target.classList.contains('active');

    menus.forEach(m => document.getElementById(m)?.classList.remove('active'));

    if (!isActive) {
        target.classList.add('active');
        mainContainer.style.transform = "scale(0.96)";
        mainContainer.style.filter = (id === 'contact-menu') ? "none" : "blur(10px)";
    } else {
        closeAllOverlays();
    }
}

function closeAllOverlays() {
    ['talents-menu', 'about-menu', 'contact-menu'].forEach(m => {
        document.getElementById(m)?.classList.remove('active');
    });
    const mainContainer = document.querySelector('.main-container');
    mainContainer.style.transform = "scale(1)";
    mainContainer.style.filter = "none";
}

function updateTime() {
    const timeDisplay = document.getElementById('current-time');
    if (!timeDisplay) return;
    const now = new Date();
    timeDisplay.innerText = now.toLocaleTimeString('en-GB') + ' • ' + now.toLocaleDateString('en-GB');
}

// Sự kiện phím
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") nextProject();
    if (e.key === "ArrowLeft") prevProject();
    if (e.key === "Escape") closeAllOverlays();
});

document.addEventListener('DOMContentLoaded', () => {
    updateProject(0);
    setInterval(updateTime, 1000);
    updateTime();
});