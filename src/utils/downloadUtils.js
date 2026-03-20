/* ─────────────────────────────────────────────────────────────
   Download Utilities — no external libraries required
   Supports: CSV · Excel (.xls via HTML table) · PDF (print dialog)
───────────────────────────────────────────────────────────── */

function _trigger(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function _flattenRow(obj) {
  const flat = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined)     flat[k] = "";
    else if (Array.isArray(v))             flat[k] = v.length ? `[${v.length} items]` : "";
    else if (typeof v === "object")        flat[k] = JSON.stringify(v);
    else                                   flat[k] = v;
  }
  return flat;
}

export function downloadCSV(rows, filename = "export") {
  if (!rows?.length) return;
  const flat = rows.map(_flattenRow);
  const keys = Object.keys(flat[0]);
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [keys.map(escape).join(","), ...flat.map((r) => keys.map((k) => escape(r[k])).join(","))].join("\r\n");
  _trigger(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `${filename}.csv`);
}

export function downloadExcel(rows, filename = "export") {
  if (!rows?.length) return;
  const flat = rows.map(_flattenRow);
  const keys = Object.keys(flat[0]);
  const th  = keys.map((k) => `<th style="background:#198754;color:#fff;padding:6px 10px;">${k}</th>`).join("");
  const trs = flat.map((r) => `<tr>${keys.map((k) => `<td style="padding:5px 10px;border:1px solid #ddd;">${r[k]}</td>`).join("")}</tr>`).join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"/></head><body><table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></body></html>`;
  _trigger(new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" }), `${filename}.xls`);
}

export function downloadPDF(rows, filename = "export", title = "") {
  if (!rows?.length) return;
  const flat = rows.map(_flattenRow);
  const keys = Object.keys(flat[0]);
  const th  = keys.map((k) => `<th>${k}</th>`).join("");
  const trs = flat.map((r) => `<tr>${keys.map((k) => `<td>${r[k]}</td>`).join("")}</tr>`).join("");
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title || filename}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 20px; font-size: 11px; }
  h2   { color: #198754; margin-bottom: 6px; }
  p    { color: #64748b; margin-bottom: 16px; font-size: 10px; }
  table { border-collapse: collapse; width: 100%; }
  th   { background: #198754; color: #fff; padding: 7px 10px; text-align: left; font-size: 10px; }
  td   { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
  tr:nth-child(even) td { background: #f8fafc; }
  @media print { @page { margin: 1cm; } }
</style></head><body>
<h2>${title || filename}</h2>
<p>Exported on ${new Date().toLocaleString("en-IN")} · ${rows.length} record${rows.length !== 1 ? "s" : ""}</p>
<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>
<script>window.onload = function(){ window.print(); }<\/script>
</body></html>`;
  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); }
}
