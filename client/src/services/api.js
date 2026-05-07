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
  const { data, secret_code } = await api.post('/reports', { ...report, force });
  return { data, secret_code };
}

export async function upvoteReport(id) {
  const { data } = await api.post(`/reports/${id}/upvote`);
  return data;
}

export async function addComment(id, text, author) {
  const { data } = await api.post(`/reports/${id}/comment`, { text, author });
  return data;
}

export async function verifySecretCode(secret_code) {
  const { data } = await api.post('/reports/verify-code', { secret_code });
  return data;
}

export async function deleteReport(id, secret_code) {
  const { data } = await api.delete(`/reports/${id}`, { data: { secret_code } });
  return data;
}

export default api;
