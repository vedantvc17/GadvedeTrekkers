import { useState } from "react";
import { downloadCSV, downloadExcel, downloadPDF } from "../utils/downloadUtils";

/**
 * DownloadButton
 * Props:
 *   getData    – () => array of plain objects to export
 *   filename   – base filename (without extension)
 *   title      – title shown in PDF header (optional)
 */
export default function DownloadButton({ getData, filename = "export", title }) {
  const [open, setOpen] = useState(false);

  const handle = (fmt) => {
    setOpen(false);
    const rows = getData();
    if (!rows?.length) return alert("No data to download.");
    if (fmt === "csv")   downloadCSV(rows,   filename);
    if (fmt === "excel") downloadExcel(rows, filename);
    if (fmt === "pdf")   downloadPDF(rows,   filename, title || filename);
  };

  return (
    <div className="adm-dl-wrap" onBlur={() => setTimeout(() => setOpen(false), 150)}>
      <button
        className="btn btn-outline-secondary btn-sm adm-dl-btn"
        onClick={() => setOpen((o) => !o)}
        title="Download data"
      >
        ⬇ Download
      </button>
      {open && (
        <div className="adm-dl-dropdown">
          <button className="adm-dl-item" onClick={() => handle("csv")}>
            <span>📄</span> CSV
          </button>
          <button className="adm-dl-item" onClick={() => handle("excel")}>
            <span>📊</span> Excel (.xls)
          </button>
          <button className="adm-dl-item" onClick={() => handle("pdf")}>
            <span>🖨</span> PDF (Print)
          </button>
        </div>
      )}
    </div>
  );
}
