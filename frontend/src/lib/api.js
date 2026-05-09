import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

export const createPaymentLink = (data) => api.post('/payments/create-link', data)
export const getPayment = (id) => api.get(`/payments/${id}`)
export const listPayments = (limit = 100) => api.get('/payments', { params: { limit } })
export const initiatePayment = (id) => api.post(`/payments/${id}/initiate`)

export default api
