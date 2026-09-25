# วารสารสรุปผลลัพธ์

> โปรเจกต์: `69-s2-cybersec` (Strapi + PostgreSQL + pgAdmin)
> ตรวจตามมาตรฐาน **IAAA** — Identification / Authentication / Authorization / Accountability
> ตรวจและแก้รอบล่าสุด: 25 ก.ย. 2569

## ✅ ตารางไฟล์ที่ผ่านการแก้ไข (Evidence — capture-ready)

| ไฟล์ | หน้าที่ | เปลี่ยนแปลงยังไง | สถานะ |
|---|---|---|---|
| `.env` | ค่าจริงสำหรับรัน docker compose (ไม่ commit, gitignore ครอบ) | **JWT 7d → 2h**, รหัสอ่อน (PGADMIN/ADMIN/USER) เปลี่ยนเป็น **รหัส 24 ตัว ผสมครบ 4 กลุ่ม** | ✅ ผ่าน |
| `app/config/admin.js` | config admin JWT | fallback `7d` → **`2h`** (ถ้า env หาย) | ✅ ผ่าน |
| `app/config/plugins.js` | config users-permissions JWT | fallback `7d` → **`2h`** (ถ้า env หาย) | ✅ ผ่าน |
| `.envsimple` | Template ตัวอย่าง commit/แชร์ได้ | JWT `2h`, เพิ่มคีย์ `ADMIN_NEW_PASSWORD` / `USER_NEW_PASSWORD` **+ `DATA_HASH_KEY` placeholder** | ✅ ผ่าน |
| `api.http.simple` | Template ทดสอบ REST | **แก้ syntax ตัวแปร** `@name: = ... ,` → `@name = {{$dotenv KEY}}` + นิยามครบ 13 ตัวแปร + **เพิ่ม section 3.1–3.3 Content CRUD** (students/teachers/subjects) + **หมายเหตุ `documentId` ของ v5** (REST path ใช้ `documentId` แทน id ตัวเลข) | ✅ ผ่าน |
| `api.http` | ไฟล์ทดสอบ REST จริง (ไม่ commit) | resync จาก template + **เติม CRUD ทั้ง 3 collection** (เดิมหลายข้อเป็น `???`) | ✅ ผ่าน |
| `docker-compose.yaml` | กำหนด port/service | ทุก service ผูก **`127.0.0.1`** (recreate จริงแล้ว), เพิ่ม `DATA_HASH_KEY` ใน env ของ app, **`image: 69-s2-strapi:v5`** (image จริงที่ build ใหม่จาก `./app`) | ✅ ผ่าน |
| `up_permissions` (live DB) | สิทธิ์ RBAC ของ users-permissions | ตั้งสิทธิ์ **Authenticated = CRUD ครบ** ทั้ง 3 collection, **Public = อ่าน** teacher/subject, `student` ปิดจาก Public (กันเลขบัตร ปชช.) | ✅ ผ่าน (verify จาก API จริง) |
| `app/package.json`, `app/Dockerfile`, `app/.dockerignore` | Project + image v5 | **อัปเกรด `@strapi/strapi` 4.16.2 → 5.37.0** (ปิด CVE-2026-27886), node:20-alpine, `npm run build`+start | ✅ ผ่าน (รันจริง 5.37.0) |
| `app/src/utils/fields.js` | filter ฟิลด์ก่อน save | `sanitizeInput(event, allowlist)` — ลบ key ที่ไม่อนุญาตทุก request (ก่อน create/update) | ✅ ผ่าน |
| `app/src/api/student/content-types/student/lifecycles.js` | ปกป้องข้อมูล ปชช. | **HMAC-SHA256** (คีย์ `DATA_HASH_KEY`) ของ `mobile` + `cardId` ครอบ **`beforeCreate` + `beforeUpdate`**, validate ว่าเป็นเลข 10/13 หลักก่อน hash (ผิด → 400) | ✅ ผ่าน (DB เก็บ 64-hex) |
| `app/src/api/teacher+subject/.../lifecycles.js` | ปกป้อง mass-assignment | allowlist เหลือแค่ `name` — ฟิลด์นอกอนุญาตถูกตัดทิ้ง | ✅ ผ่าน |
| `.env`, `docker-compose.yaml` | ค่าจริง/รันตัวแปร | เพิ่มคีย์ **`DATA_HASH_KEY`** (ขีดลับของ hash ข้อมูล) เข้า env + container | ✅ ผ่าน |
| `.gitignore` | กัน secret/data/node artifacts หลุด commit | ครอบ `.env`, `api.http`, `data-*`, `secret-backup/`, **เพิ่ม `node_modules/`, `app/build/`, `app/.tmp/`, `app/types/generated/`** | ✅ ผ่าน |
| — ลบออก | `.env.local.bak`, `secret-backup/` (duplicate ค่าจริง) | ลด secret sprawl เหลือ `.env` ไฟล์เดียว | ✅ ผ่าน |
| — image สำรอง | `69-s2-strapi:v4-backup` | เก็บ image v4 เดิมก่อน upgrade เผื่อ rollback | ✅ เก็บไว้ |

