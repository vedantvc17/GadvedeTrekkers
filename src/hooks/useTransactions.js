/**
 * useTransactions — fetches payments from Supabase via the backend API.
 * Falls back to localStorage (gt_transactions) if the backend is unreachable.
 */

import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api/backendClient";
import { queryTransactions } from "../data/transactionStorage";

export function useTransactions({
  search = "",
  status = "",
  paymentMode = "",
  fromDate = "",
  toDate = "",
  sortBy = "latest",
  limit = 500,
} = {}) {
  const [transactions, setTransactions] = useState([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ sort_by: sortBy, limit: String(limit) });
    if (search)      params.set("search",    search);
    if (status)      params.set("status",    status);
    if (paymentMode) params.set("mode",      paymentMode);
    if (fromDate)    params.set("from_date", fromDate);
    if (toDate)      params.set("to_date",   toDate);

    apiRequest(`/api/payments?${params}`, { admin: true })
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setTransactions(list);
        setTotal(res?.total ?? list.length);
      })
      .catch((err) => {
        console.warn("useTransactions: backend unreachable, falling back to localStorage.", err.message);
        const local = queryTransactions({ status, paymentMode, fromDate, toDate, search, sortBy });
        setTransactions(local);
        setTotal(local.length);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [search, status, paymentMode, fromDate, toDate, sortBy, limit]);

  useEffect(() => { load(); }, [load]);

  return { transactions, total, loading, error, refresh: load };
}
