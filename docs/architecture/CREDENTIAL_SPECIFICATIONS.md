# Credential Specifications

The platform supports six official credentials, strictly defined in `config/credential-specs.ts`.

## 1. Registration Certificate
- **Purpose:** Primary proof of registered pilgrimage.
- **Format:** A4
- **Zones:** Header, Identity, Journey, Medical, Security, Authority.
- **Security:** Watermark, QR, Seal.

## 2. Pilgrim Smart ID
- **Purpose:** Portable identity verification for individuals.
- **Format:** ID Card (Landscape)
- **Zones:** Front (Header, Identity, QR), Back (Journey, Authority).
- **Security:** Watermark, QR, Seal.

## 3. Vehicle Pass
- **Purpose:** Authorizes vehicle entry into specific zones.
- **Format:** A5 (Dashboard display)
- **Zones:** Header, Identity, Journey, Vehicle, Security, Authority.
- **Design Philosophy:** Distance-readable typography.

- **Format:** A5
- **Zones:** Header, Vehicle, Security, Authority.
- **Design Philosophy:** Zone-first hierarchy.

## 5. Accommodation Pass
- **Purpose:** Proof of stay booking at Tent Cities/Ashrams.
- **Format:** A4
- **Zones:** Header, Identity, Journey (Accommodation), Security, Authority.

## 6. Emergency Medical Card
- **Purpose:** Critical medical and contact info for first responders.
- **Format:** ID Card
- **Zones:** Header, Identity (Medical focus), Security.
- **Security:** No watermark (to ensure 100% legibility of blood group and allergies).
