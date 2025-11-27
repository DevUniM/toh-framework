---
command: /toh:mobile
aliases: ["/toh:m"]
description: >
  สร้าง mobile app ด้วย Expo (React Native)
  ใช้ NativeWind (Tailwind for RN) และ Zustand
trigger: /toh:mobile หรือ /toh:m
---

# /toh:mobile - Expo Mobile App

## Signature Command 📱

```
/toh:mobile [description]
/toh:m [description]
```

## What Happens

```
1. READ Skills
   └── ~/.claude/skills/platform-specialist/SKILL.md (Expo section)

2. CREATE Project
   ├── npx create-expo-app [name] --template tabs
   └── cd [name]

3. SETUP Stack
   ├── npx expo install nativewind
   ├── npm install zustand
   ├── npm install @supabase/supabase-js
   └── Configure babel + tailwind

4. GENERATE Screens
   ├── app/(tabs)/ - Tab screens
   ├── app/[feature]/ - Feature screens
   └── components/ - RN components

5. RUN
   └── npx expo start
```

## Example Prompts

```bash
# New mobile app
/toh:mobile expense tracker app

# Specific features
/toh:m app บันทึกรายจ่าย มี tabs: หน้าแรก, เพิ่มรายการ, รายงาน

# Convert from web concept
/toh:mobile แปลง concept จาก web app เป็น mobile
```

## Output Format

```markdown
## ✅ Mobile App พร้อมแล้วค่ะ!

### สร้าง:
- Expo project with tabs template
- NativeWind configured
- Zustand store ready

### Screens:
- `app/(tabs)/index.tsx` - หน้าแรก
- `app/(tabs)/add.tsx` - เพิ่มรายการ
- `app/(tabs)/reports.tsx` - รายงาน

### รัน:
```bash
cd [project-name]
npx expo start
```

### ทดสอบ:
- iOS: กด `i` (ต้องมี Xcode)
- Android: กด `a` (ต้องมี Android Studio)
- Expo Go: Scan QR code

### ถัดไป:
- `/toh:ui` เพิ่มหน้าจอ
- `/toh:connect` เชื่อม Supabase
```

## Mobile Stack

| Web (Next.js) | Mobile (Expo) |
|---------------|---------------|
| shadcn/ui Button | Custom Pressable |
| shadcn/ui Card | Custom View |
| shadcn/ui Input | TextInput |
| Tailwind | NativeWind |
| Next Router | Expo Router |

## Rules

1. **ALWAYS** use Expo Router for navigation
2. **ALWAYS** use NativeWind for styling
3. **ALWAYS** consider touch targets (min 44px)
4. **NEVER** use web-specific components
5. **NEVER** assume hover states work
