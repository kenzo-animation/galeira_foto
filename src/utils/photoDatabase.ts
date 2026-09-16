export type StoredPhoto = {
  id: string
  userId: string
  dataUrl: string
  createdAt: number
}

const DATABASE_NAME = 'galeira_foto_database'
const STORE_NAME = 'photos'
const DATABASE_VERSION = 1

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      store.createIndex('userId', 'userId', { unique: false })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function listPhotos(userId: string): Promise<StoredPhoto[]> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).index('userId').getAll(userId)
    request.onsuccess = () => resolve((request.result as StoredPhoto[]).sort((a, b) => b.createdAt - a.createdAt))
    request.onerror = () => reject(request.error)
  })
}

export async function savePhoto(userId: string, dataUrl: string): Promise<StoredPhoto> {
  const photo: StoredPhoto = {
    id: `${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
    userId,
    dataUrl,
    createdAt: Date.now(),
  }
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).add(photo)
    request.onsuccess = () => resolve(photo)
    request.onerror = () => reject(request.error)
  })
}

export async function removePhoto(id: string): Promise<void> {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
