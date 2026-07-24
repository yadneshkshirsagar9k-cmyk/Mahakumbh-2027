# Architecture Freeze Document (Version 1.0)
**Mahakumbh Smart Pilgrim Management Platform — Government Credential Platform**

*Document Classification: Official Governance & Technical Reference*  
*Status: FINAL & FROZEN*  
*Version: 1.0.0*  
*Date of Freeze: July 2026*  

---

## 1. Document Objective & Governance Scope

This document serves as the permanent, authoritative architectural baseline and governance contract for **Version 1.0** of the Mahakumbh Smart Pilgrim Management Platform (Simhastha Nashik-Trimbakeshwar 2027).

The primary objective of this governance specification is to establish clear architectural boundaries. It permanently records the core structural decisions, domain models, declarative rendering pipelines, and integration flows that are officially **frozen**. Under no circumstances may these components be redesigned, bypassed, or replaced without incrementing the platform to a major release version (`2.x.x`).

This specification is explicitly structured to distinguish between:
1. **Frozen Architecture**: Core engines, models, and UI grid systems locked for absolute stability.
2. **Extension Points**: Authorized interfaces and boundaries where new functionality can be integrated.
3. **Future Implementation Areas**: Reserved slots for Phase 2+ features.
4. **Out-of-Scope Features**: Explicit exclusions to prevent architectural drift and scope creep.

---

## 2. Frozen Architecture

The following architectural components, design patterns, and module boundaries are frozen in Version 1.0. No alternate document generation systems, duplicate print templates, or parallel rendering paths may be introduced into the codebase.

### 2.1 Single Source of Truth (`OfficialRegistrationRecord`)
- **Canonical Data Model**: All credentials must derive strictly from `OfficialRegistrationRecord` (`types/citizen.types.ts`). This record synthesizes the Citizen Domain, Journey Domain, Medical/Emergency profile, Vehicle Transit clearance, and Accommodation assignment into an immutable registration context.
- **Strict Data Binding**: Every field displayed on every credential must map directly from this context. No mock data, placeholder strings, or ad-hoc state mutations are permitted inside credential rendering components.

### 2.2 Declarative Blueprints System (`CredentialBlueprint`)
- **Declarative Composition**: Credentials are not built as monolithic page templates. Instead, each credential type is defined via a declarative `CredentialBlueprint` (`types/credential.types.ts`) specifying an ordered sequence of standardized **Zones** inside a designated **Layer structure**.
- **Frozen Blueprints**:
  - `RegistrationCertificateBlueprint` (`CredentialType.REGISTRATION_CERTIFICATE`)
  - `PilgrimSmartIdFrontBlueprint` (`CredentialType.PILGRIM_IDENTITY`)
  - `VehiclePassBlueprint` (`CredentialType.VEHICLE_PASS`)
  - `EmergencyMedicalCardBlueprint` (`CredentialType.EMERGENCY_CARD`)

### 2.3 Modular Zone System (`components/credentials/zones/`)
All visual content must be encapsulated within strictly structured, reusable zone components governed by formal tabular layouts and government design aesthetics:
- `GovernmentHeaderZone`: State emblem, official department seals, document title, and reference metadata.
- `IdentityZone`: Primary registrant bio-data, masked Aadhaar/Gov ID, address verification, and clearance status table.
- `JourneyZone`: Pilgrimage dates, sector arrival points, assigned circuits (Ghats/Temples), and transit mode.
- `SecurityZone`: Scannable `QrCodeRenderer`, access authorization level, and cryptographic verification stamps.
- `MedicalEmergencyZone`: Tabular medical flags (Diabetes, Cardiac, Wheelchair, Disability), primary emergency contacts, and sector hospital help desk numbers.
- `VehicleZone`: Vehicle registration number, vehicle classification, transit validity, and allocated outer ring road parking hubs (`P1`–`P5`).
- `AccommodationZone`: Assigned Sadhugram camp, tent allotment, sector zone, and check-in/check-out clearance.
- `AuthorityZone`: Digital signature stamps, verification badges (`NIC / Special Commissioner`), and anti-counterfeit notices.

