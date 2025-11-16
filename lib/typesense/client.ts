import Typesense from 'typesense'

let client: Typesense.Client | null = null

export function getTypesenseClient() {
  if (!client) {
    client = new Typesense.Client({
      nodes: [
        {
          host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
          port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || '8108'),
          protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http',
        },
      ],
      apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY || '',
      connectionTimeoutSeconds: 2,
    })
  }
  return client
}

export function getTypesenseAdminClient() {
  return new Typesense.Client({
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
        port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || '8108'),
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http',
      },
    ],
    apiKey: process.env.TYPESENSE_ADMIN_API_KEY || '',
    connectionTimeoutSeconds: 2,
  })
}
