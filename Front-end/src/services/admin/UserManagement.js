import { loginClient } from "../api";

const authConfig = (params = {}) => {
  const token = localStorage.getItem("access_token");
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(Object.keys(cleanParams).length ? { params: cleanParams } : {}),
  };
};

export const getAllUsers = async ({ role = "", email = "" } = {}) => {
  const response = await loginClient.get(
    "/user/admin/all",
    authConfig({
      role: role.trim(),
      email: email.trim(),
    }),
  );
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await loginClient.patch(
    `/user/admin/update-role/${userId}`,
    { role },
    authConfig(),
  );
  return response.data;
};

export const suspendUser = async (userId, payload = {}) => {
  const response = await loginClient.patch(
    `/user/admin/suspend/${userId}`,
    payload,
    authConfig(),
  );
  return response.data;
};
