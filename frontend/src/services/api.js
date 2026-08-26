const API_URL = 'http://localhost:3000/api/v1'

export const apiFetch = async (endpoint, options = {}) => {

    const token =
        localStorage.getItem('trazo_token') ||
        sessionStorage.getItem('trazo_token')

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud.')
    }

    return data
}