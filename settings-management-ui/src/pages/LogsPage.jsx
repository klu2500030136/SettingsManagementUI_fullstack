import { useEffect, useMemo, useState } from "react";

import LogCard from "../features/logs/components/LogCard";

import LogsFilterPanel from "../features/logs/components/LogsFilterPanel";

import LogsTimeline from "../features/logs/components/LogsTimeline";

import LogsTable from "../features/logs/components/LogsTable";

import axiosInstance from "../services/api/axios";

function LogsPage() {

  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [selectedUser, setSelectedUser] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);

      try {
        const [auditLogsResponse, searchHistoryResponse] = await Promise.allSettled([
          axiosInstance.get("/api/logs"),
          axiosInstance.get("/api/search-history"),
        ]);

        if (auditLogsResponse.status === "rejected") {
          throw auditLogsResponse.reason;
        }

        const auditLogs = auditLogsResponse.value.data?.data || auditLogsResponse.value.data || [];
        const searchLogs =
          searchHistoryResponse.status === "fulfilled"
            ? searchHistoryResponse.value.data?.data || searchHistoryResponse.value.data || []
            : [];

        setLogs([...auditLogs, ...searchLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (error) {
        setError(
          error.response?.data?.message ||
          error.response?.data?.detail?.message ||
          error.response?.data?.detail ||
          "Failed to load logs"
        );
      } finally {
        setLoading(false);
      }
    };

    Promise.resolve().then(fetchLogs);
  }, []);

  const users = useMemo(
    () => Array.from(new Set(logs.map((log) => log.user).filter(Boolean))).sort(),
    [logs]
  );

  const filteredLogs = logs.filter(
    (log) => {

      const userMatch =
        selectedUser
          ? log.user === selectedUser
          : true;

      const dateMatch =
        selectedDate
          ? log.date === selectedDate
          : true;

      return userMatch && dateMatch;
    }
  );

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div>

        <h1 className="text-3xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
          Configuration Logs
        </h1>

        <p className="text-text-secondary mt-1.5 text-base font-medium">
          Monitor configuration activity and audit trails.
        </p>

      </div>

      {/* Filters */}
      <LogsFilterPanel
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        users={users}
      />

      {loading && (
        <p className="text-text-secondary font-medium">
          Loading logs...
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 font-medium">
          {error}
        </div>
      )}

      {/* Log Cards */}
      {!loading && !error && (
        <div className="space-y-6">

          {filteredLogs.map((log) => (
            <LogCard
              key={log.id}
              log={log}
            />
          ))}

          {filteredLogs.length === 0 && (
            <p className="text-text-secondary font-medium">
              No logs found.
            </p>
          )}

        </div>
      )}

      {/* Timeline */}
      {!loading && !error && <LogsTimeline logs={filteredLogs} />}

      {/* Table */}
      {!loading && !error && <LogsTable logs={filteredLogs} />}

    </div>
  );
}

export default LogsPage;
