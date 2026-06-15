import React from "react";
import Table from "../../../components/ui/Table";

function SettingsTable({ settings, onEdit, onDelete, isAdmin }) {
  if (settings.length === 0) {
    return <div className="text-center py-10 glass-card dark:glass-panel-dark rounded-xl text-text-secondary font-medium shadow-soft">No settings found.</div>;
  }

  return (
    <Table>
      <Table.Thead>
        <tr>
          <Table.Th>Key</Table.Th>
          <Table.Th>Value</Table.Th>
          <Table.Th>Group</Table.Th>
          <Table.Th>Type</Table.Th>
          {isAdmin && <Table.Th className="text-right">Actions</Table.Th>}
        </tr>
      </Table.Thead>
      <Table.Tbody>
        {settings.map((setting) => (
          <Table.Tr key={setting.settingId}>
            <Table.Td className="font-semibold text-surface-900 dark:text-text-main">{setting.settingKey}</Table.Td>
            <Table.Td>
              <span className="font-mono bg-surface-100 dark:bg-[#1C1C1C] text-surface-700 dark:text-text-secondary rounded px-2 py-1 border border-surface-200 dark:border-border-goldLight/30 text-xs">
                {setting.settingValue}
              </span>
            </Table.Td>
            <Table.Td>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                {setting.groupName}
              </span>
            </Table.Td>
            <Table.Td className="text-surface-500 dark:text-surface-400 font-medium text-xs tracking-wider">{setting.settingType}</Table.Td>
            {isAdmin && (
              <Table.Td className="text-right">
                <button onClick={() => onEdit(setting)} className="text-brand hover:text-brand-hover mr-4 font-semibold transition-colors">Edit</button>
                <button onClick={() => onDelete(setting.settingId)} className="text-rose-500 hover:text-rose-400 font-semibold transition-colors">Delete</button>
              </Table.Td>
            )}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export default SettingsTable;
