# /toh: Sub-Agents

Expert agents that power the `/toh:` command suite. Each agent is **self-sufficient**, **self-correcting**, and **expert-level**.

## Agent Overview

| Agent | Lines | Expertise | Triggered By |
|-------|-------|-----------|--------------|
| **ui-builder** | 278 | UI/Components/Mock Data | `/toh:vibe`, `/toh:ui` |
| **dev-builder** | 396 | Logic/State/TypeScript/Forms | `/toh:dev` |
| **design-reviewer** | 364 | Design Polish/Anti-patterns | `/toh:design` |
| **backend-connector** | 408 | Supabase/Auth/RLS | `/toh:connect` |
| **platform-adapter** | 500 | LINE/Expo/Tauri | `/toh:line`, `/toh:mobile` |

---

## Agent Philosophy

ทุก agent ออกแบบตามหลัก:

### 1. Self-Sufficient (พึ่งตนเองได้)
```
ไม่ต้องพึ่ง agent อื่น
ไม่ต้องรอ input เพิ่ม
ไม่ต้องถามคำถามที่ไม่จำเป็น
```

### 2. Self-Correcting (แก้ไขตัวเองได้)
```
ตรวจสอบงานตัวเองก่อนส่งมอบ
พบปัญหา → แก้ไขทันที
ไม่รอให้ user บอก
```

### 3. Expert-Level (ระดับผู้เชี่ยวชาญ)
```
ตัดสินใจถูกต้อง
ใช้ best practices
ไม่มี amateur mistakes
```

---

## Claude 4.x Techniques Used

ทุก agent ใช้เทคนิคจาก `prompt-optimizer`:

```xml
<!-- ลงมือทำทันที ไม่ถามก่อน -->
<default_to_action>
By default, implement immediately rather than asking questions.
</default_to_action>

<!-- อ่านหลายไฟล์พร้อมกัน -->
<use_parallel_tool_calls>
Read multiple files in parallel for efficiency.
</use_parallel_tool_calls>

<!-- ตรวจสอบก่อนตอบ -->
<investigate_before_answering>
Never speculate - read actual code before making changes.
</investigate_before_answering>
```

---

## Workflow Diagram

```
USER: /toh:vibe expense tracker
           │
           ▼
┌──────────────────────┐
│   vibe-orchestrator  │  (Skill ที่ route งาน)
│   (Master Brain)     │
└──────────────────────┘
           │
           ├──────────────────┬──────────────────┐
           ▼                  ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   ui-builder     │  │   dev-builder    │  │  design-reviewer │
│   (สร้าง UI)      │  │   (เพิ่ม Logic)  │  │   (Polish)       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
           │                  │                  │
           └──────────────────┴──────────────────┘
                              │
                              ▼
                    ✅ Working App at localhost:3000
```

---

## Agent Details

### 🎨 ui-builder
สร้าง UI ทันทีจาก description ไม่ต้องรอ backend

**Specialties:**
- Next.js 14 pages
- shadcn/ui components
- Thai mock data
- Responsive design
- Loading/Empty states

**Self-Check:**
- TypeScript clean
- Mobile-first responsive
- No "Lorem ipsum"

---

### ⚙️ dev-builder
เพิ่ม logic ให้ UI ทำงานได้จริง

**Specialties:**
- TypeScript types
- Zustand stores
- React Hook Form + Zod
- Mock CRUD operations
- Custom hooks

**Self-Check:**
- No `any` type
- Full CRUD working
- Thai error messages

---

### ✨ design-reviewer
ตรวจสอบและปรับ design ให้ไม่ดูเหมือน "AI generated"

**Specialties:**
- AI red flags detection
- Color harmony
- Typography hierarchy
- Spacing consistency
- Subtle animations

**Self-Check:**
- No AI tells
- Professional look
- Consistent design language

---

### 🔌 backend-connector
เชื่อม app กับ Supabase อย่างปลอดภัย

**Specialties:**
- Schema generation from types
- RLS policies
- Auth integration
- Real-time subscriptions
- Migration patterns

**Self-Check:**
- RLS enabled all tables
- No hardcoded credentials
- Proper error handling

---

### 📱 platform-adapter
Adapt web app สำหรับ LINE, Mobile, Desktop

**Specialties:**
- LINE LIFF integration
- Expo React Native porting
- Tauri desktop packaging
- Platform-specific UI
- Native feature access

**Self-Check:**
- Platform features work
- Feels native
- Core features intact

---

## Usage

Agents ถูกเรียกใช้ผ่าน `/toh:` commands หรือ โดย vibe-orchestrator skill

```bash
# Direct command → triggers specific agent
/toh:ui → ui-builder
/toh:dev → dev-builder
/toh:design → design-reviewer
/toh:connect → backend-connector
/toh:line → platform-adapter (LINE mode)
/toh:mobile → platform-adapter (Expo mode)

# Compound command → orchestrates multiple agents
/toh:vibe → ui-builder + dev-builder + design-reviewer
```

---

## Total Lines

| Agent | Lines |
|-------|-------|
| ui-builder | 278 |
| dev-builder | 396 |
| design-reviewer | 364 |
| backend-connector | 408 |
| platform-adapter | 500 |
| **Total** | **1,946** |

Combined with Skills (~2,720 lines) and Commands (~966 lines):
**Grand Total: ~5,632 lines** of expert-level documentation
