// ตั้งค่า key สำหรับเก็บข้อมูลใน localStorage
const USERS_KEY = 'restaurant_users';
const CURRENT_USER_KEY = 'restaurant_current_user';

// สร้างข้อมูลผู้ใช้เริ่มต้นถ้ายังไม่มี
(function initializeDefaultUsers() {
    const users = localStorage.getItem(USERS_KEY);
    if (!users) {
        const defaultUsers = [
            { username: 'admin', password: 'admin', role: 'admin' },
            { username: 'staff1', password: 'staff1', role: 'staff' },
            { username: 'staff2', password: 'staff2', role: 'staff' }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
        console.log('Initialized default users:', defaultUsers);
    }
})();

// โหลดข้อมูลผู้ใช้ทั้งหมด
function getUsers() {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [
        { username: 'admin', password: 'admin', role: 'admin' },
        { username: 'staff1', password: 'staff1', role: 'staff' },
        { username: 'staff2', password: 'staff2', role: 'staff' }
    ];
}

// บันทึกข้อมูลผู้ใช้ทั้งหมด
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// เพิ่มผู้ใช้ใหม่
function addUser(username, password, role) {
    const users = getUsers();
    // ตรวจสอบว่ามีชื่อผู้ใช้นี้อยู่แล้วหรือไม่
    if (users.some(u => u.username === username)) {
        return false;
    }
    users.push({ username, password, role });
    saveUsers(users);
    return true;
}

// อัปเดตข้อมูลผู้ใช้
function updateUser(username, newPassword, newRole) {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return false;
    
    // อัปเดตรหัสผ่านถ้ามี
    if (newPassword) {
        user.password = newPassword;
    }
    
    // อัปเดตสิทธิ์ถ้ามี
    if (newRole && (newRole === 'admin' || newRole === 'staff')) {
        // ตรวจสอบว่าไม่ใช่การเปลี่ยนสิทธิ์ admin คนสุดท้าย
        if (user.role === 'admin' && newRole !== 'admin') {
            const adminCount = users.filter(u => u.role === 'admin').length;
            if (adminCount <= 1) {
                return { success: false, message: 'ไม่สามารถเปลี่ยนสิทธิ์ admin คนสุดท้ายได้' };
            }
        }
        user.role = newRole;
    }
    
    saveUsers(users);
    return { success: true, message: 'อัปเดตข้อมูลสำเร็จ' };
}

// ลบผู้ใช้
function removeUser(username) {
    const users = getUsers();
    // ห้ามลบ admin คนสุดท้าย
    if (username === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
        return false;
    }
    const newUsers = users.filter(u => u.username !== username);
    if (newUsers.length === users.length) return false;
    saveUsers(newUsers);
    return true;
}

// เข้าสู่ระบบ
function login(username, password, role) {
    console.log('Attempting login:', { username, role }); // debug log
    const users = getUsers(); // ใช้ฟังก์ชัน getUsers แทนการเรียก localStorage โดยตรง
    console.log('Current users:', users); // debug log
    
    const user = users.find(u => 
        u.username === username && 
        u.password === password &&
        u.role === role
    );
    if (user) {
        const { password, ...safeUser } = user;
        // store current user in sessionStorage (per-tab) to avoid cross-tab auto-sync that causes flicker
        sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
        return safeUser;
    }
    return null;
}

// ออกจากระบบ
function logout() {
    // remove per-tab session state and redirect to login
    try { sessionStorage.removeItem(CURRENT_USER_KEY); } catch (e) {}
    window.location.replace('index.html');
}
// Use per-tab sessionStorage for current user; no cross-tab auto-sync to avoid flicker

// ตรวจสอบผู้ใช้ปัจจุบัน
function getCurrentUser() {
    const userJson = sessionStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

// ตรวจสอบการเข้าถึงหน้าตามสิทธิ์
function checkAccess() {
    const user = getCurrentUser();
    // get the current filename (lower-cased for safety)
    const currentPage = (window.location.pathname || '').split('/').pop().toLowerCase();

    // if we couldn't determine page, do nothing
    if (!currentPage) return;

    // Allow index.html to be accessed without login
    if (currentPage === 'index.html' || currentPage === '') return;

    // if not logged in, redirect to login page immediately (no toast loop)
    if (!user) {
        window.location.replace('index.html');
        return;
    }

    // If user exists but role doesn't match the current page, redirect immediately
    if (currentPage === 'admin.html' && user.role !== 'admin') {
        window.location.replace('staff.html');
        return;
    } else if (currentPage === 'staff.html' && user.role !== 'staff') {
        window.location.replace('admin.html');
        return;
    }
}

// เรียกใช้ checkAccess เมื่อโหลดหน้า (เรียกครั้งเดียว)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAccess);
} else {
    checkAccess();
}