// Local Storage
const localStorageHelper = {
  setItem: (key, value) => {
    if (!key || value === undefined) return
    localStorage.setItem(key, JSON.stringify(value))
  },
  getItem: (key) => {
    if (!key) return null
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },
  removeItem: (key) => {
    if (!key) return
    localStorage.removeItem(key)
  },
  clear: () => {
    localStorage.clear()
  }
}

// Session Storage
const sessionStorageHelper = {
  setItem: (key, value) => {
    if (!key || value === undefined) return
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  getItem: (key) => {
    if (!key) return null
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  },
  removeItem: (key) => {
    if (!key) return
    sessionStorage.removeItem(key)
  },
  clear: () => {
    sessionStorage.clear()
  }
}

export { localStorageHelper, sessionStorageHelper }
