import { useState } from "react";
import { getAllLogs, queryLogs, clearLogs } from "../data/activityLogStorage";

const MANAGEMENT_USERS = [
  { username: "admin",           name: "Admin (Super)" },
  { username: "pratik.ubhe",     name: "Pratik Ubhe" },
  { username: "rohit.panhalkar", name: "Rohit Panhalkar" },
  { username: "akshay.kangude",  name: "Akshay Kangude" },
];

const MODULES = ["General","Treks","Tours","Camping","Vendors","Bookings","Employees","Payments","Marketing","Assignments"];

const SEVERITY_STYLES = {
  info:    { color: "#2563eb", bg: "#eff6ff" },
  success: { color: "#16a34a", bg: "#f0fdf4" },
  warning: { color: "#d97706", bg: "#fffbeb" },
  danger:  { color: "#dc2626", bg: "#fef2f2" },
};

export default function ActivityLogs() {
  const [userF,   setUserF]   = useState("");
  const [moduleF, setModuleF] = useState("");
  const [dateF,   setDateF]   = useState("");
  const [tick,    setTick]    = useState(0);

  const logs = queryLogs({
    username: userF   || undefined,
    module:   moduleF || undefined,
    date:     dateF   || undefined,
  });

  const handleClear = () => {
    if (window.confirm("Clear all activity logs? This cannot be undone.")) {
      clearLogs();
      setTick(t => t + 1);
    }
  };

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h3 className="adm-page-title">📋 Activity Logs</h3>
        <div className="d-flex gap-2 align-items-center">
          <span className="adm-count-badge">{logs.length} entries</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleClear}>
            🗑 Clear All Logs
          </button>
        </div>
      </div>

      <div className="adm-filter-bar">
        <select className="form-select form-select-sm" value={userF} onChange={e => setUserF(e.target.value)} style={{flex:1}}>
          <option value="">All Users</option>
          {MANAGEMENT_USERS.map(u => <option key={u.username} value={u.username}>{u.name}</option>)}
        </select>
        <select className="form-select form-select-sm" value={moduleF} onChange={e => setModuleF(e.target.value)} style={{flex:1}}>
          <option value="">All Modules</option>
          {MODULES.map(m => <option key={m}>{m}</option>)}
        </select>
        <input
          type="date" className="form-control form-control-sm"
          value={dateF} onChange={e => setDateF(e.target.value)}
          style={{flex:1}}
        />
        <button className="btn btn-outline-secondary btn-sm"
          onClick={() => { setUserF(""); setModuleF(""); setDateF(""); }}>
          Reset
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">📋</div>
          <p className="adm-empty-text">No activity logs found. Actions performed in the admin panel will appear here.</p>
        </div>
      ) : (
        <div className="adm-table-wrap">
          <table className="table table-hover adm-table mb-0">
            <thead>
              <tr>
                <th style={{width:160}}>Time</th>
                <th style={{width:150}}>User</th>
                <th style={{width:110}}>Module</th>
                <th style={{width:180}}>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => {
                const sev = SEVERITY_STYLES[log.severity] || SEVERITY_STYLES.info;
                return (
                  <tr key={log.logId}>
                    <td style={{fontSize:11, fontFamily:"monospace", color:"#64748b", whiteSpace:"nowrap"}}>
                      {new Date(log.timestamp).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div style={{fontWeight:600, fontSize:13}}>{log.userName}</div>
                      <div style={{fontSize:10, color:"#94a3b8", fontFamily:"monospace"}}>{log.username}</div>
                    </td>
                    <td>
                      <span style={{fontSize:11, background:"#f1f5f9", padding:"2px 8px", borderRadius:4, whiteSpace:"nowrap"}}>
                        {log.module}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize:12, fontWeight:600, padding:"2px 8px", borderRadius:4,
                        color: sev.color, background: sev.bg, whiteSpace:"nowrap",
                      }}>
                        {log.actionLabel}
                      </span>
                    </td>
                    <td style={{fontSize:12, color:"#475569"}}>{log.details}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
