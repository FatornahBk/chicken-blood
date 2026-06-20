import { loginClient } from "../api";

// สร้าง config สำหรับ API ที่ต้องใช้ token หลัง login
const authConfig = () => {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ดึงรายชื่อผู้ใช้ที่ยังรอ Admin อนุมัติ
export const getPendingUsers = async (email = "") => {
  const config = authConfig();
  const keyword = email.trim();

  if (keyword) {
    config.params = { email: keyword };
  }

  const response = await loginClient.get("/user/admin/pending", config);
  return response.data;
};

// อนุมัติผู้ใช้ตาม user_id
export const approveUser = async (userId) => {
  const response = await loginClient.patch(
    `/user/admin/approve/${userId}`,
    null,
    authConfig()
  );
  return response.data;
};

// ปฏิเสธผู้ใช้ตาม user_id
export const rejectUser = async (userId) => {
  const response = await loginClient.patch(
    `/user/admin/reject/${userId}`,
    null,
    authConfig()
  );
  return response.data;
};
