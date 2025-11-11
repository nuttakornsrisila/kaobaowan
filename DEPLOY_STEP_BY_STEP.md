# 🎯 คู่มือ Deploy Apps Script แบบละเอียด (มีภาพประกอบ)

## 📍 ทำที่ไหน?

**ทำใน Apps Script Editor** (หน้าต่างที่เปิดจาก Google Sheets)

---

## 🔍 ขั้นตอนที่ 1: เปิด Apps Script Editor

### 1.1 เปิด Google Sheets ของคุณ
```
https://docs.google.com/spreadsheets/d/184FGv623S8xLiMIRp3ksKJ1Qt-KmW8mrRXoF4pJ7y4c/edit
```

### 1.2 คลิกเมนู Extensions
- ดูที่แถบเมนูด้านบน
- คลิก **Extensions** (อยู่ระหว่าง Tools กับ Help)

### 1.3 คลิก Apps Script
- จะมี dropdown menu ขึ้นมา
- คลิก **Apps Script** (รายการแรก)

### 1.4 หน้าต่างใหม่จะเปิดขึ้น
- นี่คือ **Apps Script Editor**
- URL จะเป็น: `https://script.google.com/...`
- จะเห็นไฟล์ `Code.gs` อยู่ทางซ้าย

---

## 📝 ขั้นตอนที่ 2: วางโค้ด

### 2.1 ลบโค้ดเดิม
- คลิกในพื้นที่โค้ด (ตรงกลาง)
- กด `Ctrl+A` (เลือกทั้งหมด)
- กด `Delete` (ลบ)

### 2.2 คัดลอกโค้ดใหม่
- เปิดไฟล์ `apps_script.gs` ในโปรเจกต์
- กด `Ctrl+A` (เลือกทั้งหมด)
- กด `Ctrl+C` (คัดลอก)

### 2.3 วางโค้ด
- กลับมาที่ Apps Script Editor
- คลิกในพื้นที่โค้ด
- กด `Ctrl+V` (วาง)

### 2.4 บันทึก
- กด `Ctrl+S` หรือ
- คลิกไอคอน 💾 (Save) ด้านบน

---

## 🚀 ขั้นตอนที่ 3: Deploy เป็น Web App

### 3.1 หาปุ่ม Deploy
```
ดูที่มุมบนขวาของ Apps Script Editor
จะเห็นปุ่ม "Deploy" สีน้ำเงิน
```

### 3.2 คลิก Deploy
- คลิกปุ่ม **Deploy** (มุมบนขวา)
- จะมี dropdown menu ขึ้นมา 2 ตัวเลือก:
  - Test deployments
  - **New deployment** ← เลือกตัวนี้

### 3.3 คลิก New deployment
- คลิก **New deployment**
- จะมีหน้าต่าง popup ขึ้นมา

---

## ⚙️ ขั้นตอนที่ 4: ตั้งค่า Deployment

### 4.1 เลือก Type
ใน popup ที่เปิดขึ้นมา:

