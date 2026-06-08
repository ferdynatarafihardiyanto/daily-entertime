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

  // Jika body berupa FormData, hapus Content-Type agar browser mendeteksi boundary secara otomatis
  if (typeof window !== 'undefined' && options.body instanceof FormData) {
    delete config.headers['Content-Type'];
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
  const res = await apiFetch(`/contents?t=${new Date().getTime()}`)
  if (res && Array.isArray(res.data)) {
    const typeToCategory = { 1: 3, 2: 2, 3: 1 };
    res.data = res.data.map(item => ({
      ...item,
      category_id: typeToCategory[item.content_type_id] || item.category_id
    }));
  }
  return res;
}

export async function getContentById(id) {
  const res = await apiFetch(`/contents/${id}`)
  if (res && res.data) {
    const typeToCategory = { 1: 3, 2: 2, 3: 1 };
    res.data = {
      ...res.data,
      category_id: typeToCategory[res.data.content_type_id] || res.data.category_id
    };
  }
  return res;
}

export async function createContent(data) {
  const payload = { ...data };

  // Map category_id to contentTypeId if not provided
  // 1 (Berita) -> 3 (News)
  // 2 (Film)   -> 2 (Movie)
  // 3 (Musik)  -> 1 (Music)
  if (payload.category_id && !payload.contentTypeId) {
    const categoryToType = { 1: 3, 2: 2, 3: 1 };
    payload.contentTypeId = categoryToType[payload.category_id];
  }

  // Generate slug if not provided
  if (payload.title && !payload.slug) {
    payload.slug = payload.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }

  // Map url to specific detail fields for the backend
  if (payload.url) {
    if (payload.contentTypeId === 2) { // Movie
      payload.videoUrl = payload.url;
    } else if (payload.contentTypeId === 1) { // Music
      payload.audioUrl = payload.url;
    }
  }

  // Extract director / artist for details if they aren't directly passed
  if (payload.contentTypeId === 2) {
    if (!payload.director && payload.description) {
      if (payload.description.includes('Sutradara:')) {
        const parts = payload.description.split('\nSinopsis: ');
        payload.director = parts[0].replace('Sutradara: ', '').trim();
      }
    }
  } else if (payload.contentTypeId === 1) {
    if (!payload.artist && payload.description) {
      if (payload.description.includes('Artis:')) {
        const parts = payload.description.split('\n');
        payload.artist = parts[0].replace('Artis: ', '').trim();
      }
    }
  } else if (payload.contentTypeId === 3) {
    payload.author = 'Admin';
    payload.body = payload.description || '';
  }

  // Default status
  if (!payload.status) {
    payload.status = 'published';
  }

  return apiFetch('/contents', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateContentAPI(id, data) {
  const payload = { ...data };

  if (payload.category_id && !payload.contentTypeId) {
    const categoryToType = { 1: 3, 2: 2, 3: 1 };
    payload.contentTypeId = categoryToType[payload.category_id];
  }

  if (payload.title && !payload.slug) {
    payload.slug = payload.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }

  if (payload.url) {
    if (payload.contentTypeId === 2) {
      payload.videoUrl = payload.url;
    } else if (payload.contentTypeId === 1) {
      payload.audioUrl = payload.url;
    }
  }

  // Extract director / artist for update
  if (payload.contentTypeId === 2) {
    if (!payload.director && payload.description) {
      if (payload.description.includes('Sutradara:')) {
        const parts = payload.description.split('\nSinopsis: ');
        payload.director = parts[0].replace('Sutradara: ', '').trim();
      }
    }
  } else if (payload.contentTypeId === 1) {
    if (!payload.artist && payload.description) {
      if (payload.description.includes('Artis:')) {
        const parts = payload.description.split('\n');
        payload.artist = parts[0].replace('Artis: ', '').trim();
      }
    }
  } else if (payload.contentTypeId === 3) {
    payload.author = 'Admin';
    payload.body = payload.description || '';
  }

  return apiFetch(`/contents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteContentAPI(id) {
  return apiFetch(`/contents/${id}`, {
    method: 'DELETE',
  })
}

// ==================== BOOKMARK API ====================

export async function getBookmarks() {
  return apiFetch(`/bookmarks?t=${new Date().getTime()}`)
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
  return apiFetch(`/histories?t=${new Date().getTime()}`)
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
  return apiFetch(`/schedules?t=${new Date().getTime()}`)
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
  return apiFetch(`/users?t=${new Date().getTime()}`)
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

export async function deleteUserAPI(id) {
  return apiFetch(`/users/${id}`, {
    method: 'DELETE',
  })
}

export async function uploadImageAPI(file) {
  const formData = new FormData()
  formData.append('image', file)
  return apiFetch('/upload', {
    method: 'POST',
    body: formData,
  })
}

export async function uploadBase64API(base64String, filename) {
  if (!base64String || !base64String.startsWith('data:')) {
    return { success: true, imageUrl: base64String }
  }

  try {
    // Convert base64 data URL to File object
    const arr = base64String.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const file = new File([u8arr], filename, { type: mime })

    return await uploadImageAPI(file)
  } catch (error) {
    console.error('Failed to convert/upload base64 to file:', error)
    return { success: false, message: error.message }
  }
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
