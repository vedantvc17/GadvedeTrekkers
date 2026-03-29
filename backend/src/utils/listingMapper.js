export function mapListingRowToLocal(row) {
  const base = {
    id: row.id,
    status: row.status,
    submittedAt: row.submitted_at,
    adminNotes: row.admin_notes || "",
    email: row.email || "",
    phone: row.phone || "",
    location: row.location || "",
    description: row.description || "",
  };

  if (row.submission_type === "event") {
    return {
      ...base,
      eventName: row.title,
      eventType: row.subtype || "",
      organizerName: row.contact_name,
      eventDate: row.event_date || "",
      expectedAttendees: row.expected_attendees || "",
      entryFee: row.entry_fee || "",
      pickupPoints: row.pickup_points || [],
    };
  }

  if (row.submission_type === "property") {
    return {
      ...base,
      propertyName: row.title,
      type: row.subtype || "",
      ownerName: row.contact_name,
      capacity: row.capacity || "",
      pricePerNight: row.price_per_night || "",
      amenities: row.amenities || [],
      photos: row.images || [],
    };
  }

  return {
    ...base,
    campsiteName: row.title,
    ownerName: row.contact_name,
    nearbyTrek: row.nearby_trek || "",
    capacity: row.capacity || "",
    pricePerPerson: row.price_per_person || "",
    facilities: row.facilities || [],
    photos: row.images || [],
  };
}