```
┌─────────────────────────────────────┐
│ New deployment                      │
├─────────────────────────────────────┤
│                                     │
│ Select type                         │
│ ┌─────────────────────────────┐   │
│ │ ⚙️ (ไอคอนเฟือง)              │ ← คลิกตรงนี้
│ └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**คลิกที่ไอคอนเฟือง ⚙️** ข้างๆ "Select type"

### 4.2 เลือก Web app
หลังจากคลิกเฟือง จะมีตัวเลือกขึ้นมา:

```
┌─────────────────────────────────────┐
│ Select type                         │
├─────────────────────────────────────┤
│ ○ Add-on                           │
│ ○ API Executable                   │
│ ● Web app          ← เลือกตัวนี้   │
│ ○ Library                          │
└─────────────────────────────────────┘
```

**คลิก Web app** (วงกลมจะเป็นสีน้ำเงิน)

### 4.3 ตั้งค่า Web app
หลังจากเลือก Web app แล้ว จะมีฟอร์มให้กรอก:

```
┌─────────────────────────────────────────────┐
│ New deployment                              │
├─────────────────────────────────────────────┤
│                                             │
│ Description (optional)                      │
│ ┌─────────────────────────────────────┐   │
│ │ Restaurant Online Status System     │   │ ← พิมพ์ชื่อ (ไม่บังคับ)
│ └─────────────────────────────────────┘   │
│                                             │
│ Web app                                     │
│                                             │
│ Execute as                                  │
│ ┌─────────────────────────────────────┐   │
│ │ Me (your-email@gmail.com)           │   │ ← เลือก Me
│ └─────────────────────────────────────┘   │
│                                             │
│ Who has access                              │
│ ┌─────────────────────────────────────┐   │
│ │ Anyone                              │   │ ← เลือก Anyone
│ └─────────────────────────────────────┘   │
│                                             │
│         [Cancel]        [Deploy]            │ ← คลิก Deploy
└─────────────────────────────────────────────┘
```

**ตั้งค่าดังนี้:**
- **Description**: `Restaurant Online Status System` (หรือชื่ออะไรก็ได้)
- **Execute as**: `Me (your-email@gmail.com)` ← **สำคัญ!**
- **Who has access**: `Anyone` ← **สำคัญ!**

### 4.4 คลิก Deploy
- คลิกปุ่ม **Deploy** (สีน้ำเงิน ด้านล่างขวา)

---

## 🔐 ขั้นตอนที่ 5: Authorize Access (ครั้งแรกเท่านั้น)

### 5.1 Popup ขออนุญาต
หลังจากคลิก Deploy จะมี popup ขึ้นมา:

```
┌─────────────────────────────────────────────┐
│ Authorization required                      │
├─────────────────────────────────────────────┤
│                                             │
│ This project requires your permission      │
│ to access your data.                       │
│                                             │
│         [Cancel]    [Authorize access]      │ ← คลิกตรงนี้
└─────────────────────────────────────────────┘
```

**คลิก Authorize access**

### 5.2 เลือกบัญชี Google
จะมีหน้าต่างให้เลือกบัญชี:

```
┌─────────────────────────────────────────────┐
│ Choose an account                           │
├─────────────────────────────────────────────┤
│                                             │
│ ○ your-email@gmail.com                     │ ← คลิกบัญชีของคุณ
│                                             │
└─────────────────────────────────────────────┘
```

**คลิกบัญชี Google ของคุณ**

### 5.3 คำเตือนความปลอดภัย
จะมีหน้าจอคำเตือน:

```
┌─────────────────────────────────────────────┐
│ Google hasn't verified this app            │
├─────────────────────────────────────────────┤
│                                             │
│ This app hasn't been verified by Google    │
│ yet. Only proceed if you know and trust    │
│ the developer.                              │
│                                             │
│ [Back to safety]    [Advanced]              │ ← คลิก Advanced
└─────────────────────────────────────────────┘
```

**คลิก Advanced** (ด้านล่างซ้าย)

### 5.4 ไปต่อ
หลังจากคลิก Advanced จะมีลิงก์เพิ่มขึ้นมา:

```
┌─────────────────────────────────────────────┐
│ Google hasn't verified this app            │
├─────────────────────────────────────────────┤
│                                             │
│ This app hasn't been verified by Google    │
│                                             │
│ Go to [Project Name] (unsafe)               │ ← คลิกตรงนี้
│                                             │
└─────────────────────────────────────────────┘
```

**คลิก "Go to [Project Name] (unsafe)"**

### 5.5 อนุญาต
จะมีหน้าจอขออนุญาต:

```
┌─────────────────────────────────────────────┐
│ [Project Name] wants to access your        │
│ Google Account                              │
├─────────────────────────────────────────────┤
│                                             │
│ This will allow [Project Name] to:         │
│                                             │
│ ✓ See, edit, create, and delete your      │
│   spreadsheets in Google Drive             │
│                                             │
│         [Cancel]        [Allow]             │ ← คลิก Allow
└─────────────────────────────────────────────┘
```

**คลิก Allow** (สีน้ำเงิน)

---

## ✅ ขั้นตอนที่ 6: คัดลอก Web App URL

### 6.1 Deployment สำเร็จ
หลังจากอนุญาตแล้ว จะกลับมาที่หน้า Deployment:

```
┌─────────────────────────────────────────────┐
│ Deployment                                  │
├─────────────────────────────────────────────┤
│                                             │
│ ✓ Deployment created successfully          │
│                                             │
│ Web app                                     │
│ ┌─────────────────────────────────────┐   │
│ │ https://script.google.com/macros/   │   │
│ │ s/XXXXXXXXXXXXX/exec                │   │ ← คัดลอก URL นี้
│ │                                     📋  │
│ └─────────────────────────────────────┘   │
│                                             │
│                    [Done]                   │
└─────────────────────────────────────────────┘
```

### 6.2 คัดลอก URL
- คลิกไอคอน 📋 (Copy) ข้างๆ URL
- หรือเลือก URL แล้วกด `Ctrl+C`

### 6.3 URL ที่ได้
URL จะมีรูปแบบประมาณนี้:
```
https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
```

**เก็บ URL นี้ไว้!** จะต้องใช้ในขั้นตอนถัดไป

---

## 📝 ขั้นตอนที่ 7: ใส่ URL ในโค้ด

### 7.1 แก้ไข admin.html
เปิดไฟล์ `admin.html` และหาบรรทัดนี้ (ประมาณบรรทัด 330):

```javascript
const WEB_APP_URL = "REPLACE_WITH_YOUR_WEB_APP_URL";
```

แก้เป็น:

```javascript
const WEB_APP_URL = "https://script.google.com/macros/s/XXXXXXXXXXXXX/exec";
```

(แทนที่ด้วย URL ที่คุณคัดลอกไว้)

### 7.2 แก้ไข staff.html
เปิดไฟล์ `staff.html` และหาบรรทัดที่มี `WEB_APP_URL`

แก้เป็น URL เดียวกับใน admin.html

---

## 🧪 ขั้นตอนที่ 8: ทดสอบ

### 8.1 ทดสอบ Web App
เปิด URL ที่คัดลอกไว้ในเบราว์เซอร์:
```
https://script.google.com/macros/s/XXXXXXXXXXXXX/exec
```

ควรเห็น:
```json
{"status":"ok","message":"Apps Script Web App is running"}
```

✅ ถ้าเห็นข้อความนี้ = Deploy สำเร็จ!

### 8.2 ทดสอบระบบ
1. เปิด `admin.html` ใน Chrome
2. Login เป็น admin
3. เปิด `staff.html` ใน Firefox
4. Login เป็น staff1
5. กลับไปที่ Chrome → คลิก "Debug Status"
6. รอ 10-15 วินาที
7. ควรเห็น staff1 เป็น Online ใน Google Sheets section

---

## 🎯 สรุปสั้นๆ

1. **เปิด Google Sheets** → Extensions → Apps Script
2. **วางโค้ด** จาก `apps_script.gs`
3. **บันทึก** (Ctrl+S)
4. **Deploy** (มุมบนขวา) → New deployment
5. **คลิกเฟือง ⚙️** → เลือก Web app
6. **ตั้งค่า**: Execute as = Me, Who has access = Anyone
7. **Deploy** → Authorize access → Allow
8. **คัดลอก URL** ที่ได้
9. **แก้ไข** `admin.html` และ `staff.html` ใส่ URL
10. **ทดสอบ**!

---

## ❓ คำถามที่พบบ่อย

### Q: ไม่เห็นปุ่ม Deploy
**A:** ดูที่มุมบนขวาของ Apps Script Editor ถ้ายังไม่เห็น ลองรีเฟรชหน้า (F5)

### Q: คลิก Deploy แล้วไม่มี New deployment
**A:** ตรวจสอบว่าบันทึกโค้ดแล้ว (Ctrl+S) และไม่มี error ในโค้ด

### Q: ไม่เห็นไอคอนเฟือง ⚙️
**A:** หลังจากคลิก New deployment แล้ว ดูที่บรรทัด "Select type" จะมีไอคอนเฟืองอยู่ด้านขวา

### Q: ไม่มีตัวเลือก "Anyone" ใน Who has access
**A:** อาจมีเฉพาะ "Anyone with the link" ก็ใช้ได้เหมือนกัน

### Q: Authorize แล้วยังไม่ได้
**A:** ลอง Deploy ใหม่อีกครั้ง หรือลอง Revoke access แล้ว Authorize ใหม่

---

## 📞 ต้องการความช่วยเหลือ?

ถ้ายังติดปัญหา:
1. เปิด Console (F12) ดู error
2. ตรวจสอบว่า URL ถูกต้อง
3. ลอง Deploy ใหม่
4. ดูไฟล์ `CROSS_BROWSER_ONLINE_STATUS.md` สำหรับข้อมูลเพิ่มเติม
