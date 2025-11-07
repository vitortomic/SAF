import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clients
export const clientsApi = {
  getAll: () => api.get('/clients'),
  getById: (id: number) => api.get(`/clients/${id}`),
  create: (data: any) => api.post('/clients', data),
  update: (id: number, data: any) => api.put(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
};

// Daily Tours
export const dailyToursApi = {
  getAll: () => api.get('/daily-tours'),
  getById: (id: number) => api.get(`/daily-tours/${id}`),
  create: (data: any) => api.post('/daily-tours', data),
  update: (id: number, data: any) => api.put(`/daily-tours/${id}`, data),
  delete: (id: number) => api.delete(`/daily-tours/${id}`),
};

// Multi-day Tours
export const multiDayToursApi = {
  getAll: () => api.get('/multi-day-tours'),
  getById: (id: number) => api.get(`/multi-day-tours/${id}`),
  create: (data: any) => api.post('/multi-day-tours', data),
  update: (id: number, data: any) => api.put(`/multi-day-tours/${id}`, data),
  delete: (id: number) => api.delete(`/multi-day-tours/${id}`),
};

// Renting Services
export const rentingServicesApi = {
  getAll: () => api.get('/renting-services'),
  getById: (id: number) => api.get(`/renting-services/${id}`),
  create: (data: any) => api.post('/renting-services', data),
  update: (id: number, data: any) => api.put(`/renting-services/${id}`, data),
  delete: (id: number) => api.delete(`/renting-services/${id}`),
};

// Custom Tours
export const customToursApi = {
  getAll: () => api.get('/custom-tours'),
  getById: (id: number) => api.get(`/custom-tours/${id}`),
  create: (data: any) => api.post('/custom-tours', data),
  update: (id: number, data: any) => api.put(`/custom-tours/${id}`, data),
  delete: (id: number) => api.delete(`/custom-tours/${id}`),
};

// Other Income
export const otherIncomeApi = {
  getAll: () => api.get('/other-income'),
  getById: (id: number) => api.get(`/other-income/${id}`),
  create: (data: any) => api.post('/other-income', data),
  update: (id: number, data: any) => api.put(`/other-income/${id}`, data),
  delete: (id: number) => api.delete(`/other-income/${id}`),
};

// Costs
export const costsApi = {
  getAll: () => api.get('/costs'),
  getById: (id: number) => api.get(`/costs/${id}`),
  create: (data: any) => api.post('/costs', data),
  update: (id: number, data: any) => api.put(`/costs/${id}`, data),
  delete: (id: number) => api.delete(`/costs/${id}`),
};

// Assets
export const assetsApi = {
  getAll: () => api.get('/assets'),
  getById: (id: number) => api.get(`/assets/${id}`),
  create: (data: any) => api.post('/assets', data),
  update: (id: number, data: any) => api.put(`/assets/${id}`, data),
  delete: (id: number) => api.delete(`/assets/${id}`),
};

// Invoices
export const invoicesApi = {
  getAll: () => api.get('/invoices'),
  getById: (id: number) => api.get(`/invoices/${id}`),
  create: (data: any) => api.post('/invoices', data),
  update: (id: number, data: any) => api.put(`/invoices/${id}`, data),
  delete: (id: number) => api.delete(`/invoices/${id}`),
};

// Categories
export const categoriesApi = {
  getAll: (type?: string) => api.get('/categories', { params: { type } }),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Reports
export const reportsApi = {
  getCashFlow: (startDate: string, endDate: string) =>
    api.get('/reports/cash-flow', { params: { start_date: startDate, end_date: endDate } }),
  getProfitLoss: (startDate: string, endDate: string) =>
    api.get('/reports/profit-loss', { params: { start_date: startDate, end_date: endDate } }),
  getTourAnalysis: (startDate: string, endDate: string) =>
    api.get('/reports/tour-analysis', { params: { start_date: startDate, end_date: endDate } }),
};

// Settings
export const settingsApi = {
  getAll: () => api.get('/settings'),
  getByKey: (key: string) => api.get(`/settings/${key}`),
  save: (key: string, value: string) => api.post('/settings', { key, value }),
  update: (key: string, value: string) => api.put(`/settings/${key}`, { value }),
};

export default api;
