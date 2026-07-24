/**
 * @file Registration ID Generators
 * @description Stable Government ID generation utilities responsible for generating
 * immutable official identifiers exactly once during initial registration.
 *
 * All IDs follow Indian Government naming conventions for the
 * Nashik–Trimbakeshwar Mahakumbh 2027 registration system.
 *
 * These IDs MUST be generated once and stored permanently.
 * They MUST NOT be regenerated on subsequent edits.
 */

/**
 * Generate a random numeric string of specified length.
 */
function randomDigits(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  // Ensure first digit is not 0 for readability
  if (result.startsWith('0')) {
    result = (Math.floor(Math.random() * 9) + 1).toString() + result.slice(1);
  }
  return result;
}

/**
 * Generate a Journey ID.
 * Format: MK-JR-2027-XXXXXX
 * Example: MK-JR-2027-004583
 */
export function generateJourneyId(): string {
  return `MK-JR-2027-${randomDigits(6)}`;
}

/**
 * Generate a Registration Number.
 * Format: REG-MH-2027-XXXXXXX
 * Example: REG-MH-2027-8159534
 */
export function generateRegistrationNumber(): string {
  return `REG-MH-2027-${randomDigits(7)}`;
}

/**
 * Generate a Permit Number.
 * Format: PMT-NMK-2027-XXXXXX
 * Example: PMT-NMK-2027-001264
 */
export function generatePermitNumber(): string {
  return `PMT-NMK-2027-${randomDigits(6)}`;
}

/**
 * Generate a Vehicle Pass ID.
 * Format: VP-MH27-XXXXX
 * Example: VP-MH27-00485
 */
export function generateVehiclePass(): string {
  return `VP-MH27-${randomDigits(5)}`;
}

/**
 * Generate an Emergency Sheet ID.
 * Format: EMS-2027-XXXXX
 * Example: EMS-2027-11265
 */
export function generateEmergencySheet(): string {
  return `EMS-2027-${randomDigits(5)}`;
}

/**
 * Pilgrim ID counter — used to generate sequential Pilgrim IDs within a session.
 * In production this would be server-managed.
 */
let pilgrimCounter = 0;

/**
 * Generate a Government-style Pilgrim ID.
 * Format: PID-MHK-2027-XXXXXX
 * Example: PID-MHK-2027-000001
 *
 * Uses a combination of a session counter and random digits
 * to ensure uniqueness without a backend.
 */
export function generatePilgrimId(): string {
  pilgrimCounter++;
  // Combine counter with random component for uniqueness
  const counterPart = pilgrimCounter.toString().padStart(3, '0');
  const randomPart = randomDigits(3);
  return `PID-MHK-2027-${counterPart}${randomPart}`;
}

/**
 * Reset the pilgrim counter (useful for testing).
 */
export function resetPilgrimCounter(): void {
  pilgrimCounter = 0;
}

/**
 * Initialize the pilgrim counter from existing pilgrims.
 * Call this during store hydration to ensure new IDs don't collide.
 */
export function initPilgrimCounter(existingCount: number): void {
  pilgrimCounter = Math.max(pilgrimCounter, existingCount);
}
