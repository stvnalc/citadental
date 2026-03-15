const prisma = require('../config/db');

/**
 * Parse "HH:MM" to total minutes since midnight
 */
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert total minutes to "HH:MM"
 */
function minutesToTime(mins) {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Get available time slots for a given date and service duration.
 * Takes into account:
 * - Clinic hours for that day of week
 * - Schedule blocks
 * - Existing appointments (non-cancelled)
 * - Service duration
 *
 * Returns array of { startTime, endTime } slots
 */
async function getAvailableSlots(dateStr, serviceDuration) {
  const date = new Date(dateStr + 'T00:00:00Z');
  const dayOfWeek = date.getUTCDay(); // 0=Sun

  // 1. Get clinic hours for this day
  const clinicHours = await prisma.clinicHours.findUnique({
    where: { dayOfWeek },
  });

  if (!clinicHours || !clinicHours.isOpen) {
    return [];
  }

  const openMinutes = timeToMinutes(clinicHours.openTime);
  const closeMinutes = timeToMinutes(clinicHours.closeTime);

  // 2. Get schedule blocks for this date
  const blocks = await prisma.scheduleBlock.findMany({
    where: { date },
  });

  // 3. Get existing non-cancelled appointments for this date
  const appointments = await prisma.appointment.findMany({
    where: {
      date,
      status: { not: 'cancelled' },
    },
  });

  // Build list of occupied intervals [startMin, endMin]
  const occupied = [];

  for (const block of blocks) {
    occupied.push([timeToMinutes(block.startTime), timeToMinutes(block.endTime)]);
  }

  for (const appt of appointments) {
    occupied.push([timeToMinutes(appt.startTime), timeToMinutes(appt.endTime)]);
  }

  // Sort occupied by start
  occupied.sort((a, b) => a[0] - b[0]);

  // 4. Generate slots at 30-min intervals within clinic hours
  const slotInterval = 30; // minutes
  const duration = serviceDuration || 30;
  const slots = [];

  for (let start = openMinutes; start + duration <= closeMinutes; start += slotInterval) {
    const end = start + duration;

    // Check overlap with any occupied interval
    const hasConflict = occupied.some(
      ([occStart, occEnd]) => start < occEnd && end > occStart
    );

    if (!hasConflict) {
      slots.push({
        startTime: minutesToTime(start),
        endTime: minutesToTime(end),
      });
    }
  }

  return slots;
}

module.exports = { getAvailableSlots, timeToMinutes, minutesToTime };
