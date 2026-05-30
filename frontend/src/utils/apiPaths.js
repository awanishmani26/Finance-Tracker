export const BASE_URL = "https://expense-backend.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    GET_USER: "/api/v1/auth/getUser",
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
  INCOME: {
    ADD: "/api/v1/income/add",
    GET_ALL: "/api/v1/income/getAll",
    DELETE: (id) => `/api/v1/income/${id}`,
    DOWNLOAD: "/api/v1/income/downloadExcel",
  },
  EXPENSE: {
    ADD: "/api/v1/expense/add",
    GET_ALL: "/api/v1/expense/getAll",
    DELETE: (id) => `/api/v1/expense/${id}`,
    DOWNLOAD: "/api/v1/expense/downloadExcel",
  },
  DASHBOARD: "/api/v1/dashboard",
};