> ตรวจแล้วทั้ง working tree และ git history — **ไม่มี real secret ใน repo** ใช้ placeholder/`{{$dotenv}}` ล้วน

---

## 🎯 สรุปผลการตรวจ IAAA (หลังแก้รอบนี้)

| หมวด IAAA | ผล | ข้อที่แก้/เหลือ | คำอธิบาย |
|---|---|---|---|
| **Identification** | ✅ ผ่าน | email identifier ล้วน, ไม่มี 2FA (เอกสารการออกแบบ) | Account enumeration: forgot-password ตอบเหมือนกัน |
| **Authentication** | ✅ ผ่าน (เหลือ roadmap) | JWT **2h** ทั้งค่า env + fallback code, รหัสทั้งหมด 24 ตัวผสมครบ 4 กลุ่ม, hash bcrypt, **`/admin/login` มี default rate-limit (verify จริง = 429)** | **ระบบยังรับรหัสอ่อนได้** (Strapi ไม่ enforce complexity) + `/api/auth/local`, forgot/reset-password ยังไม่มี rate-limit ให้ตรวจต่อ |
| **Authorization** | ✅ ผ่าน | **ทุก service ผูก `127.0.0.1` แล้ว (verify จาก container จริง)**, DB least-privilege, **RBAC ตั้งสิทธิ์ครบ (Authenticated CRUD, Public อ่านเฉพาะ teacher/subject — student ปิด)**, **input allowlist ตัวจริง (`lifecycles`) + Strapi v5 บล็อก `__proto__` ที่ body-parse (400)**, **อัปเกรด Strapi 4.16.2 → 5.37.0 (CVE-2026-27886 patched)** | ไม่ GRANT ALL; `mobile`/`cardId` ถูก hash **HMAC-SHA256** ก่อนเก็บ (beforeCreate+Update) ครอบสิทธิ์ admin ที่เปิดดู raw เอง |
| **Accountability** | ⚠️ บางส่วน | DB log connections/disconnections เปิด; `log_statement=ddl` อย่างเดียว → **การ login/เปลี่ยนรหัสไม่ถูก log** | เปิด audit log login/reset เพิ่มใน roadmap |

---

## 🔍 รายละเอียดรายข้อ

### 1. Identification — การระบุตัวตน

| ประเด็น | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| ใช้ email เป็น identifier | Admin + User ใช้ email ล้วน | — | ✅ ผ่าน |
| ไม่มี 2FA / MFA | ตาม default Strapi สำหรับ admin และ user | — | ✅ ผ่าน (เอกสารการออกแบบ) |
| Account Enumeration | forgot-password ตอบเหมือนกันทั้งมี/ไม่มี email | — | ✅ ผ่าน (ตรวจแล้ว) |

### 2. Authentication — การพิสูจน์ตัวตน (Password)

