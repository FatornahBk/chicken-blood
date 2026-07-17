import { getAllUsers } from "./UserManagement";
import { getPendingUsers } from "./VerifyUser";

export const getDashboardUsers = async () => {
  const [allUsers, pendingUsers] = await Promise.all([
    getAllUsers(),
    getPendingUsers(),
  ]);

  return {
    allUsers,
    pendingUsers,
  };
};
