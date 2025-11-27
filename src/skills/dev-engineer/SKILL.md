---
name: dev-engineer
description: >
  Adds logic, state management, TypeScript types, and CRUD operations to UI.
  Works AFTER ui-first-builder creates the interface. Implements Zustand stores,
  form handling with React Hook Form + Zod, and prepares for backend connection.
  Triggers: "เพิ่ม logic", "add functionality", "ทำให้ใช้งานได้", state management,
  form validation, data operations, TypeScript types.
---

# Dev Engineer

Add brains to the beauty. Connect logic to UI seamlessly.

<core_principle>
## The Enhancement Promise

UI exists (from ui-first-builder) → Add state/logic → UI becomes functional

We don't create UI. We make existing UI work.
</core_principle>

<default_to_action>
NEVER ask:
- "ใช้ state management อะไรดีคะ?" → Use Zustand (our standard)
- "validation library ไหนคะ?" → Use Zod (our standard)
- "form library ไหนคะ?" → Use React Hook Form (our standard)

ALWAYS do:
- Create TypeScript types FIRST
- Create Zustand store for state
- Add form validation with Zod
- Prepare CRUD operations (mock first, real later)
</default_to_action>

<typescript_patterns>
## Type Definitions

### Location
Always create: `src/types/index.ts` or `src/types/[feature].ts`

### Pattern
```typescript
// src/types/index.ts

// Entity types
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "editor"
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  images: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Form types (for create/update)
export type CreateProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">
export type UpdateProductInput = Partial<CreateProductInput>

// API response types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Common utility types
export type ID = string | number
export type Nullable<T> = T | null
```

### Naming Conventions
- Entity: `User`, `Product`, `Order` (singular, PascalCase)
- Input: `CreateUserInput`, `UpdateUserInput`
- Response: `UserResponse`, `PaginatedResponse<User>`
- Props: `UserCardProps`, `ProductListProps`
</typescript_patterns>

<zustand_patterns>
## State Management with Zustand

### Location
Create: `src/stores/[feature]-store.ts`

### Basic Store Pattern
```typescript
// src/stores/product-store.ts
import { create } from 'zustand'
import { Product, CreateProductInput } from '@/types'
import { mockProducts } from '@/lib/mock-data'

interface ProductState {
  // State
  products: Product[]
  selectedProduct: Product | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProducts: () => Promise<void>
  addProduct: (input: CreateProductInput) => Promise<void>
  updateProduct: (id: string, input: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  selectProduct: (product: Product | null) => void
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  // Actions
  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate delay
      set({ products: mockProducts, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch products', isLoading: false })
    }
  },

  addProduct: async (input) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with real API call
      const newProduct: Product = {
        ...input,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      set(state => ({ 
        products: [...state.products, newProduct],
        isLoading: false 
      }))
    } catch (error) {
      set({ error: 'Failed to add product', isLoading: false })
    }
  },

  updateProduct: async (id, input) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with real API call
      set(state => ({
        products: state.products.map(p => 
          p.id === id ? { ...p, ...input, updatedAt: new Date() } : p
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ error: 'Failed to update product', isLoading: false })
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null })
    try {
      // TODO: Replace with real API call
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        isLoading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete product', isLoading: false })
    }
  },

  selectProduct: (product) => set({ selectedProduct: product }),
}))
```

### Using Store in Components
```tsx
// In component
import { useProductStore } from '@/stores/product-store'

export function ProductList() {
  const { products, isLoading, fetchProducts } = useProductStore()
  
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])
  
  if (isLoading) return <LoadingSkeleton />
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```
</zustand_patterns>

<form_patterns>
## Forms with React Hook Form + Zod

### Schema Definition
```typescript
// src/lib/validations/product.ts
import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string()
    .min(2, 'ชื่อสินค้าต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(100, 'ชื่อสินค้าต้องไม่เกิน 100 ตัวอักษร'),
  description: z.string()
    .min(10, 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร')
    .optional(),
  price: z.number()
    .min(0, 'ราคาต้องไม่ติดลบ')
    .max(1000000, 'ราคาต้องไม่เกิน 1,000,000'),
  stock: z.number()
    .int('จำนวนต้องเป็นจำนวนเต็ม')
    .min(0, 'จำนวนต้องไม่ติดลบ'),
  category: z.string().min(1, 'กรุณาเลือกหมวดหมู่'),
  isActive: z.boolean().default(true),
})

export type CreateProductSchema = z.infer<typeof createProductSchema>

export const updateProductSchema = createProductSchema.partial()
```

