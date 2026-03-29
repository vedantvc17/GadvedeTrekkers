/**
 * useEnquiries — fetches enquiries from Supabase via the backend API.
 * Falls back to localStorage (gt_enquiries) if the backend is unreachable.
 */

import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api/backendClient";
import { getEnquiries } from "../data/enquiryStorage";

export function useEnquiries({
  search = "",
  status = "",
  includeArchived = false,
  limit = 500,
} = {}) {
  const [enquiries, setEnquiries] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ limit: String(limit) });
    if (search)          params.set("search",           search);
    if (status)          params.set("status",           status);
    if (includeArchived) params.set("include_archived", "true");

    apiRequest(`/api/enquiries?${params}`, { admin: true })
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setEnquiries(list);
        setTotal(res?.total ?? list.length);
      })
      .catch((err) => {
        console.warn("useEnquiries: backend unreachable, falling back to localStorage.", err.message);
        const local = getEnquiries({ includeArchived });
        setEnquiries(local);
        setTotal(local.length);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [search, status, includeArchived, limit]);

  useEffect(() => { load(); }, [load]);

  return { enquiries, total, loading, error, refresh: load };
}
