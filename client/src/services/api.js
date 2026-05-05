import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export async function getReports(params = {}) {
  const { data } = await api.get('/reports', { params });
  return data;
}

export async function getReport(id) {
  const { data } = await api.get(`/reports/${id}`);
  return data;
}

export async function createReport(report, force = false) {
  const { data } = await api.post('/reports', { ...report, force });
  return data;
}

export default api;
