/**
 * useEnquiries — fetches enquiries from Supabase via the backend API.
 *
 * Role-scoping:
 *   Management / Super Admin → fetches ALL enquiries (no filter)
 *   Sales                    → fetches only enquiries assigned to the current user
 *
 * Falls back to localStorage (gt_enquiries) if the backend is unreachable,
 * applying the same role-scoped filter client-side.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { apiRequest }          from "../api/backendClient";
import { getEnquiries }        from "../data/enquiryStorage";
import { getCurrentAdminUser } from "../data/permissionStorage";
import { canSeeAllEnquiries }  from "../utils/roleHelpers";

export function useEnquiries({
  search          = "",
  status          = "",
  includeArchived = false,
  limit           = 500,
} = {}) {
  const [enquiries, setEnquiries] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // Read once per hook instance — role doesn't change mid-session.
  const currentUser = useMemo(() => getCurrentAdminUser(), []);
  const seeAll      = canSeeAllEnquiries(currentUser.role);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ limit: String(limit) });
    if (search)          params.set("search",           search);
    if (status)          params.set("status",           status);
    if (includeArchived) params.set("include_archived", "true");

    // Sales users: ask the backend to scope results to their username.
    // Management / Super Admin: no restriction — see everything.
    if (!seeAll && currentUser.username) {
      params.set("assigned_to", currentUser.username);
    }

    apiRequest(`/api/enquiries?${params}`, { admin: true })
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setEnquiries(list);
        setTotal(res?.total ?? list.length);
      })
      .catch((err) => {
        console.warn("useEnquiries: backend unreachable, falling back to localStorage.", err.message);

        let local = getEnquiries({ includeArchived });

        // Mirror the same role-scoped filter in the localStorage fallback.
        if (!seeAll && currentUser.username) {
          local = local.filter(
            (e) => e.assignedSalesUsername === currentUser.username
          );
        }

        setEnquiries(local);
        setTotal(local.length);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [search, status, includeArchived, limit, seeAll, currentUser.username]);

  useEffect(() => { load(); }, [load]);

  return {
    enquiries,
    total,
    loading,
    error,
    refresh: load,
    /** Expose so the UI can adjust controls (e.g. hide the sales-filter dropdown for Sales users). */
    currentUser,
    seeAll,
  };
}