### 2.4 Unified Rendering & Export Engine (`CredentialRenderingEngine` & `ExportEngine`)
- **Single Rendering Source of Truth**: The `CredentialRenderingEngine` (`components/credentials/engine/CredentialRenderingEngine.tsx`) running inside the Document Viewer is the **only** permitted mechanism for rendering visual credentials.
- **Elimination of Duplication**: The platform strictly forbids duplicate print components, hidden templates, or secondary string-based PDF generation logic (`%PDF-1.4`).
- **Export Engine Contract**: The `ExportEngine` (`components/credentials/export/engine.ts`) directly targets the live DOM node (`viewerRef`) of the `CredentialRenderingEngine` via `BrowserPrintProvider`. When exporting or printing, the browser prints the exact rendered DOM node (`body.is-printing`), ensuring **100% pixel-parity** between the screen preview and printed/exported documents.

### 2.5 Government Design Language & Visual Identity
- **Restrained Color Palette**:
  - Primary: Deep Navy Blue (`#005BAC` / `#0F4C81`)
  - Accent: Saffron (`#FF9933` / `#EA580C`) used sparingly for borders and headers
  - Verification: Deep Green (`#047857` / `#059669`) for active clearance badges
  - Emergency: Dark Red (`#991B1B` / `#DC2626`) for medical/emergency alerts
  - Background: Warm White / Crisp Cream (`#FAFBFC` / `#FFFFFF`)
  - Borders: High-contrast Dark Slate (`#111827` / `#374151`)
- **Typography & Layout**: Tabular `border-collapse` layout hierarchies with explicit font weights and uppercase section headers to resemble official government documentation.

---

## 3. Extension Points

To support continuous evolution while preserving core stability, Version 1.0 defines explicit extension points where new capabilities may be added without violating frozen boundaries:

### 3.1 New Credential Types (`CredentialType` Enum)
Developers may introduce new specialized passes (e.g., `VIP_MEDIA_PASS`, `VOLUNTEER_BADGE`, `SANITATION_ACCESS`) by extending the `CredentialType` enum and registering a corresponding declarative `CredentialBlueprint` in `CredentialStore`.

### 3.2 Custom Zones (`ZoneType` Registry)
New specialized content blocks (e.g., `BiometricVerificationZone`, `RFIDTagZone`) may be added to `ZoneType` and implemented inside `components/credentials/zones/`. They must register cleanly with `ZoneResolver.tsx` and accept `OfficialRegistrationRecord` without mutating it.

### 3.3 New Export Providers (`ExportProvider` Interface)
While `BrowserPrintProvider` (`BrowserPrintProvider.ts`) is frozen as the primary standard for client-side high-fidelity rendering, the `ExportEngine` architecture provides the `ExportProvider` interface (`types/credential.types.ts`). Future server-side rendering pipelines (e.g., headless Chromium or server-side Puppeteer engines for automated batch PDF issuance) can implement this interface without modifying the `CredentialRenderingEngine`.

---

## 4. Future Implementation Areas (Phase 2+)

The following capabilities are recognized as strategic roadmap items and are reserved for post-1.0 implementations (`Version 2.x` / Phase 2+):

1. **Cryptographic PKI Digital Signatures**: Embedding verifiable X.509/PKI digital certificates directly inside exported PDF file headers using government root CAs.
2. **Hardware NFC/RFID Key Generation**: Provisioning smart pilgrim wristbands and vehicle RFID windshield stickers directly from the `SecurityZone` / `VehicleZone` data payloads.
3. **High-Concurrency Offline Queue Sync**: Barricade mobile checkpoint applications utilizing local IndexedDB storage and peer-to-peer mesh synchronization for offline QR validation during peak Simhastha crowd surges.
4. **Multilingual Localized Credential Rendering**: Dynamic switching of blueprint text tokens between English, Marathi, Hindi, and Gujarati inside `ZoneResolver`.

---

## 5. Out-of-Scope Features

To maintain strict domain boundaries and prevent system bloat, the following capabilities are explicitly defined as **out-of-scope** for the Government Credential Platform:

1. **Live GPS Crowd Tracking & Geo-Fencing**: The credential engine renders static authorization tokens and gatepasses; real-time telemetry, live map routing, and crowd density heatmaps belong exclusively to the separate *Command & Control GIS Platform*.
2. **Payment Processing & Gateway Integration**: Registration fee collection, accommodation billing, and commercial transaction processing are strictly isolated in the *Financial Accounting Domain*. Credentials only consume the finalized boolean approval status (`isPaid / isApproved`).
3. **Ad-Hoc User-Customizable Document Layouts**: Pilgrims and field operators cannot modify document borders, move tables, or alter color themes. All credentials must strictly conform to official state blueprints to prevent forgery and maintain uniform standard operating procedures across all Nashik checkpoints.

---

*Signed and Approved by the Architecture Review Board — Simhastha Mahakumbh 2027*