### Form Component
```tsx
// src/components/features/product-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProductSchema, CreateProductSchema } from '@/lib/validations/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProductStore } from '@/stores/product-store'

interface ProductFormProps {
  onSuccess?: () => void
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const { addProduct, isLoading } = useProductStore()
  
  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      isActive: true,
    },
  })

  const onSubmit = async (data: CreateProductSchema) => {
    await addProduct(data)
    form.reset()
    onSuccess?.()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">ชื่อสินค้า</Label>
        <Input
          id="name"
          {...form.register('name')}
          placeholder="ใส่ชื่อสินค้า"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">ราคา (บาท)</Label>
        <Input
          id="price"
          type="number"
          {...form.register('price', { valueAsNumber: true })}
          placeholder="0"
        />
        {form.formState.errors.price && (
          <p className="text-sm text-red-500">
            {form.formState.errors.price.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">หมวดหมู่</Label>
        <Select onValueChange={(value) => form.setValue('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="เลือกหมวดหมู่" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="food">อาหาร</SelectItem>
            <SelectItem value="drink">เครื่องดื่ม</SelectItem>
            <SelectItem value="dessert">ของหวาน</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.category && (
          <p className="text-sm text-red-500">
            {form.formState.errors.category.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
      </Button>
    </form>
  )
}
```
</form_patterns>

<crud_operations>
## CRUD Operation Patterns

### Mock-First Approach
```typescript
// src/lib/api/products.ts

import { Product, CreateProductInput, PaginatedResponse } from '@/types'
import { mockProducts } from '@/lib/mock-data'

// Simulated delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// These functions work with mock data now
// Replace internals with real API calls later

export async function getProducts(page = 1, pageSize = 10): Promise<PaginatedResponse<Product>> {
  await delay(300)
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = mockProducts.slice(start, end)
  
  return {
    data,
    total: mockProducts.length,
    page,
    pageSize,
    totalPages: Math.ceil(mockProducts.length / pageSize),
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  await delay(200)
  return mockProducts.find(p => p.id === id) ?? null
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  await delay(400)
  
  const newProduct: Product = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  // In real app: POST to API
  // mockProducts.push(newProduct)
  
  return newProduct
}

export async function updateProduct(id: string, input: Partial<Product>): Promise<Product> {
  await delay(400)
  
  const product = mockProducts.find(p => p.id === id)
  if (!product) throw new Error('Product not found')
  
  const updated = { ...product, ...input, updatedAt: new Date() }
  
  // In real app: PUT/PATCH to API
  
  return updated
}

export async function deleteProduct(id: string): Promise<void> {
  await delay(300)
  
  // In real app: DELETE to API
  const index = mockProducts.findIndex(p => p.id === id)
  if (index === -1) throw new Error('Product not found')
  
  // mockProducts.splice(index, 1)
}
```

### Transition to Real API
```typescript
// When ready to connect to Supabase:

import { supabase } from '@/lib/supabase'

export async function getProducts(page = 1, pageSize = 10) {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  
  const { data, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  }
}
```
</crud_operations>

<hooks_patterns>
## Custom Hooks

### Data Fetching Hook
```typescript
// src/hooks/use-products.ts
import { useEffect } from 'react'
import { useProductStore } from '@/stores/product-store'

export function useProducts() {
  const { products, isLoading, error, fetchProducts } = useProductStore()
  
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  }, [products.length, fetchProducts])
  
  return { products, isLoading, error, refetch: fetchProducts }
}
```

### Debounced Search Hook
```typescript
// src/hooks/use-debounced-search.ts
import { useState, useEffect } from 'react'

export function useDebouncedSearch<T>(
  items: T[],
  searchKey: keyof T,
  delay = 300
) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState<T[]>(items)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)
    return () => clearTimeout(timer)
  }, [query, delay])

  useEffect(() => {
    if (!debouncedQuery) {
      setResults(items)
    } else {
      const filtered = items.filter(item =>
        String(item[searchKey])
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase())
      )
      setResults(filtered)
    }
  }, [debouncedQuery, items, searchKey])

  return { query, setQuery, results, isSearching: query !== debouncedQuery }
}
```
</hooks_patterns>

<output_checklist>
## Before Completing, Verify:

- [ ] TypeScript types defined for all entities
- [ ] Zustand store created with proper actions
- [ ] Zod schemas for form validation
- [ ] React Hook Form integrated with components
- [ ] CRUD operations work with mock data
- [ ] Loading and error states handled
- [ ] Custom hooks for common patterns
- [ ] Code follows naming conventions
- [ ] // TODO comments mark where to add real API
</output_checklist>
