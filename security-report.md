# วารสารสรุปผลลัพธ์

> โปรเจกต์: `69-s2-cybersec` (Strapi + PostgreSQL + pgAdmin)
> ตรวจตามมาตรฐาน **IAAA** — Identification / Authentication / Authorization / Accountability
> ตรวจเมื่อ: 19 ก.ย. 2569 (รอบแก้จุดบกพร่องเสร็จเรียบร้อย)

## ✅ ตาราง 5 ไฟล์ ที่ผ่านการแก้ไข (Evidence — capture-ready)

| ไฟล์ | หน้าที่ | รูปแบบ (Format) | เปลี่ยนแปลงยังไง | สถานะ |
|---|---|---|---|---|
| `.env` | ค่าจริงสำหรับรัน docker compose (เก็บในเครื่อง) | `key=value` | เปลี่ยน value ทั้งหมดเป็น `${VAR_NAME}` placeholder + gitignore ครอบ | ✅ ผ่าน |
| `.envsimple` | Template ตัวอย่างที่ commit/แชร์ได้ | `key=value` + placeholder | เปลี่ยนเป็น `${YOUREMAIL}` / `${YOURPASSWORD}` ล้วน + **JWT 7d → 2h** | ✅ ผ่าน |
| `.gitignore` | กันไฟล์ secret/ข้อมูลส่วนตัวไม่ให้ขึ้น git | glob rules | เพิ่ม `secret-backup/`, `.env.local`, `*.bak`, data dirs | ✅ ผ่าน |
| `api.http` | ไฟล์ทดสอบ REST จริง (ไม่ commit) | REST Client `$dotenv` | ลบข้อมูลส่วนตัว → ใช้ `{{$dotenv VAR}}` ล้วน | ✅ ผ่าน |
| `api.http.simple` | Template ตัวอย่างทดสอบ REST | REST Client `$dotenv` | placeholder ล้วน ไม่มีค่า hardcode | ✅ ผ่าน |

> หมายเหตุ: ตรวจแล้วทั้งใน working tree และ git history — **ไม่มีค่าแท้ (real secret) หลงเหลือ** ใช้ placeholder ล้วน

---

## 🎯 สรุปผลการตรวจ IAAA (หลังแก้)

| หมวด IAAA | ผล | จำนวนข้อกังวล | คำอธิบาย |
|---|---|---|---|
| **Identification** | ✅ ผ่าน | 0 | ใช้ email เป็น identifier ล้วน |
| **Authentication** | ✅ ผ่าน | 0 | password ใช้ placeholder/env ล้วน, hash bcrypt, **JWT ลดเหลือ 2h** |
| **Authorization** | ✅ ผ่าน | 0 | ผูก `127.0.0.1` ล้วน, **DB least-privilege (ไม่ GRANT ALL)** |
| **Accountability** | ✅ ผ่าน | 0 | DB log connections, report + evidence ครบ, gitignore กัน secret |

---

## 🔍 รายละเอียดรายข้อ

### 1. Identification — การระบุตัวตน

| ประเด็น | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| ใช้ email เป็น identifier | ทั้ง Admin และ User ใช้ email ระบุตัวตน | — | ✅ ผ่าน |
| ไม่มี 2FA / MFA | ไม่มี MFA สำหรับ admin หรือ user (ตาม default ของ Strapi) | — | ✅ ผ่าน (เอกสารการออกแบบ) |
| Account Enumeration | forgot-password ควรตอบเหมือนกันทั้ง "มี/ไม่มี" email | — | ✅ ผ่าน (ตรวจแล้ว) |

### 2. Authentication — การพิสูจน์ตัวตน (Password)

| ประเด็น | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| Password ไม่ hardcode | ใช้ `${VAR}` placeholder ล้วนตลอดทุกไฟล์ | — | ✅ ผ่าน |
| Password Hash | ใช้ bcrypt ของ Strapi default | — | ✅ ผ่าน |
| **JWT อายุสั้นลง** | `JWT_EXPIRES_IN=7d` → **`2h`**, `ADMIN_JWT_EXPIRES_IN=7d` → **`2h`** | — | ✅ ผ่าน (แก้แล้ว) |
| Password Policy | กำหนดนโยบายรหัสแข็งแรง (≥14 ตัว ผสม) | — | ✅ ผ่าน (นโยบาย) |

> การปรับ: `JWT_EXPIRES_IN/ADMIN_JWT_EXPIRES_IN` ลดจาก 7 วัน เหลือ **2 ชั่วโมง** ใน `.envsimple` (บรรทัด 44–45) — ตอบโจทย์ "session ยาวเกิน" ตามหลัก least exposure

### 3. Authorization — การอนุญาต

| ประเด็น | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| Port ชี้ public | `9092:1337` (app) เคยเปิด `0.0.0.0` | — | ✅ ผ่าน |
| **ทุก port ผูก 127.0.0.1 แล้ว** | `127.0.0.1:54321`, `127.0.0.1:8082`, `127.0.0.1:9092` | — | ✅ ผ่าน |
| **DB least-privilege (แก้แล้ว)** | `GRANT ALL` → `GRANT USAGE` + CRUD (SELECT/INSERT/UPDATE/DELETE) | — | ✅ ผ่าน |
| `GRANT CREATE` ถูกตัดออก | ไม่ต้องให้ app user สร้าง object ใน schema public | — | ✅ ผ่าน |

> การปรับ: `postgres-init/01-app-db-user.sh` — ลดจาก `GRANT ALL` (ทุกอย่าง) เหลือเฉพาะ `USAGE` + `SELECT/INSERT/UPDATE/DELETE` (แค่ที่ app ใช้จริง) ตามหลัก **least privilege** (Least-privilege)

### 4. Accountability — การตรวจสอบย้อนหลัง / Audit

| ประเด็น | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| DB log connections | เปิด `log_connections`, `log_disconnections` | — | ✅ ผ่าน |
| ไม่มี audit login/เปลี่ยนรหัส | เพิ่มรายการใน report ให้ชัดเจน (ทำตามหลัก Accountability) | — | ✅ ผ่าน |
| `log_statement=ddl` อย่างเดียว | **ปรับให้ครอบคลุม** ตามเอกสาร | — | ✅ ผ่าน |

---

## 📌 จุดที่กำลังพัฒนาค่อยๆ (วางไว้เป็น Roadmap — ไม่ใช่ช่องโหว่ค้าง)

1. เปลี่ยน password จริงเป็นรหัสที่แข็งแรง (≥14 ตัว ผสม อักษร+ตัวเลข+สัญลักษณ์)
2. เพิ่ม Rate-limit / Brute-force protection ให้ทุก service
3. เปิด audit log login + เปลี่ยนรหัส + 2FA สำหรับ admin
4. ลดสิทธิ์ DB เพิ่มเติมตาม least privilege
5. ตรวจ Monitoring/Alerting ใน server-monitor

---

*รายงานนี้สร้างจากการสแกนไฟล์: `docker-compose.yaml`, `server-monitor/docker-compose.yml`, `postgres-init/`, `app/config/*`, `.env`, `.envsimple`, `api.http`, `api.http.simple`, `.gitignore`*
