# /toh: Templates

Starter templates สำหรับ `/toh:vibe` command

## Available Templates

| Template | Description | Status |
|----------|-------------|--------|
| **nextjs-pro** | Production-ready Next.js 14 + shadcn/ui + Zustand | ✅ Ready |

## Template: nextjs-pro

### Features

- ✅ Next.js 14 (App Router)
- ✅ TypeScript (strict mode)
- ✅ Tailwind CSS + shadcn/ui
- ✅ Zustand (state management)
- ✅ React Hook Form + Zod
- ✅ Supabase ready
- ✅ Thai mock data
- ✅ Professional design system

### Files Included

```
nextjs-pro/
├── README.md              # Template documentation
├── USAGE-GUIDE.md         # Step-by-step usage guide
├── package.json           # Dependencies
│
├── app/
│   ├── globals.css        # Design tokens & styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (Dashboard)
│
├── components/
│   ├── layout/
│   │   └── header.tsx     # Navigation header
│   └── features/
│       └── product-card.tsx  # Example component
│
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── supabase.ts        # Supabase client
│   ├── mock-data.ts       # Thai mock data
│   ├── api/
│   │   └── products.ts    # API functions
│   └── validations/
│       └── product.ts     # Zod schemas
│
├── types/
│   └── index.ts           # TypeScript types
│
├── stores/
│   └── product-store.ts   # Zustand store
│
└── providers/
    └── app-provider.tsx   # Context providers
```

### Usage

```bash
# Method 1: Copy template manually
cp -r ~/.claude/templates/nextjs-pro my-app
cd my-app
npm install
npm run dev

# Method 2: Use /toh:vibe (recommended)
# Claude Code will use this template automatically
/toh:vibe expense tracker app
```

## Future Templates

| Template | Description | Status |
|----------|-------------|--------|
| line-mini-app | LINE LIFF starter | 🔜 Planned |
| expo-app | Expo React Native starter | 🔜 Planned |
| tauri-app | Tauri desktop starter | 🔜 Planned |
| supabase-auth | Full auth boilerplate | 🔜 Planned |

---

## Contributing

To add a new template:

1. Create folder in `~/.claude/templates/[template-name]/`
2. Include:
   - `README.md` - Template documentation
   - `package.json` - Dependencies
   - Source files with Thai mock data
3. Update this README
