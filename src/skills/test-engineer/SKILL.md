# Test Engineer Skill

## Overview

Skill สำหรับการทดสอบระบบอัตโนมัติด้วย Playwright พร้อม auto-fix loop

## Core Philosophy

> **"Test จนผ่าน ไม่ใช่แค่ Test แล้วรายงาน"**

1. **Auto-Generate Tests** - สร้าง test cases จาก UI อัตโนมัติ
2. **Auto-Fix Loop** - ถ้า fail ก็แก้แล้ว test ใหม่จนผ่าน
3. **Human-Readable Reports** - รายงานที่อ่านเข้าใจง่าย
4. **Thai-First** - Error messages และ reports เป็นภาษาไทย

## Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright | E2E Testing |
| @playwright/test | Test Runner |
| playwright-report | HTML Reports |

## Setup

### 1. Install Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

### 2. Config File

สร้าง `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

### 3. Test Directory Structure

```
tests/
├── auth/
│   ├── login.spec.ts
│   └── register.spec.ts
├── dashboard/
│   └── dashboard.spec.ts
├── products/
│   ├── list.spec.ts
│   └── detail.spec.ts
├── checkout/
│   └── flow.spec.ts
└── fixtures/
    └── test-data.ts
```

## Test Generation Patterns

### Pattern 1: Page Render Test

ทุกหน้าต้องมี test ว่า render ได้ถูกต้อง:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Products Page', () => {
  test('should render correctly', async ({ page }) => {
    await page.goto('/products')
    
    // Check title
    await expect(page).toHaveTitle(/สินค้า/)
    
    // Check main heading
    await expect(
      page.getByRole('heading', { name: 'สินค้าทั้งหมด' })
    ).toBeVisible()
    
    // Check key elements exist
    await expect(page.getByTestId('product-grid')).toBeVisible()
    await expect(page.getByRole('searchbox')).toBeVisible()
  })
})
```

### Pattern 2: Form Validation Test

ทุก form ต้อง test validation:

```typescript
test.describe('Register Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click submit without filling
    await page.getByRole('button', { name: 'สมัครสมาชิก' }).click()
    
    // Check error messages
    await expect(page.getByText('กรุณากรอกชื่อ')).toBeVisible()
    await expect(page.getByText('กรุณากรอกอีเมล')).toBeVisible()
    await expect(page.getByText('กรุณากรอกรหัสผ่าน')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.getByLabel('อีเมล').fill('invalid-email')
    await page.getByRole('button', { name: 'สมัครสมาชิก' }).click()
    
    await expect(page.getByText('รูปแบบอีเมลไม่ถูกต้อง')).toBeVisible()
  })

  test('should validate password strength', async ({ page }) => {
    await page.getByLabel('รหัสผ่าน').fill('123')
    await page.getByRole('button', { name: 'สมัครสมาชิก' }).click()
    
    await expect(page.getByText('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')).toBeVisible()
  })
})
```

### Pattern 3: User Flow Test

Test complete user journey:

```typescript
test.describe('Checkout Flow', () => {
  test('should complete purchase successfully', async ({ page }) => {
    // Step 1: Browse products
    await page.goto('/products')
    await expect(page.getByTestId('product-card')).toHaveCount.greaterThan(0)
    
    // Step 2: Add to cart
    await page.getByTestId('product-card').first().click()
    await page.getByRole('button', { name: 'เพิ่มลงตะกร้า' }).click()
    await expect(page.getByTestId('cart-count')).toHaveText('1')
    
    // Step 3: Go to cart
    await page.getByTestId('cart-icon').click()
    await expect(page).toHaveURL('/cart')
    await expect(page.getByTestId('cart-item')).toHaveCount(1)
    
    // Step 4: Checkout
    await page.getByRole('button', { name: 'ชำระเงิน' }).click()
    await expect(page).toHaveURL('/checkout')
    
    // Step 5: Fill shipping info
    await page.getByLabel('ชื่อ-นามสกุล').fill('สมชาย ใจดี')
    await page.getByLabel('ที่อยู่').fill('123 ถ.สุขุมวิท')
    await page.getByLabel('เบอร์โทร').fill('0812345678')
    
    // Step 6: Confirm order
    await page.getByRole('button', { name: 'ยืนยันการสั่งซื้อ' }).click()
    
    // Step 7: Success
    await expect(page).toHaveURL(/\/order\//)
    await expect(page.getByText('สั่งซื้อสำเร็จ')).toBeVisible()
  })
})
```

### Pattern 4: Responsive Test

Test บน multiple viewports:

