function GroupsTable({
  groups,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="text-left p-4">
              Name
            </th>

            <th className="text-left p-4">
              Description
            </th>

            <th className="text-left p-4">
              Settings Count
            </th>

            <th className="text-left p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {groups.map((group) => (
            <tr
              key={group.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="p-4 font-medium">
                {group.name}
              </td>

              <td className="p-4 text-slate-600">
                {group.description}
              </td>

              <td className="p-4">
                {group.settingsCount}
              </td>

              <td className="p-4 flex gap-2">

                <button
                  onClick={() => onEdit(group)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(group.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default GroupsTable;