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
        
        // บันทึกเวลา login ล่าสุด (สำหรับแสดงสถานะ Active)
        const loginTime = Date.now();
        localStorage.setItem(`last_login_${username}`, loginTime.toString());
        
        // เพิ่มเข้า online_users list
        const onlineUsers = JSON.parse(localStorage.getItem('online_users') || '[]');
        const filteredUsers = onlineUsers.filter(u => u.username !== username);
        filteredUsers.push({
            username: username,
            role: role,
            lastActive: loginTime,
            loginTime: loginTime
        });
        localStorage.setItem('online_users', JSON.stringify(filteredUsers));
        
        console.log(`✅ Login success: ${username} - Added to online_users`);
        
        // ส่งสถานะไปยัง Google Sheets ทันที
        syncOnlineStatusToSheets(username, role);
        
        return safeUser;
    }
    return null;
}

// ฟังก์ชันอัปเดตสถานะ online (เรียกใช้ทุก 10 วินาที)
function updateOnlineStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const now = Date.now();
        
        // อัปเดต last_login
        localStorage.setItem(`last_login_${currentUser.username}`, now.toString());
        
        // อัปเดต online_users
        const onlineUsers = JSON.parse(localStorage.getItem('online_users') || '[]');
        const filteredUsers = onlineUsers.filter(u => u.username !== currentUser.username);
        filteredUsers.push({
            username: currentUser.username,
            role: currentUser.role,
            lastActive: now,
            loginTime: onlineUsers.find(u => u.username === currentUser.username)?.loginTime || now
        });
        
        // ลบ user ที่ offline เกิน 2 นาที
        const activeUsers = filteredUsers.filter(u => (now - u.lastActive) < 120000);
        localStorage.setItem('online_users', JSON.stringify(activeUsers));
        
        // ส่งสถานะไปยัง Google Sheets (ถ้ามี WEB_APP_URL)
        syncOnlineStatusToSheets(currentUser.username, currentUser.role);
    }
}

// ฟังก์ชันส่งสถานะไปยัง Google Sheets
async function syncOnlineStatusToSheets(username, role) {
    // ดึง WEB_APP_URL จาก window (ถ้ามีการตั้งค่าไว้)
    const WEB_APP_URL = window.WEB_APP_URL || localStorage.getItem('WEB_APP_URL');
    
    // ปิดการใช้งาน Google Sheets ชั่วคราว (เพราะ CORS issue บน localhost)
    // ระบบจะใช้ localStorage อย่างเดียว (ทำงานได้ในเบราว์เซอร์เดียวกัน)
    console.log('ℹ️ Google Sheets sync disabled (localhost CORS limitation)');
    return;
    
    // Uncomment บรรทัดด้านล่างเมื่อ deploy ขึ้น web server จริง
    /*
    console.log('🔍 Checking WEB_APP_URL:', WEB_APP_URL ? 'Found' : 'Not found');
    
    if (!WEB_APP_URL || WEB_APP_URL.includes('REPLACE_WITH_YOUR_WEB_APP_URL')) {
        // ไม่มี URL หรือยังไม่ได้ตั้งค่า - ข้าม
        console.log('⚠️ WEB_APP_URL not configured, skipping Sheets sync');
        return;
    }
    */
    
    try {
        // สร้าง browser ID ที่ unique (ใช้ localStorage เพื่อให้คงที่ในเบราว์เซอร์เดียวกัน)
        let browserId = localStorage.getItem('browser_id');
        if (!browserId) {
            browserId = 'browser_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('browser_id', browserId);
        }
        
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'updateOnlineStatus',
                username: username,
                role: role,
                browser: browserId
            })
        });
        
        if (response.ok) {
            console.log(`✅ Synced online status to Sheets: ${username}`);
        }
    } catch (error) {
        // ไม่แสดง error เพราะเป็น optional feature
        console.log('Could not sync to Sheets (optional):', error.message);
    }
}

// ฟังก์ชันลบสถานะจาก Google Sheets เมื่อ logout
async function removeOnlineStatusFromSheets(username) {
    const WEB_APP_URL = window.WEB_APP_URL || localStorage.getItem('WEB_APP_URL');
    
    if (!WEB_APP_URL || WEB_APP_URL.includes('REPLACE_WITH_YOUR_WEB_APP_URL')) {
        return;
    }
    
    try {
        const browserId = localStorage.getItem('browser_id') || 'unknown';
        
        await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'removeOnlineStatus',
                username: username,
                browser: browserId
            })
        });
        
        console.log(`✅ Removed online status from Sheets: ${username}`);
    } catch (error) {
        console.log('Could not remove from Sheets (optional):', error.message);
    }
}

// ออกจากระบบ
async function logout() {
    // ดึงข้อมูล user ปัจจุบันก่อนลบ
    const currentUserJson = sessionStorage.getItem(CURRENT_USER_KEY);
    
    if (currentUserJson) {
        try {
            const currentUser = JSON.parse(currentUserJson);
            const username = currentUser.username;
            
            // ลบออกจาก online_users list
            const onlineUsers = JSON.parse(localStorage.getItem('online_users') || '[]');
            const filteredUsers = onlineUsers.filter(u => u.username !== username);
            localStorage.setItem('online_users', JSON.stringify(filteredUsers));
            
            // ลบสถานะจาก Google Sheets
            await removeOnlineStatusFromSheets(username);
            
            console.log(`✅ Logout: ${username} - ลบออกจาก online_users แล้ว`);
        } catch (e) {
            console.error('Error during logout cleanup:', e);
        }
    }
    
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