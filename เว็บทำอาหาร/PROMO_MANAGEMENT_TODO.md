# 🔥 สรุปการปรับปรุงระบบโปรโมชั่น

## ✅ สิ่งที่ทำแล้ว:

1. เพิ่มแท็บ "จัดการโปรโมชั่น" ในหน้าจัดการเมนู
2. สร้างตารางแสดงโปรโมชั่น
3. สร้างฟอร์มเพิ่มโปรโมชั่น

## ⚠️ ปัญหาที่พบ:

โค้ดใน admin.html มีข้อผิดพลาดในส่วนโปรโมชั่น (บรรทัด 662-695)
- ขาด `[` หลัง `let promoItems = [];`
- ทำให้โค้ด JavaScript error

## 🔧 วิธีแก้ไข:

### ขั้นตอนที่ 1: แก้ไขโค้ดใน admin.html

หาบรรทัดนี้ (ประมาณบรรทัด 662):
```javascript
let promoItems = [];
  {id:101,name:"โปรไก่ชิ้น", options:[
```

แก้เป็น:
```javascript
let promoItems = [
  {id:101,name:"โปรไก่ชิ้น", options:[
```

(เพิ่ม `[` หลัง `=`)

### ขั้นตอนที่ 2: เพิ่มฟังก์ชันจัดการโปรโมชั่น

เพิ่มโค้ดนี้หลังจาก `loadPromoData()`:

```javascript
function loadPromoData() {
  const savedPromos = localStorage.getItem("promoData");
  if (savedPromos) {
    promoItems = JSON.parse(savedPromos);
  } else {
    // ใช้โปรโมชั่นเริ่มต้นที่มีอยู่แล้ว
    savePromos();
  }
}

function savePromos() {
  localStorage.setItem("promoData", JSON.stringify(promoItems));
  localStorage.setItem("promoDataTimestamp", Date.now().toString());
}

function renderPromoTable() {
  const promoTable = document.getElementById('promoTable');
  if (!promoTable) return;
  
  promoTable.innerHTML = "";
  promoItems.forEach((promo, index) => {
    const optionsText = promo.options.map(opt => opt.label).join('<br>');
    promoTable.innerHTML += `
      <tr>
        <td class="border p-2">${promo.name}</td>
        <td class="border p-2 text-sm">${optionsText}</td>
        <td class="border p-2">
          <button onclick="deletePromo(${index})" class="bg-red-500 text-white px-3 py-1 rounded">ลบ</button>
        </td>
      </tr>
    `;
  });
}

function deletePromo(index) {
  if (confirm('ต้องการลบโปรโมชั่นนี้?')) {
    promoItems.splice(index, 1);
    savePromos();
    renderPromoTable();
    renderPromos();
  }
}

// เรียกใช้เมื่อเริ่มต้น
loadPromoData();
```

### ขั้นตอนที่ 3: เพิ่มฟอร์มเพิ่มโปรโมชั่น

```javascript
document.getElementById('addPromoForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('promoName').value.trim();
  const optionsText = document.getElementById('promoOptions').value.trim();
  
  const options = [];
  const lines = optionsText.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('|').map(p => p.trim());
    if (parts.length >= 2) {
      options.push({
        label: parts[0] + ' = ' + parts[1] + ' บาท',
        price: parseFloat(parts[1]) || 0,
        qty: parseInt(parts[2]) || 1
      });
    }
  }
  
  promoItems.push({
    id: Date.now(),
    name: name,
    options: options
  });
  
  savePromos();
  renderPromoTable();
  renderPromos();
  this.reset();
  alert('✅ เพิ่มโปรโมชั่นสำเร็จ');
});
```

### ขั้นตอนที่ 4: แก้ไข staff.html

ใน staff.html หาส่วนโปรโมชั่นและเปลี่ยนเป็น:

```javascript
// โหลดโปรโมชั่นจาก localStorage
let promoItems = [];

function loadPromosFromStorage() {
  const savedPromos = localStorage.getItem("promoData");
  if (savedPromos) {
    promoItems = JSON.parse(savedPromos);
    renderPromos();
  }
}

// โหลดเมื่อเริ่มต้น
loadPromosFromStorage();

// ฟังการเปลี่ยนแปลงของ localStorage
window.addEventListener('storage', function(e) {
  if (e.key === 'promoData') {
    loadPromosFromStorage();
  }
});
```

## 📝 สรุป:

1. Admin สามารถจัดการโปรโมชั่นได้ในแท็บ "จัดการโปรโมชั่น"
2. กดปุ่ม "บันทึกโปรโมชั่น" เพื่อบันทึกลง localStorage
3. Staff จะดึงโปรโมชั่นจาก localStorage อัตโนมัติ
4. เมื่อ Admin อัปเดต Staff กดปุ่ม "อัปเดตเมนู" เพื่อดูโปรโมชั่นใหม่

## ⚠️ หมายเหตุ:

เนื่องจากโค้ดมีความซับซ้อนและยาวมาก แนะนำให้:
1. แก้ไขทีละส่วนเล็กๆ
2. ทดสอบหลังจากแก้ไขแต่ละส่วน
3. เปิด Console (F12) เพื่อดู error

หรือถ้าต้องการให้ฉันสร้างไฟล์ใหม่ทั้งหมด บอกได้เลย!