| ประเด็น | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| Password ไม่ hardcode | `.env` ค่าจริง + gitignore ครอบ, template ใช้ placeholder ล้วน | — | ✅ ผ่าน |
| Password Hash | bcrypt (Strapi default) | — | ✅ ผ่าน |
| **JWT 2h (แก้แล้ว)** | `JWT_EXPIRES_IN` / `ADMIN_JWT_EXPIRES_IN` = **`2h`** ทั้งใน `.env` (ค่าจริง) และ fallback ในโค้ด | HIGH → ✅ | **ยืนยันจาก container จริง (`docker inspect` = `2h`)** + token exp−iat = 7200s |
| **รหัสแข็งแรง (แก้แล้ว)** | PGADMIN/ADMIN/USER = **24 ตัว ผสมครบ Upper/Lower/Digit/Symbol** (เดิม USER 13 ตัวมี "12345", ADMIN มีคำ dictionary, PGADMIN ฝังชื่อ) | HIGH → ✅ | หมุนรหัสจริงใน live DB ผ่าน Strapi reset-password flow แล้ว login ยืนยันได้ |
| **← ระบบไม่ enforce password policy** | Strapi (admin + users-permissions) ไม่มี config บังคับความซับซ้อน → ระบบ**ยอมรับ**รหัสอ่อนได้ถ้าสมัครใหม่ | — | ⚠️ นโยบายมีแค่ในเอกสาร/`.env` ยังไม่ถูกตั้งไว้ที่ service |
| ← Rate-limit (บางส่วน) | **`/admin/login` มี default rate-limit ของ Strapi แล้ว** (ทดสอบจริง: login ซ้ำ → `429 Too Many Requests`) แต่ `/api/auth/local` + forgot/reset-password ยังไม่ได้ตั้ง | — | ⚠️ เพิ่ม rate-limit ให้ content-api path (roadmap) |
| ← forgot-password ส่ง email ไม่ได้ | ตอบ 500 (ยังไม่มี email provider) แต่ token ถูกเก็บ → reset-password ทำงานได้ | LOW | ⚠️ ตั้ง SMTP/email provider ก่อนใช้งานจริง |

### 3. Authorization — การอนุญาต

> แบ่งเป็น 3 ชั้น: **3.1 Network (service) / 3.2 Application (API REST) / 3.3 Database (DB role)** ตรวจตามลำดับชั้นการอนุญาตจริงของระบบ

**3.1 Network / Service-level — จำกัดการเข้าถึงตัว service**

| หัวข้อ | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| 3.1.1 **ทุก service ผูก `127.0.0.1` (แก้แล้ว)** | `54321` (db), `8082` (pgAdmin), `9092` (app) — **verify จาก container ที่รันจริง** (เดิม app รันบน `0.0.0.0` หลุดจาก compose) | HIGH → ✅ | `docker compose up -d` + rebuild ทำให้ container ตรงกับ config |
| 3.1.2 **ไม่ bind `0.0.0.0` เปิดสู่ภายนอก** | `ports:` ทุกตัวขึ้นต้น `127.0.0.1:` ล้วน (localhost-only) → เครื่องอื่นในเครือข่ายเข้าถึง service เหล่านี้ไม่ได้ | HIGH → ✅ | ตรวจจาก `docker-compose.yaml` + `docker inspect` |
| 3.1.3 **network ใช้เฉพาะที่จำเป็น** | container สื่อสารกันผ่าน default network ของ compose เท่านั้น ไม่มีการเพิ่ม network ที่ต่อออกนอก host | — | ✅ ผ่าน |
| 3.1.4 **พอร์ต host ใช้ค่าที่ไกลตัว** | `54321`/`8082`/`9092` ไม่ใช่พอร์ตมาตรฐาน (`5432`/`80`/`1337`) → ลดการสแกนหาง่าย / ชนกับ service อื่นบน host | — | ✅ ผ่าน |
| 3.1.5 **pgAdmin volume reset** | ล้าง `data-pgadmin` เพื่อให้รหัส PGADMIN ใหม่มีผลจริง | — | ✅ ผ่าน (เสียแค่ server list เก่า) |

