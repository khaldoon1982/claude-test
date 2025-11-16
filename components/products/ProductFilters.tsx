'use client'

import { useState } from 'react'
import { Brand, Category, ConditionGrade } from '@/types/product'

interface ProductFiltersProps {
  brands: Brand[]
  categories: Category[]
  onFilterChange: (filters: FilterState) => void
}

export interface FilterState {
  brands: string[]
  categories: string[]
  conditionGrades: ConditionGrade[]
  minPrice?: number
  maxPrice?: number
  ramOptions: number[]
  storageOptions: number[]
}

const RAM_OPTIONS = [4, 8, 16, 32]
const STORAGE_OPTIONS = [128, 256, 512, 1024]
const CONDITION_GRADES: ConditionGrade[] = ['A', 'A-', 'B+', 'B', 'C']

export default function ProductFilters({
  brands,
  categories,
  onFilterChange,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    categories: [],
    conditionGrades: [],
    ramOptions: [],
    storageOptions: [],
  })

  const [isOpen, setIsOpen] = useState(false)

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange(updated)
  }

  const toggleArrayFilter = <T,>(
    key: keyof FilterState,
    value: T
  ) => {
    const currentArray = filters[key] as T[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]
    updateFilters({ [key]: newArray })
  }

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      brands: [],
      categories: [],
      conditionGrades: [],
      ramOptions: [],
      storageOptions: [],
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.categories.length > 0 ||
    filters.conditionGrades.length > 0 ||
    filters.ramOptions.length > 0 ||
    filters.storageOptions.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 lg:hidden"
      >
        <span className="font-semibold">Filters</span>
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filters Content */}
      <div className={`p-4 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mb-4 text-sm text-primary-600 hover:text-primary-700"
          >
            Wis alle filters
          </button>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 font-semibold">Merk</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand.id)}
                    onChange={() => toggleArrayFilter('brands', brand.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm">{brand.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 font-semibold">Categorie</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => toggleArrayFilter('categories', category.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Condition Grade */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold">Staat</h3>
          <div className="space-y-2">
            {CONDITION_GRADES.map((grade) => (
              <label key={grade} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.conditionGrades.includes(grade)}
                  onChange={() => toggleArrayFilter('conditionGrades', grade)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">Grade {grade}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RAM */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold">Geheugen (RAM)</h3>
          <div className="space-y-2">
            {RAM_OPTIONS.map((ram) => (
              <label key={ram} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.ramOptions.includes(ram)}
                  onChange={() => toggleArrayFilter('ramOptions', ram)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">{ram} GB</span>
              </label>
            ))}
          </div>
        </div>

        {/* Storage */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold">Opslag</h3>
          <div className="space-y-2">
            {STORAGE_OPTIONS.map((storage) => (
              <label key={storage} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.storageOptions.includes(storage)}
                  onChange={() => toggleArrayFilter('storageOptions', storage)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm">{storage} GB</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="mb-3 font-semibold">Prijs (€)</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-gray-600">Min</label>
              <input
                type="number"
                min="0"
                step="50"
                placeholder="€0"
                value={filters.minPrice ? filters.minPrice / 100 : ''}
                onChange={(e) =>
                  updateFilters({
                    minPrice: e.target.value
                      ? parseInt(e.target.value) * 100
                      : undefined,
                  })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-600">Max</label>
              <input
                type="number"
                min="0"
                step="50"
                placeholder="€2000"
                value={filters.maxPrice ? filters.maxPrice / 100 : ''}
                onChange={(e) =>
                  updateFilters({
                    maxPrice: e.target.value
                      ? parseInt(e.target.value) * 100
                      : undefined,
                  })
                }
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
