คู่มือสั้น: ติดตั้ง Apps Script เพื่อรับออเดอร์จาก `staff.html` และบันทึกลงชีต `รายรับรายจ่าย`

1) เตรียม Google Sheet
- สร้างหรือเปิด Google Spreadsheet ที่ต้องการเก็บข้อมูล
- หากต้องการให้สคริปต์ผูกกับชีตนี้ (ง่ายสุด) ให้เปิดเมนู Extensions -> Apps Script ใน spreadsheet นั้น

2) วางโค้ด Apps Script
- สร้างไฟล์ใหม่ใน Apps Script และวางโค้ดจาก `apps_script.gs` (หรือคัดลอกไฟล์นี้ไปวาง)
- ถ้าสคริปต์ไม่ได้ผูกกับชีต (standalone) ให้ตั้งค่า SPREADSHEET_ID ในไฟล์เป็น ID ของ Google Sheet (ส่วนใน URL ระหว่าง /d/ และ /edit)

3) Deploy เป็น Web app
- ใน Apps Script: Deploy -> New deployment
- เลือกประเภท (Select type) = Web app
- ตั้งค่า:
  - Execute as: Me
  - Who has access: Anyone (หรือ Anyone, even anonymous) — เพื่อให้หน้าเว็บจากเครื่องอื่นเรียกได้
- คลิก Deploy แล้วคัดลอก Web app URL

4) ใส่ WEB_APP_URL ใน `staff.html`
- เปิดไฟล์ `staff.html` ที่มีตัวแปร:
  const WEB_APP_URL = "REPLACE_WITH_YOUR_WEB_APP_URL";
- แทนที่ด้วย URL ที่ได้จากขั้นตอน Deploy

5) ทดสอบ
- เปิด `staff.html` ในเบราว์เซอร์ (ดับเบิลคลิกไฟล์ หรือเปิดผ่าน local server)
- เปิด Developer Tools (F12) -> Network และ Console
- สร้างออเดอร์ แล้วกด "ยืนยันออเดอร์"
- ตรวจสอบ Network: ควรมี POST ไปยัง Web app URL, status 200
- ตรวจสอบ Google Sheets: ควรเพิ่มแถวในชีต `Orders` และ `รายรับรายจ่าย`

6) ถ้ามีปัญหา (แนวทาง debug)
- ถ้า browser แสดง CORS หรือ blocked: ตรวจสอบว่าคุณ deploy web app และตั้ง Who has access เป็น Anyone
- ดู Executions ใน Apps Script (View -> Executions) ว่ามี error หรือไม่
- ดู log ใน Apps Script: Logger.log จะเห็นข้อความใน Executions
- ดู response body ใน Network tab (จะคืน JSON {status:'success'} หรือ {status:'error', message:...})

7) ปรับแต่งเพิ่มเติม (ถ้าต้องการ)
- ถ้าต้องการแยกรายการ (itemized) เป็นหลายแถวใน `Orders` หรือ `รายรับรายจ่าย` ให้บอกผม ผมจะปรับโค้ดให้

ถ้าต้องการ ผมช่วย deploy/ทดสอบให้ได้ — ส่ง Web app URL หรือส่ง error log/console log มาแล้วผมจะวิเคราะห์ให้ครับ
