import { useEffect, useMemo, useState } from "react";
import { Check, Search, ShieldCheck, X } from "lucide-react";
import {
  approveUser,
  getPendingUsers,
  rejectUser,
} from "../../services/admin/VerifyUser";

// แปลง response จาก API ให้เป็น array เสมอ เพราะแต่ละ backend อาจส่งรูปแบบไม่เหมือนกัน
const normalizeUsers = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};



function VerifyUser() {
  // state หลักของหน้า: ข้อมูล, คำค้นหา, loading, action ที่กำลังทำ, และ error
  const [pendingUsers, setPendingUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);
  const [error, setError] = useState("");

  // กรองข้อมูลในหน้าจอจาก search โดยไม่ต้องยิง API ใหม่ทุกครั้งที่พิมพ์
  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return pendingUsers;

    return pendingUsers.filter((user) => {
      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`;
      return [fullName, user.email, user.role, user.veterinary_license]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword));
    });
  }, [pendingUsers, search]);

  // โหลดข้อมูลจาก API แล้วเก็บลง pendingUsers
  const loadPendingUsers = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await getPendingUsers();
      setPendingUsers(normalizeUsers(data));
    } catch (err) {
      setError(
        err.response?.data?.message ?? "ไม่สามารถดึงข้อมูลผู้ใช้ที่รออนุมัติได้"
      );
    } finally {
      setLoading(false);
    }
  };

  // useEffect ที่มี [] จะทำงานครั้งเดียวตอนเปิดหน้านี้
  useEffect(() => {
    loadPendingUsers();
  }, []);

  // ใช้ function เดียวกันสำหรับ approve/reject แล้วเลือก API จาก action
  const handleVerifyUser = async (userId, action) => {
    setError("");
    setActionUserId(userId);

    try {
      if (action === "approve") {
        await approveUser(userId);
      } else {
        await rejectUser(userId);
      }

      // ถ้าสำเร็จให้ลบ user คนนั้นออกจากตารางทันที ไม่ต้องรอ refresh หน้า
      setPendingUsers((users) =>
        users.filter((user) => user.user_id !== userId)
      );
    } catch (err) {
      setError(err.response?.data?.message ?? "ไม่สามารถอัปเดตสถานะผู้ใช้ได้");
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Admin review</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Verify Users
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review veterinary licenses and approve trusted users.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search applicant"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {pendingUsers.length}
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Approved Today</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">6</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Rejected Today</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">2</p>
        </article>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-950">
              Waiting for Approval
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">User ID</th>
                <th className="px-6 py-3 font-semibold">Applicant</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">License</th>
                <th className="px-6 py-3 font-semibold">Submitted</th>
                <th className="px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-rose-500"
                  >
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    ไม่มีผู้ใช้ที่รออนุมัติ
                  </td>
                </tr>
              )}

              {!loading && !error && filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-4 text-slate-700">{user.user_id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-950">{user.first_name} {user.last_name}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{user.role}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {user.veterinary_license}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.created_at}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={actionUserId === user.user_id}
                        onClick={() => handleVerifyUser(user.user_id, "approve")}
                        className="rounded-lg bg-emerald-500 p-2 text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        disabled={actionUserId === user.user_id}
                        onClick={() => handleVerifyUser(user.user_id, "reject")}
                        className="rounded-lg bg-rose-500 p-2 text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default VerifyUser;
