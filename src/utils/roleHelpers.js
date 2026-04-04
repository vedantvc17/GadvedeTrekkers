/**
 * roleHelpers.js — Gadvede Trekkers
 *
 * Single source of truth for role constants and all role-based capability checks.
 * Import these helpers everywhere instead of comparing raw strings.
 *
 * Role hierarchy (highest → lowest):
 *   Super Admin  → full access, same as Management + team management
 *   Management   → full data visibility, can assign enquiries
 *   Sales        → scoped to own assigned data only
 */

/* ─── Role constants ────────────────────────────────────────────────────── */

export const ROLES = Object.freeze({
  SUPER_ADMIN: "Super Admin",
  MANAGEMENT:  "Management",
  SALES:       "Sales",
});

/** Roles that have elevated (Management-level) access. */
const MANAGEMENT_TIER = [ROLES.SUPER_ADMIN, ROLES.MANAGEMENT];

/* ─── Enquiry visibility ─────────────────────────────────────────────────── */

/**
 * Returns true if the role can see ALL enquiries in the pipeline,
 * regardless of who they are assigned to.
 *
 * - Super Admin  → true
 * - Management   → true
 * - Sales        → false  (sees only own assigned enquiries)
 */
export function canSeeAllEnquiries(role) {
  return MANAGEMENT_TIER.includes(role);
}

/**
 * Returns true if the role's enquiry visibility is scoped to
 * enquiries that are explicitly assigned to that user.
 */
export function isSalesRole(role) {
  return role === ROLES.SALES;
}

/* ─── Assignment controls ────────────────────────────────────────────────── */

/**
 * Returns true if the role can reassign enquiries to other sales people.
 * Sales reps cannot reassign — that would let them steal leads.
 */
export function canAssignEnquiries(role) {
  return MANAGEMENT_TIER.includes(role);
}

/* ─── Financial access ───────────────────────────────────────────────────── */

/** Returns true if the role can see payments, transactions, and earnings data. */
export function canViewFinancials(role) {
  return MANAGEMENT_TIER.includes(role);
}

/* ─── Team management ────────────────────────────────────────────────────── */

/** Returns true if the role can add/edit/remove employee records. */
export function canManageTeam(role) {
  return role === ROLES.SUPER_ADMIN;
}

/* ─── Generic helpers ────────────────────────────────────────────────────── */

/** Returns true if the provided role string is a recognised role. */
export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

/**
 * Returns a human-readable label for a role.
 * Useful for display in badges, tooltips, etc.
 */
export function getRoleLabel(role) {
  return role || "Unknown Role";
}
