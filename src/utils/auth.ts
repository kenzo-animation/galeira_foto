export type AuthUser = {
  id: string
  name: string
  email: string
}

type StoredUser = AuthUser & {
  password: string
}

const USERS_KEY = 'galeira_foto_users'
const ACTIVE_USER_KEY = 'galeira_foto_active_user'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const items = window.localStorage.getItem(USERS_KEY)
    return items ? (JSON.parse(items) as StoredUser[]) : []
  } catch {
    return []
  }
}

export function saveStoredUsers(users: StoredUser[]) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
}

export function getActiveUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const item = window.localStorage.getItem(ACTIVE_USER_KEY)
    return item ? (JSON.parse(item) as AuthUser) : null
  } catch {
    return null
  }
}

export function setActiveUser(user: AuthUser | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (!user) {
    window.localStorage.removeItem(ACTIVE_USER_KEY)
    return
  }

  window.localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user))
}

export function registerUser(name: string, email: string, password: string): AuthUser | null {
  const trimmedName = name.trim()
  const normalizedEmail = normalizeEmail(email)

  if (!trimmedName || !normalizedEmail || !password.trim()) {
    return null
  }

  const users = getStoredUsers()

  if (users.some((user) => user.email === normalizedEmail)) {
    return null
  }

  const newUser: StoredUser = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
    name: trimmedName,
    email: normalizedEmail,
    password,
  }

  users.push(newUser)
  saveStoredUsers(users)

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  }
}

export function loginUser(email: string, password: string): AuthUser | null {
  const normalizedEmail = normalizeEmail(email)
  const user = getStoredUsers().find(
    (savedUser) => savedUser.email === normalizedEmail && savedUser.password === password,
  )

  if (!user) {
    return null
  }

  const activeUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  }

  setActiveUser(activeUser)
  return activeUser
}

export function logoutUser() {
  setActiveUser(null)
}

export function isAuthenticated() {
  return Boolean(getActiveUser())
}
