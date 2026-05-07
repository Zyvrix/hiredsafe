import axios from "axios";

/* =========================================
   BASE URL
========================================= */

const baseURL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

/* =========================================
   AXIOS INSTANCE
========================================= */

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================
   GLOBAL ERROR LOGGER
========================================= */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

/* =========================================
   GET ALL REPORTS
========================================= */

export async function getReports(params = {}) {
  const { data } = await api.get(
    "/api/reports",
    { params }
  );

  return data;
}

/* =========================================
   GET SINGLE REPORT
========================================= */

export async function getReport(id) {
  const { data } = await api.get(
    `/api/reports/${id}`
  );

  return data;
}

/* =========================================
   CREATE REPORT
========================================= */

export async function createReport(
  report,
  force = false
) {
  const response = await api.post(
    "/api/reports",
    {
      ...report,
      force,
    }
  );

  return response.data;
}

/* =========================================
   UPVOTE REPORT
========================================= */

export async function upvoteReport(id) {
  const response = await api.post(
    `/api/reports/${id}/upvote`
  );

  return response.data;
}

/* =========================================
   ADD COMMENT
========================================= */

export async function addComment(
  id,
  text,
  author
) {
  const response = await api.post(
    `/api/reports/${id}/comment`,
    {
      text,
      author,
    }
  );

  return response.data;
}

/* =========================================
   VERIFY SECRET CODE
========================================= */

export async function verifySecretCode(
  secret_code
) {
  const response = await api.post(
    "/api/reports/verify-code",
    {
      secret_code,
    }
  );

  return response.data;
}

/* =========================================
   DELETE REPORT
========================================= */

export async function deleteReport(
  id,
  secret_code
) {
  const response = await api.delete(
    `/api/reports/${id}`,
    {
      data: { secret_code },
    }
  );

  return response.data;
}

export default api;