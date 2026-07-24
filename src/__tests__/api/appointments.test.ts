// Tests unitaires pour la validation des créneaux de Rendez-vous

export function isSlotAvailable(
  existingAppointments: { startAt: Date; endAt: Date }[],
  newStart: Date,
  newEnd: Date
): boolean {
  for (const appt of existingAppointments) {
    if (newStart < appt.endAt && newEnd > appt.startAt) {
      return false;
    }
  }
  return true;
}

export function runAppointmentsTests() {
  const existingAppts = [
    { startAt: new Date('2026-07-18T10:00:00Z'), endAt: new Date('2026-07-18T11:00:00Z') },
    { startAt: new Date('2026-07-18T14:00:00Z'), endAt: new Date('2026-07-18T15:00:00Z') }
  ];

  const slotStartFree = new Date('2026-07-18T11:30:00Z');
  const slotEndFree = new Date('2026-07-18T12:30:00Z');
  console.assert(isSlotAvailable(existingAppts, slotStartFree, slotEndFree) === true, 'Slot should be free');

  const slotStartOverlap = new Date('2026-07-18T10:30:00Z');
  const slotEndOverlap = new Date('2026-07-18T11:30:00Z');
  console.assert(isSlotAvailable(existingAppts, slotStartOverlap, slotEndOverlap) === false, 'Slot should be blocked');
}
