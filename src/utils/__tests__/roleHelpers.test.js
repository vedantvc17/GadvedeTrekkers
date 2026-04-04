/**
 * Unit tests for src/utils/roleHelpers.js
 *
 * Run with:  npx vitest run  (or  npx jest  if you switch test runner)
 *
 * These tests cover every role-capability combination so regressions
 * are caught the moment someone changes a role constant or helper function.
 */

import { describe, it, expect } from "vitest";
import {
  ROLES,
  canSeeAllEnquiries,
  isSalesRole,
  canAssignEnquiries,
  canViewFinancials,
  canManageTeam,
  isValidRole,
  getRoleLabel,
} from "../roleHelpers";

/* ────────────────────────────────────────────────────────────────────────── */
/*  canSeeAllEnquiries                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

describe("canSeeAllEnquiries", () => {
  it("Super Admin can see all enquiries", () => {
    expect(canSeeAllEnquiries(ROLES.SUPER_ADMIN)).toBe(true);
  });

  it("Management can see all enquiries", () => {
    expect(canSeeAllEnquiries(ROLES.MANAGEMENT)).toBe(true);
  });

  it("Sales cannot see all enquiries — scoped to own assigned only", () => {
    expect(canSeeAllEnquiries(ROLES.SALES)).toBe(false);
  });

  it("Unknown / empty role cannot see all enquiries", () => {
    expect(canSeeAllEnquiries("")).toBe(false);
    expect(canSeeAllEnquiries(null)).toBe(false);
    expect(canSeeAllEnquiries(undefined)).toBe(false);
    expect(canSeeAllEnquiries("Contractor")).toBe(false);
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  isSalesRole                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

describe("isSalesRole", () => {
  it("Sales returns true", () => {
    expect(isSalesRole(ROLES.SALES)).toBe(true);
  });

  it("Management returns false", () => {
    expect(isSalesRole(ROLES.MANAGEMENT)).toBe(false);
  });

  it("Super Admin returns false", () => {
    expect(isSalesRole(ROLES.SUPER_ADMIN)).toBe(false);
  });

  it("Unknown roles return false", () => {
    expect(isSalesRole("")).toBe(false);
    expect(isSalesRole(undefined)).toBe(false);
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  canAssignEnquiries                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

describe("canAssignEnquiries", () => {
  it("Super Admin can assign enquiries", () => {
    expect(canAssignEnquiries(ROLES.SUPER_ADMIN)).toBe(true);
  });

  it("Management can assign enquiries", () => {
    expect(canAssignEnquiries(ROLES.MANAGEMENT)).toBe(true);
  });

  it("Sales cannot assign enquiries to others", () => {
    expect(canAssignEnquiries(ROLES.SALES)).toBe(false);
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  canViewFinancials                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

describe("canViewFinancials", () => {
  it("Super Admin can view financials", () => {
    expect(canViewFinancials(ROLES.SUPER_ADMIN)).toBe(true);
  });

  it("Management can view financials", () => {
    expect(canViewFinancials(ROLES.MANAGEMENT)).toBe(true);
  });

  it("Sales cannot view financials", () => {
    expect(canViewFinancials(ROLES.SALES)).toBe(false);
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  canManageTeam                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

describe("canManageTeam", () => {
  it("Super Admin can manage the team", () => {
    expect(canManageTeam(ROLES.SUPER_ADMIN)).toBe(true);
  });

  it("Management cannot manage the team", () => {
    expect(canManageTeam(ROLES.MANAGEMENT)).toBe(false);
  });

  it("Sales cannot manage the team", () => {
    expect(canManageTeam(ROLES.SALES)).toBe(false);
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  isValidRole                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

describe("isValidRole", () => {
  it("recognises all declared roles", () => {
    Object.values(ROLES).forEach((role) => {
      expect(isValidRole(role)).toBe(true);
    });
  });

  it("rejects unknown strings", () => {
    expect(isValidRole("admin")).toBe(false);   // lowercase typo
    expect(isValidRole("ADMIN")).toBe(false);
    expect(isValidRole("")).toBe(false);
    expect(isValidRole(null)).toBe(false);
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  getRoleLabel                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

describe("getRoleLabel", () => {
  it("returns the role string unchanged for known roles", () => {
    expect(getRoleLabel(ROLES.SUPER_ADMIN)).toBe("Super Admin");
    expect(getRoleLabel(ROLES.MANAGEMENT)).toBe("Management");
    expect(getRoleLabel(ROLES.SALES)).toBe("Sales");
  });

  it("returns 'Unknown Role' for falsy values", () => {
    expect(getRoleLabel("")).toBe("Unknown Role");
    expect(getRoleLabel(null)).toBe("Unknown Role");
    expect(getRoleLabel(undefined)).toBe("Unknown Role");
  });
});

/* ────────────────────────────────────────────────────────────────────────── */
/*  Integration scenario: filtering an enquiry list by role                  */
/* ────────────────────────────────────────────────────────────────────────── */

describe("Enquiry list filtering by role (integration scenario)", () => {
  const ENQUIRIES = [
    { id: "ENQ-001", name: "Rahul Sharma",  assignedSalesUsername: "sales.alice"  },
    { id: "ENQ-002", name: "Priya Mehta",   assignedSalesUsername: "sales.bob"    },
    { id: "ENQ-003", name: "Vikram Joshi",  assignedSalesUsername: "sales.alice"  },
    { id: "ENQ-004", name: "Deepa Nair",    assignedSalesUsername: ""             }, // unassigned
  ];

  function filterEnquiriesForUser(allEnquiries, user) {
    if (canSeeAllEnquiries(user.role)) return allEnquiries;
    return allEnquiries.filter(
      (e) => e.assignedSalesUsername === user.username
    );
  }

  it("Management user sees all 4 enquiries", () => {
    const user = { username: "pratik.ubhe", role: ROLES.MANAGEMENT };
    expect(filterEnquiriesForUser(ENQUIRIES, user)).toHaveLength(4);
  });

  it("Super Admin sees all 4 enquiries", () => {
    const user = { username: "admin", role: ROLES.SUPER_ADMIN };
    expect(filterEnquiriesForUser(ENQUIRIES, user)).toHaveLength(4);
  });

  it("Sales user 'sales.alice' sees only her 2 assigned enquiries", () => {
    const user = { username: "sales.alice", role: ROLES.SALES };
    const result = filterEnquiriesForUser(ENQUIRIES, user);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(["ENQ-001", "ENQ-003"]);
  });

  it("Sales user 'sales.bob' sees only his 1 assigned enquiry", () => {
    const user = { username: "sales.bob", role: ROLES.SALES };
    const result = filterEnquiriesForUser(ENQUIRIES, user);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ENQ-002");
  });

  it("Sales user with no assigned enquiries sees an empty list", () => {
    const user = { username: "sales.charlie", role: ROLES.SALES };
    expect(filterEnquiriesForUser(ENQUIRIES, user)).toHaveLength(0);
  });

  it("Sales user cannot see the unassigned enquiry ENQ-004", () => {
    const user = { username: "sales.alice", role: ROLES.SALES };
    const result = filterEnquiriesForUser(ENQUIRIES, user);
    expect(result.find((e) => e.id === "ENQ-004")).toBeUndefined();
  });
});
