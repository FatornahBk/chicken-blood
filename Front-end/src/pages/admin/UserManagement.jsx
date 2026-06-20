import { Ban, Edit3, Search, Users } from "lucide-react";

  const users = [
    {
      "user_id": 1,
      "first_name": "สมชาย",
      "last_name": "ไข่แลน",
      "email": "somchai.vet@example.com",
      "profile_image": null,
      "role": "admin",
      "veterinary_license": "VET-12345",
      "is_verified": 1,
      "is_active": true,
      "created_at": "2026-05-25T07:21:53.390Z",
      "verified_at": null
    },
    {
      "user_id": 2,
      "first_name": "Naikamon",
      "last_name": "Sangkaew",
      "email": "naikamon9168@gmail.com",
      "profile_image": null,
      "role": "user",
      "veterinary_license": "XXX-4399",
      "is_verified": 1,
      "is_active": true,
      "created_at": "2026-05-25T07:22:29.126Z",
      "verified_at": "2026-05-26T13:38:16.000Z"
    },
    {
      "user_id": 3,
      "first_name": "Farn",
      "last_name": "Swakiro",
      "email": "fatornah030bukem@gmail.com",
      "profile_image": null,
      "role": "admin",
      "veterinary_license": "VET-14123",
      "is_verified": 1,
      "is_active": true,
      "created_at": "2026-05-25T07:42:57.378Z",
      "verified_at": "2026-05-25T07:46:55.000Z"
    },
    {
      "user_id": 5,
      "first_name": "Suratsawadee",
      "last_name": "Matraksa",
      "email": "suratsawadee6627@gmail.com",
      "profile_image": null,
      "role": "user",
      "veterinary_license": "Vh-2578",
      "is_verified": 1,
      "is_active": true,
      "created_at": "2026-05-26T15:41:01.441Z",
      "verified_at": "2026-05-26T16:04:00.000Z"
    }
  ]
  
const verificationStatus = {
  1: {
    label: "Verified",
    className: "text-green-600 bg-green-100",
  },
  2: {
    label: "Suspended",
    className: "text-red-600 bg-red-100",
  },
};

const getVerificationStatus = (status) =>
  verificationStatus[Number(status)] ?? {
    label: "ไม่ทราบสถานะ",
    className: "text-slate-600 bg-slate-100",
  };

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  const clean = name.replace(/[^a-zA-Zก-๙]/g, "");
  return clean.slice(0, 2).toUpperCase();
};

function AdminUserManagement() {
  // ไม่แสดงผู้ใช้ที่ยังไม่ผ่านการยืนยัน (is_verified = 0)
  const visibleUsers = users.filter((user) => Number(user.is_verified) !== 0);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-bold text-gray-950">
            User Management
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Manage roles, account status, and access for the platform.
          </p>
        </div>
      </div>
      
      {/* การ์ดสรุปข้อมูลผู้ใช้ */}
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg font-medium text-slate-500">Total Users</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">1,248</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg font-medium text-slate-500">Active Accounts</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">1,162</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg font-medium text-slate-500">Suspended</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">12</p>
        </article>
      </div>

      {/* ตารางรายชื่อผู้ใช้ */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" aria-hidden="true"/>
            <h2 className="text-xl font-bold text-slate-950">All Users</h2>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search user"
              className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Photo</th>
                <th className="px-6 py-3 font-semibold">User</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Verified Date</th>
                <th className="px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleUsers.map((user) => {
                const status = getVerificationStatus(user.is_verified);
                const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

                return (
                  <tr key={user.user_id}>
                    <td className="px-6 py-4 text-slate-700">{user.user_id}</td>
                    <td className="px-6 py-4">
                      {user.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt={fullName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white select-none">
                          {getInitials(fullName)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-950">{fullName}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{user.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(user.verified_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
                          <Edit3 className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button className="rounded-lg border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50">
                          <Ban className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </section>
  );
}

export default AdminUserManagement;
