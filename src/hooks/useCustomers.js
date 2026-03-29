/**
 * useCustomers — fetches customers from Supabase via the backend API.
 * Falls back to localStorage (gt_customers) if the backend is unreachable.
 *
 * Usage:
 *   const { customers, loading, error, refresh } = useCustomers({ search: "Arjun" });
 */

import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api/backendClient";
import { getAllCustomers } from "../data/customerStorage";

export function useCustomers({ search = "", limit = 500 } = {}) {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ limit: String(limit) });
    if (search.trim()) params.set("search", search.trim());

    apiRequest(`/api/customers?${params}`, { admin: true })
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setCustomers(list);
      })
      .catch((err) => {
        console.warn("useCustomers: backend unreachable, falling back to localStorage.", err.message);
        setCustomers(getAllCustomers());
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [search, limit]);

  useEffect(() => { load(); }, [load]);

  return { customers, loading, error, refresh: load };
}

export function useCustomer(id) {
  const [customer, setCustomer] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);

    apiRequest(`/api/customers/${id}`, { admin: true })
      .then((res) => setCustomer(res?.data ?? res))
      .catch((err) => {
        console.warn("useCustomer: backend unreachable.", err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { customer, loading, error };
}
