function Table({ children, className = "" }) {
  return (
    <div className={`w-full overflow-hidden rounded-[20px] glass-card p-0 ${className}`}>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          {children}
        </table>
      </div>
    </div>
  );
}

function Thead({ children }) {
  return (
    <thead className="bg-surface-50/50 dark:bg-[#141414]/80 backdrop-blur-sm border-b border-surface-200 dark:border-surface-800">
      {children}
    </thead>
  );
}

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-6 py-4 text-xs font-semibold tracking-wider text-surface-500 dark:text-text-secondary uppercase ${className}`}
    >
      {children}
    </th>
  );
}

function Tbody({ children }) {
  return <tbody className="divide-y divide-surface-100 dark:divide-surface-800">{children}</tbody>;
}

function Tr({ children, className = "", onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-brand/5 dark:hover:bg-brand/10 transition-colors duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
}

function Td({ children, className = "" }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-surface-700 dark:text-text-main ${className}`}>
      {children}
    </td>
  );
}

Table.Thead = Thead;
Table.Th = Th;
Table.Tbody = Tbody;
Table.Tr = Tr;
Table.Td = Td;

export default Table;