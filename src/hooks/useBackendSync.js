import { useEffect } from "react";
import { syncEmployeesFromBackend } from "../data/employeeStorage";
import { syncVendorsFromBackend } from "../data/vendorStorage";
import { syncTrekPaymentsFromBackend } from "../data/trekPaymentStorage";

/**
 * Call this hook once in the main admin layout/dashboard.
 * It pulls latest data from Supabase into localStorage on mount
 * so all devices see the same data when they open the app.
 */
export function useBackendSync() {
  useEffect(() => {
    const token = sessionStorage.getItem("gt_admin_token");
    if (!token) return; // Only sync when admin is logged in
    // Run all syncs in parallel, errors are silenced individually
    Promise.allSettled([
      syncEmployeesFromBackend(),
      syncVendorsFromBackend(),
      syncTrekPaymentsFromBackend(),
    ]);
  }, []); // Run once on mount
}
