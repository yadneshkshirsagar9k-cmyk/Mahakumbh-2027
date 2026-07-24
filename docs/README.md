# Mahakumbh Smart Pilgrim Management Platform — Version 1.0 Documentation

Welcome to the official documentation repository for **Version 1.0** of the **Mahakumbh Smart Pilgrim Management Platform (Simhastha Nashik-Trimbakeshwar 2027)**.

## Governance & Stability Notice
The Version 1.0 architecture is **OFFICIALLY FROZEN**. 
All core modules, data structures, declarative blueprints, zone layouts, and rendering engines documented within this folder represent the definitive, stable release for the Government Credential Platform. No modifications, architectural redesigns, or duplicate pipelines are permitted within the 1.x lifecycle without a formal major version increment.

---

## Directory Structure

```
docs/
├── README.md                                # This document (Index & Governance Overview)
└── architecture/
    ├── ARCHITECTURE_FREEZE_v1.0.md          # Permanent architectural freeze and governance specification
    └── SYSTEM_OVERVIEW.md                   # Detailed technical breakdown of modules, data flows, and engines
```

---

## Key Documentation Guide

### 1. [Architecture Freeze Document (Version 1.0)](./architecture/ARCHITECTURE_FREEZE_v1.0.md)
The **Architecture Freeze Document (`ARCHITECTURE_FREEZE_v1.0.md`)** serves as the authoritative governance reference for all developers, system integrators, and auditors working on the platform. It defines:
- **Frozen Architecture**: Core engines, models, and zone systems locked for stability.
- **Extension Points**: Authorized interfaces (`DeclarativeBlueprint`, `Zone`, `CredentialType`) for extending functionality without breaking core contracts.
- **Future Implementation Areas**: Reserved slots for Phase 2+ features (e.g., hardware NFC key generation, high-concurrency offline queue sync).
- **Out-of-Scope Features**: Explicit exclusions from the 1.0 boundary to prevent scope creep and maintain architectural clarity.

### 2. [System Overview](./architecture/SYSTEM_OVERVIEW.md)
The **System Overview (`SYSTEM_OVERVIEW.md`)** provides technical details of the unified platform architecture:
- **Single Source of Truth Integration Flow**: How real data flows from `OfficialRegistrationRecord` down through declarative blueprints into the Document Viewer and out through the Export Engine.
- **Zone & Layer System**: The modular, high-contrast, government-compliant UI grid system (`IdentityZone`, `JourneyZone`, `SecurityZone`, `VehicleZone`, `AccommodationZone`, `MedicalEmergencyZone`, `AuthorityZone`).
- **Export Engine Pipeline**: The browser-native DOM print isolation mechanism (`BrowserPrintProvider`) that guarantees 100% visual parity between screen previews and exported PDF/print output.

---

## Architectural Principles (Version 1.0)

1. **Single Source of Truth (`OfficialRegistrationRecord`)**
   All displayed credentials—whether viewed on mobile, inspected by barricade officers, or exported as formal state documents—originate from one canonical registration record. No dummy placeholders or duplicate templates exist in the rendering pipeline.

2. **Declarative Blueprints & Zone System**
   Credentials are defined declaratively by assembling standardized **Zones** (`Header`, `Identity`, `Journey`, `Security`, `Medical/Emergency`, `Vehicle`, `Accommodation`, `Authority`) within responsive **Layers** (`DocumentBackgroundLayer`, `WatermarkLayer`).

3. **Unified Rendering & Export Engine**
   The platform enforces a single rendering pipeline:
   `OfficialRegistrationRecord` → `Declarative Blueprint` → `CredentialRenderingEngine` (Document Viewer) → `ExportEngine` → `BrowserPrintProvider` → Pixel-Identical PDF/Print.

---

*Verified & Sealed by the Government Credential Engineering Team — Version 1.0 (2026)*
