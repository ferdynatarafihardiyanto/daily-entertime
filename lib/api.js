/**
 * API Helper - Centralized HTTP client for backend communication
 * Base URL diambil dari environment variable NEXT_PUBLIC_API_URL
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

/**
 * Fetch wrapper dengan auth token & error handling
 */
async function apiFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include', // Kirim cookies (refreshToken)
    cache: 'no-store', // Mencegah caching agar jadwal yang baru ditambahkan langsung muncul
    ...options,
  }

  // Jangan override headers dari options
  if (options.headers) {
    config.headers = { ...config.headers, ...options.headers }
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  // Jika token expired (401), coba refresh
  if (response.status === 401 && token) {
    const refreshed = await refreshToken()
    if (refreshed) {
      // Retry request dengan token baru
      const newToken = localStorage.getItem('accessToken')
      config.headers.Authorization = `Bearer ${newToken}`
      const retryResponse = await fetch(`${API_URL}${endpoint}`, config)
      return handleResponse(retryResponse)
    } else {
      // Refresh gagal, logout
      logout()
      throw new Error('Sesi telah berakhir. Silakan login kembali.')
    }
  }

  return handleResponse(response)
}

async function handleResponse(response) {
  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.message || 'Terjadi kesalahan pada server')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

// ==================== AUTH API ====================

export async function loginAPI(email, password) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  // Simpan token ke localStorage
  if (data.data?.accessToken) {
    localStorage.setItem('accessToken', data.data.accessToken)
  }
  if (data.data?.user) {
    localStorage.setItem('currentUser', JSON.stringify(data.data.user))
  }

  return data
}

export async function registerAPI(username, email, password) {
  const data = await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
  return data
}

async function refreshToken() {
  try {
    const response = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) return false

    const data = await response.json()
    if (data.data?.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken)
      return true
    }
    return false
  } catch {
    return false
  }
}

export async function logoutAPI() {
  try {
    await apiFetch('/logout', { method: 'POST' })
  } catch {
    // Ignore logout errors
  }
  localStorage.removeItem('accessToken')
  localStorage.removeItem('currentUser')
}

export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('currentUser')
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

// ==================== CONTENT API ====================

export async function getContents() {
  return apiFetch('/contents')
}

export async function getContentById(id) {
  return apiFetch(`/contents/${id}`)
}

export async function createContent({ title, description, category_id, thumbnail, url }) {
  return apiFetch('/contents', {
    method: 'POST',
    body: JSON.stringify({ title, description, category_id, thumbnail, url }),
  })
}

export async function updateContentAPI(id, data) {
  return apiFetch(`/contents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteContentAPI(id) {
  return apiFetch(`/contents/${id}`, {
    method: 'DELETE',
  })
}

// ==================== BOOKMARK API ====================

export async function getBookmarks() {
  return apiFetch('/bookmarks')
}

export async function addBookmark(contentId) {
  return apiFetch('/bookmarks', {
    method: 'POST',
    body: JSON.stringify({ content_id: contentId }),
  })
}

export async function removeBookmark(contentId) {
  return apiFetch(`/bookmarks/${contentId}`, {
    method: 'DELETE',
  })
}

// ==================== HISTORY API ====================

export async function getHistories() {
  return apiFetch('/histories')
}

export async function trackHistory(contentId) {
  return apiFetch('/histories', {
    method: 'POST',
    body: JSON.stringify({ content_id: contentId }),
  })
}

export async function removeHistory(contentId) {
  return apiFetch(`/histories/${contentId}`, {
    method: 'DELETE',
  })
}

// ==================== SCHEDULE API ====================

export async function getSchedules() {
  return apiFetch('/schedules')
}

export async function createSchedule(data) {
  return apiFetch('/schedules', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteSchedule(id) {
  return apiFetch(`/schedules/${id}`, {
    method: 'DELETE',
  })
}

// ==================== USER API ====================

export async function getAllUsers() {
  return apiFetch('/users')
}

export async function createUserAPI(data) {
  return apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateUserAPI(id, data) {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// ==================== HELPER ====================

/**
 * Cek apakah user sudah login
 */
export function isLoggedIn() {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('accessToken')
}

/**
 * Ambil data user yang sedang login
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  try {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}
