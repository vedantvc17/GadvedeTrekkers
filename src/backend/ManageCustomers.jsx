import { useState } from "react";
import { getAllCustomers, searchCustomers } from "../data/customerStorage";

const PAGE_SIZE = 10;

export default function ManageCustomers() {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);

  const filtered = search.trim() ? searchCustomers(search) : getAllCustomers();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const displayed  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <h3 className="adm-page-title">👤 Customers</h3>
        <span className="adm-count-badge">{filtered.length} total</span>
      </div>

      <div className="adm-search-row">
        <input
          className="form-control form-control-sm adm-search"
          placeholder="Search by name, phone or email…"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-icon">👤</div>
          <p className="adm-empty-text">
            {search ? `No customers match "${search}"` : "No customers yet. Customers are created automatically on booking."}
          </p>
        </div>
      ) : (
        <>
          <div className="adm-table-wrap">
            <table className="table table-hover adm-table mb-0">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((c) => (
                  <tr key={c.id}>
                    <td className="text-truncate" style={{ maxWidth: 160, fontFamily: "monospace", fontSize: 12 }}>
                      {c.id}
                    </td>
                    <td>{c.name || "—"}</td>
                    <td>{c.phone || "—"}</td>
                    <td className="text-truncate" style={{ maxWidth: 200 }}>{c.email || "—"}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="adm-pagination">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <span className="adm-page-indicator">Page {page} of {totalPages}</span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
