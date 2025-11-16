import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'

export const productsCollectionSchema: CollectionCreateSchema = {
  name: 'products',
  fields: [
    { name: 'id', type: 'string', facet: false },
    { name: 'sku', type: 'string', facet: false },
    { name: 'title', type: 'string', facet: false },
    { name: 'slug', type: 'string', facet: false },
    { name: 'description', type: 'string', facet: false, optional: true },
    { name: 'brand_name', type: 'string', facet: true },
    { name: 'brand_slug', type: 'string', facet: false },
    { name: 'category_name', type: 'string', facet: true },
    { name: 'category_slug', type: 'string', facet: false },
    { name: 'condition_grade', type: 'string', facet: true },
    { name: 'cpu', type: 'string', facet: true, optional: true },
    { name: 'ram_gb', type: 'int32', facet: true, optional: true },
    { name: 'storage_gb', type: 'int32', facet: true, optional: true },
    { name: 'storage_type', type: 'string', facet: true, optional: true },
    { name: 'screen_size_inch', type: 'float', facet: true, optional: true },
    { name: 'price_cents', type: 'int32', facet: false },
    { name: 'stock', type: 'int32', facet: false },
    { name: 'is_featured', type: 'bool', facet: true },
    { name: 'is_outlet', type: 'bool', facet: true },
    { name: 'main_image', type: 'string', facet: false, optional: true },
    { name: 'created_at', type: 'int64', facet: false },
  ],
  default_sorting_field: 'created_at',
}

export async function ensureProductsCollection(adminClient: any) {
  try {
    // Try to retrieve the collection
    await adminClient.collections('products').retrieve()
  } catch (error: any) {
    if (error.httpStatus === 404) {
      // Collection doesn't exist, create it
      await adminClient.collections().create(productsCollectionSchema)
      console.log('Products collection created successfully')
    } else {
      throw error
    }
  }
}
