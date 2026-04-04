/**
 * enquiry.service.js
 *
 * Business logic for the enquiry pipeline.
 *
 * Offline-first strategy:
 *   - Write to localStorage immediately (user sees result instantly).
 *   - Sync to backend async (best-effort, never blocks the UI).
 *
 * This means the CRM always has data even if the API is down,
 * and the backend catches up on the next successful request.
 */

import {
  saveEnquiry,
  updateEnquiry as updateLocalEnquiry,
} from "../data/enquiryStorage";
import { enquiriesApi } from "../api/enquiries.api";

export const enquiryService = {
  /**
   * Create a new enquiry.
   * Saves locally first, then syncs to backend in the background.
   *
   * @param {object} data  { eventName, category, name, phone, email,
   *                         pax, date, source, pageUrl, location, ... }
   * @returns {object} The locally-created enquiry (has id immediately).
   */
  async create(data) {
    // Local write is synchronous — enquiry is immediately available in CRM.
    const enquiry = saveEnquiry(data);

    // Background sync — does not block or throw to the caller.
    enquiriesApi.upsert(enquiry).catch((err) => {
      console.warn("enquiryService.create: backend sync failed —", err.message);
    });

    return enquiry;
  },

  /**
   * Update fields on an existing enquiry (status, tags, assignment, etc.)
   *
   * @param {string} id    Enquiry ID (ENQ-…)
   * @param {object} patch Fields to update
   */
  async update(id, patch) {
    // Apply locally first.
    updateLocalEnquiry(id, patch);

    // Background sync.
    enquiriesApi.update(id, patch).catch((err) => {
      console.warn("enquiryService.update: backend sync failed —", err.message);
    });
  },
};
