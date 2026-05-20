import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    adminService.getUsers().then((res) => setUsers(res.data.data));
  }, []);

  const updateRole = async (id, role) => {
    try {
      await adminService.updateUser(id, { role });
      toast.success('User updated');
      const res = await adminService.getUsers();
      setUsers(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Users</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t dark:border-gray-800">
                <td className="p-4 font-medium">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)} className="input-field py-1 text-sm capitalize">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
