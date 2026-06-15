import Table from "../../../components/ui/Table";
import Button from "../../../components/ui/Button";

function UsersTable({ users, currentUserEmail, onRoleChange, onDelete }) {
  return (
    <Table>
      <Table.Thead>
        <tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Actions</Table.Th>
        </tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => (
          <Table.Tr key={user.userId}>
            <Table.Td className="font-semibold">{user.name}</Table.Td>
            <Table.Td className="text-text-secondary">{user.email}</Table.Td>
            <Table.Td>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider
                  ${
                    user.role === "ADMIN"
                      ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      : "bg-brand/10 text-brand border border-brand/20"
                  }
                `}
              >
                {user.role}
              </span>
            </Table.Td>
            <Table.Td>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider
                  ${
                    user.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-surface-500/10 text-surface-500 border border-surface-500/20"
                  }
                `}
              >
                {user.status}
              </span>
            </Table.Td>
            <Table.Td>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange(user.userId, e.target.value)}
                  className="bg-transparent border border-surface-200 dark:border-border-goldLight text-surface-900 dark:text-text-main rounded-lg px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="USER" className="text-[#0B0B0B]">User</option>
                  <option value="ADMIN" className="text-[#0B0B0B]">Admin</option>
                </select>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={user.email === currentUserEmail}
                  onClick={() => onDelete(user)}
                >
                  Delete
                </Button>
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export default UsersTable;