**3.2 Application / API-level — สิทธิ์ผ่าน REST (`/api/*`)**

| หัวข้อ | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| 3.2.1 **User JWT แยกจาก Admin JWT** | user ใช้ `JWT_SECRET` (`2h`), admin ใช้ `ADMIN_JWT_SECRET` (`2h`) — secret/env คนละตัว, token คนละประเภทใช้แทนกันไม่ได้ | HIGH → ✅ | `app/config/plugins.js` + `app/config/admin.js` |
| 3.2.2 **salt ของ token แยกกัน** | `API_TOKEN_SALT` / `TRANSFER_TOKEN_SALT` แยกจาก JWT secret — token แต่ละประเภท (api/transfer/user/admin) ไม่ใช้ secret ซ้ำ | — | ✅ ผ่าน |
| 3.2.3 **RBAC ตั้งสิทธิ์ครบ (แก้แล้ว)** | เข้า `up_permissions` ตั้งสิทธิ์: **Authenticated = CRUD ครบ** (students/teachers/subjects), **Public = อ่าน (`find`/`findOne`) เฉพาะ teacher/subject**, `student` ปิดจาก Public (กัน `mobile`/`cardId` หลุด) | HIGH → ✅ | ทดสอบ API จริง: POST ไร้ token = 403, Public อ่าน student = 403, Authenticated **create 201 / findOne+update 200 / delete 204** |
| 3.2.4 **JWT อายุสั้น (session จำกัด)** | `JWT_EXPIRES_IN` / `ADMIN_JWT_EXPIRES_IN` = `2h` ทั้งค่า env + fallback ในโค้ด → วัด token จริง exp−iat = 7200s | HIGH → ✅ | `docker inspect` + decode token จริง |
| 3.2.5 **ไม่มี token hardcode ในไฟล์ทดสอบ** | ไฟล์ REST ใช้ `{{$dotenv}}` ล้วน, ค่าจริงอยู่ใน `.env` (gitignore ครอบ) — ตรวจแล้วไม่พบ secret ใน repo | — | ✅ ผ่าน |
| 3.2.6 **env/config ไม่รั่วผ่าน API (ตรวจแล้ว)** | `GET /.env` / `/.envsimple` → **404** (ไม่ถูก serve), error response เป็นข้อความกลาง (`Invalid identifier or password`) ไม่ปน path/secret, `.env` ไม่อยู่ใน container (แอปรันจาก `/opt/app`) + gitignore ครอบ | — | ✅ ผ่าน |
| 3.2.7 **Prototype Pollution (ทดสอบแล้ว)** | **Strapi 4.16.2 เดิม**: ส่ง `__proto__`/`constructor` ใน body → ไม่เกิด pollution แต่ create ที่มี `__proto__` ใน `data` → **500** (input ไม่ถูกกรองก่อนเข้าตัวสร้าง entity) | HIGH → ✅ | **แก้ 2 ชั้น**: 1) อัปเกรดเป็น Strapi **5.37.0** — คัด `__proto__`/`constructor` ที่ **body-parse โดยตรง** ด้วย @hapi/bourne → ส่ง `__proto__` ใน create ได้ **400 SyntaxError** (test จริง) 2) `lifecycles.js` ใช้ `sanitizeInput` **allowlist** (student: name/mobile/cardId; teacher/subject: name) ลบ key นอกอนุญาตก่อน save — กัน mass-assignment ด้วย |
| 3.2.8 **Query-param sanitization (CVE-2026-27886)** | Strapi 4.16.2 อยู่ในช่วง affected (`>=4.0.0 <5.37.0`); ทดสอบ `filters[updatedBy][resetPasswordToken][$startsWith]=x` → **400** (validation บล็อก), `where[updatedBy][..]` → 200 แต่ **ไม่พบ boolean-oracle จริง** (total เท่ากันทุก prefix) | HIGH → ✅ | **อัปเกรดเป็น 5.37.0 (patched) แล้ว** — re-test หลัง upgrade: `filters[...]` → **400**, `where[...]` → 200 total เท่ากันทั้ง prefix `a`/`z` (ยังไม่มี oracle ในชุดข้อมูลนี้); ภาพแอปรัน `69-s2-app` = Strapi **5.37.0 (node v20.20.2)** |

