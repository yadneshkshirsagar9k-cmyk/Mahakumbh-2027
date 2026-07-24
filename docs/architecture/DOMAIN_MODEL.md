# Domain Model

The data architecture is heavily normalized into specific domains to prevent data duplication.

## 1. Citizen Domain
**Purpose:** The authoritative source for human identity.
**Key Entities:**
- `CitizenProfile`: Core demographics, address, and Government IDs.
- `PilgrimProfile`: Accompanying members linked to the primary citizen.
- `MedicalProfile`: Critical health and accessibility data.
- `EmergencyContacts`: Next-of-kin information.

## 2. Journey Domain
**Purpose:** The authoritative source for temporal and spatial event data.
**Key Entities:**
- `JourneyMetadata`: Arrival dates, exit zones, route allocations.
- `VehicleInformation`: Vehicle type, registration, driver details, parking allocation.
- `AccommodationDetails`: Assigned camp, sector, and check-in dates.
- `SnanBooking` & `DarshanBooking`: Time-slotted temple and ghat reservations.

## 3. Government Applications
**Purpose:** Workflow states for issuing permits.
**Key Entities:**
- `GovernmentApplication`: Tracks the lifecycle (Draft -> Submitted -> Under Review -> Approved).
- `TimelineEvent`: Audit trail of all state transitions.

## 4. Registration Aggregation (`OfficialRegistrationRecord`)
Because Credentials require data from multiple domains, this read-only projection aggregates Citizen, Journey, and Application data into a single, highly structured context object. This ensures the Rendering Engine never has to orchestrate data fetching.

## 5. Credential Registry
**Purpose:** Tracks the issuance and lifecycle of the physical/digital documents.
**Key Entities:**
- `GovernmentCredential`: An immutable record tracking versioning, issue dates, revocation status, and print metrics.
