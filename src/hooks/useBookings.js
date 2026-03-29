/**
 * useBookings — fetches bookings from Supabase via the backend API.
 * Falls back to localStorage (gt_bookings) if the backend is unreachable.
 *
 * Usage:
 *   const { bookings, loading, error, refresh } = useBookings({ status: "CONFIRMED" });
 */

import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../api/backendClient";
import { queryBookings } from "../data/bookingStorage";

export function useBookings({
  search = "",
  status = "",
  paymentOption = "",
  fromDate = "",
  toDate = "",
  sortBy = "latest",
  limit = 500,
} = {}) {
  const [bookings, setBookings] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ sort_by: sortBy, limit: String(limit) });
    if (search)        params.set("search",         search);
    if (status)        params.set("status",         status);
    if (paymentOption) params.set("payment_option", paymentOption);
    if (fromDate)      params.set("from_date",      fromDate);
    if (toDate)        params.set("to_date",        toDate);

    apiRequest(`/api/bookings?${params}`, { admin: true })
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setBookings(list);
        setTotal(res?.total ?? list.length);
      })
      .catch((err) => {
        console.warn("useBookings: backend unreachable, falling back to localStorage.", err.message);
        const local = queryBookings({ search, status, paymentOption, fromDate, toDate, sortBy });
        setBookings(local);
        setTotal(local.length);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [search, status, paymentOption, fromDate, toDate, sortBy, limit]);

  useEffect(() => { load(); }, [load]);

  return { bookings, total, loading, error, refresh: load };
}