**3.3 Database-level — บทบาท/สิทธิ์บนฐานข้อมูล (least privilege)**

| หัวข้อ | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| 3.3.1 **DB role แยก app/admin** | `POSTGRES_USER` (owner) ≠ `APP_DB_USER` (role ที่ app ใช้ ผ่าน `DATABASE_USERNAME`) — แอปไม่เล่นสิทธิ์ superuser/owner | — | ✅ ผ่าน |
| 3.3.2 **GRANT เฉพาะที่ใช้จริง (แก้แล้ว)** | `GRANT CONNECT` (database) + `USAGE` (schema) + CRUD (`SELECT/INSERT/UPDATE/DELETE`) เท่านั้น ไม่มี `GRANT ALL` | HIGH → ✅ | `postgres-init/01-app-db-user.sh` |
| 3.3.3 **ตัด `GRANT CREATE` / DDL (ผ่อนให้ชั่วคราวระหว่าง migration)** | เดิม app role สร้าง/แก้/ลบ object ไม่ได้; **ระหว่าง upgrade เป็น v5 ต้องผ่อนให้ `CREATE` บน database/schema + โอน ownership public tables/sequences ให้ `strapi_app`** (เพราะ v5 migration ใช้ `ALTER TABLE ... RENAME` ซึ่งต้องเป็น owner) → post-migration **แนะนำคืนสิทธิ์เป็น least-privilege เดิม** (roadmap) | — → ⚠️ | ตั้งใจผ่อนเพื่องาน migrate เท่านั้น; backup ก่อน upgrade เก็บที่ `data-postgres/backup_pre_v5_20260925.sql` |
| 3.3.4 **default privileges ครอบคลุม object ใหม่** | `ALTER DEFAULT PRIVILEGES` ให้ `SELECT/INSERT/UPDATE/DELETE` ตาราง + `USAGE/SELECT` บน sequence ให้ object ที่สร้างใหม่โดยอัตโนมัติ ไม่ต้อง GRANT ซ้ำทีละตัว | — | ✅ ผ่าน |
| 3.3.5 **รหัส DB ไม่ hardcode ในโค้ด** | ค่ามาจาก `${VAR}` ใน `.env` (gitignore ครอบ) ล้วน, template `.envsimple` ใช้ placeholder — ตรวจ git history แล้วไม่มี real secret | — | ✅ ผ่าน |
| 3.3.6 **ข้อมูลส่วนตัวใน DB (ตรวจแล้ว)** | เดิม: `mobile` hash **MD5** แค่ `beforeCreate`, `cardId` **plaintext**, `beforeUpdate` ไม่ครอบ → **ตอนนี้แก้แล้ว**: `mobile` + `cardId` ถูก hash **HMAC-SHA256 (64-hex)** ด้วยคีย์ลับ `DATA_HASH_KEY` ครอบ **`beforeCreate` + `beforeUpdate`**, เท่ากันเสมอ (deterministic → UNIQUE ยังบังคับได้ — สร้างซ้ำเลขเดิม → 400 duplicate), input ตรวจว่าเป็นเลข 10/13 หลักก่อน hash (ผิด → **400**, test จริง), admin ที่เปิด raw เองเห็นได้แค่ hash | HIGH → ✅ | **หมายเหตุ**: แถวเก่า 2 แถว (Final Verify จากยุคละ 4) ยังเก็บค่า v4 เดิมไว้ (MD5) — ไม่ถูก backfill ใหม่; `DATA_HASH_KEY` เป็นความลับใหม่ที่ต้องเก็บ/หมุนเวียนให้เหมือน secret อื่น |

### 4. Accountability — การตรวจสอบย้อนหลัง / Audit