```typescript
test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
  ]

  for (const viewport of viewports) {
    test(`should display correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      })
      
      await page.goto('/products')
      
      // Check layout adapts
      if (viewport.name === 'mobile') {
        await expect(page.getByTestId('mobile-menu')).toBeVisible()
        await expect(page.getByTestId('desktop-nav')).not.toBeVisible()
      } else {
        await expect(page.getByTestId('desktop-nav')).toBeVisible()
      }
      
      // Screenshot for visual comparison
      await page.screenshot({ 
        path: `screenshots/products-${viewport.name}.png`,
        fullPage: true 
      })
    })
  }
})
```


## Auto-Fix Loop Strategy

### Loop Flow

```
┌─────────────────────────────────────────────────────┐
│  Run Tests                                          │
└─────────────────────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
      ┌──────────┐           ┌──────────┐
      │  PASS ✅ │           │  FAIL ❌ │
      └──────────┘           └──────────┘
            │                       │
            ▼                       ▼
      ┌──────────┐           ┌──────────────────┐
      │  Done!   │           │  Analyze Error   │
      └──────────┘           └──────────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │  Call /toh:fix   │
                            └──────────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │  Re-run Tests    │
                            │  (max 3 loops)   │
                            └──────────────────┘
                                    │
                                    ▼
                            ┌──────────────────┐
                            │  Still failing?  │
                            └──────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
              ┌──────────┐                   ┌──────────────┐
              │  PASS ✅ │                   │  Report to   │
              └──────────┘                   │  Human 🧑‍💻    │
                                             └──────────────┘
```

### Error Analysis Matrix

| Error Pattern | Root Cause | Auto-Fix Strategy |
|---------------|------------|-------------------|
| `strict mode violation` | Multiple elements match selector | เปลี่ยนเป็น specific selector |
| `Timeout waiting for selector` | Element ไม่ appear | เพิ่ม wait หรือ check condition |
| `expect.toBeVisible failed` | Element hidden/not rendered | ตรวจสอบ state/condition |
| `Navigation timeout` | Page load ช้า | เพิ่ม timeout หรือ optimize |
| `net::ERR_CONNECTION_REFUSED` | Server ไม่ start | ตรวจสอบ webServer config |
| `Element is not clickable` | Element ถูก overlay | Scroll into view หรือ wait |

### Fix Context Template

เมื่อเรียก `/toh:fix` ส่ง context นี้:

```markdown
## Test Failure Report

**File:** tests/login.spec.ts
**Test:** should login successfully
**Line:** 25

### Error Message
```
Error: locator.click: Error: strict mode violation: 
getByRole('button', { name: 'เข้าสู่ระบบ' }) resolved to 2 elements
```

### Code Context
```typescript
// Line 23-27
await page.getByLabel('รหัสผ่าน').fill('password123')
await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click() // ← Error here
await expect(page).toHaveURL('/dashboard')
```

### Screenshot
![failure](test-results/login-failure.png)

### Suggested Fixes
1. ใช้ `getByRole('button', { name: 'เข้าสู่ระบบ', exact: true })`
2. ใช้ `getByTestId('login-submit-button')`
3. ใช้ `.first()` หรือ `.nth(0)`
```

## Report Format

### Console Output (สั้น กระชับ)

```
🧪 Running tests...

  ✓ auth/login.spec.ts (3 tests) - 2.1s
  ✓ auth/register.spec.ts (4 tests) - 3.2s
  ✗ products/list.spec.ts (5 tests) - 4.5s
    └── ❌ should filter by category (attempt 1/3)
        🔧 Auto-fixing...
    └── ✓ Fixed! Re-running...
    └── ✓ should filter by category (passed)
  ✓ checkout/flow.spec.ts (2 tests) - 5.1s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All tests passed!
   Total: 14 | Passed: 14 | Fixed: 1
   Duration: 15.2s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Full Report (HTML)

สร้าง HTML report ที่:
- `playwright-report/index.html`

เปิดดูด้วย:
```bash
npx playwright show-report
```

## Best Practices

### 1. Use data-testid

เพิ่ม `data-testid` ให้ elements สำคัญ:

```tsx
// ✅ Good
<button data-testid="submit-order">สั่งซื้อ</button>

// ❌ Bad - อาจเปลี่ยน text ได้
<button>สั่งซื้อ</button>
```

### 2. Wait for Network Idle

สำหรับหน้าที่ load data:

```typescript
await page.goto('/products', { waitUntil: 'networkidle' })
```

### 3. Use Locator Assertions

```typescript
// ✅ Good - Auto-retry
await expect(page.getByText('สำเร็จ')).toBeVisible()

// ❌ Bad - No retry
const text = await page.textContent('.message')
expect(text).toBe('สำเร็จ')
```

### 4. Group Related Tests

```typescript
test.describe('Product Management', () => {
  test.describe('Create', () => {
    test('should create new product', ...)
    test('should validate required fields', ...)
  })
  
  test.describe('Edit', () => {
    test('should edit existing product', ...)
  })
  
  test.describe('Delete', () => {
    test('should delete product', ...)
    test('should confirm before delete', ...)
  })
})
```

### 5. Use Fixtures for Test Data

```typescript
// tests/fixtures/test-data.ts
export const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  name: 'ทดสอบ ระบบ',
}

export const testProduct = {
  name: 'กาแฟดริป',
  price: 120,
  category: 'เครื่องดื่ม',
}
```

## Integration Commands

```bash
# Run all tests
/toh:test

# Run specific file
/toh:test auth/login

# Run with UI mode (debug)
/toh:test --debug

# Update snapshots
/toh:test --update-snapshots

# Run on CI
/toh:test --ci
```

## MCP Integration

ใช้ Playwright MCP สำหรับ:
- Browser automation
- Screenshot capture
- Network interception
- Console log capture

```typescript
// Example: Using Playwright MCP
const browser = await playwright.chromium.launch()
const page = await browser.newPage()

// MCP handles the rest...
```