| ประเด็น | สิ่งที่พบ | ระดับ | สถานะ |
|---|---|---|---|
| DB log connections | `log_connections=on`, `log_disconnections=on` | — | ✅ ผ่าน |
| **log_statement=ddl อย่างเดียว** | ไม่เห็นคำสั่ง SELECT/UPDATE เกี่ยวกับ login/เปลี่ยนรหัสใน log → ย้อนหลังเหตุการณ์ไม่ครบ | — | ⚠️ ขยายเป็น `log_statement=all` หรือใช้ audit extension (roadmap) |

---

## 📌 Roadmap (สิ่งที่ยังไม่ทำรอบนี้ — ไม่ใช่ช่องโหว่ที่ค้างโดยไม่รู้)

1. **บังคับ password policy ที่ service** (กำหนด complex rule ใน Strapi admin/users-permissions หรือ validate ก่อนสมัคร/เปลี่ยนรหัส)
2. **เพิ่ม Rate-limit ให้ `/api/auth/local` + forgot/reset-password** (`/admin/login` มี default ของ Strapi แล้ว — verify 429 ในการทดสอบจริง)
3. **ตั้ง email provider** ให้ forgot-password ทำงานจริง (ปัจจุบันตอบ 500 แต่ flow reset ยังใช้ได้)
4. **เปิด audit log เหตุการณ์ login + เปลี่ยนรหัส** (ขยาย `log_statement` หรือใช้ปลั๊กอิน extension admin audit)
5. 2FA สำหรับ admin (เอกสารการออกแบบ หากขยายความรับผิดชอบ)
6. TLS/HTTPS สำหรับการ deploy ออกนอก localhost
7. **คืน DB least-privilege หลัง migration ผ่าน** — `strapi_app` ยังคงได้รับ `CREATE` + ownership public tables/sequences (ผ่อนไว้ให้ v5 migration); ลดเหลือ GRANT เดิม (CONNECT/USAGE/CRUD) + `ALTER DEFAULT PRIVILEGES` ตามเดิม (พร้อม backup/rollback plan ถ้าฝั่งแอปสะดุด)
8. **พิจารณา hash ที่ช้ากว่า/ไม่ deterministic สำหรับข้อมูล ปชช. เพิ่ม** — HMAC-SHA256 ใช้ได้เพราะ UNIQUE+ค้นหา by-value ยังทำงาน (deterministic) แต่ถ้าอยากกัน brute-force สูงสุด ให้ลอง argon2/แยก salt ต่อ row (จะเสียความสามารถค้นหา/UNIQUE ดั้งเดิม — แลกกัน)
9. **จัดการ `DATA_HASH_KEY` ตามรอบ secret มาตรฐาน** — หมุนเวียนคีย์ + วางแผนว่าถ้าคีย์รั่ว ต้อง re-hash `mobile`/`cardId` ทั้งตาราง (test key-rotation ก่อน deploy จริง)
10. **ติดตาม advisory ของ Strapi 5 ต่อเนื่อง** — อัปเกรด 4.16.2 → **5.37.0 เรียบร้อย** (รันจริง + เก็บ image `69-s2-strapi:v4-backup`); ถ้าย้ายขึ้น major ถัดไป ควรอ่าน breaking-change + ตรวจแพ็กเกจ `i18n` (v5 รวมใน core แล้ว ตัว plugin แยกถูกถอดออก)

---

*รายงานนี้สร้างจากการสแกนไฟล์: `docker-compose.yaml`, `postgres-init/`, `app/config/*`, `app/package.json`, `app/src/utils/fields.js`, `app/src/api/*/content-types/*/{lifecycles.js,schema.json}`, `.env`, `.envsimple`, `api.http`, `api.http.simple`, `.gitignore` + ตรวจสอบสถานะ container จริง (`docker inspect`, login/CRUD ผ่าน API, query ตาราง `up_permissions`) เมื่อ 25 ก.ย. 2569 — แอปรัน Strapi **5.37.0** (node v20.20.2) บนพอร์ต `127.0.0.1:9092`*