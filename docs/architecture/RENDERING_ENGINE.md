# Rendering Engine

The Rendering Engine (`CredentialRenderingEngine.tsx`) is a declarative pipeline that transforms data into visual React nodes without hardcoded conditional logic.

## 1. Rendering Context
The engine receives a `RenderingContextData` object containing:
- `credential` (The ID and metadata)
- `citizen` & `journey` (The raw data)
- `renderProfile` (e.g. `CITIZEN_PRINT`, `VERIFICATION_VIEW`)
- `format` (e.g. `a4`, `idCard`)

## 2. Blueprint Validation
Before rendering, `BlueprintValidator.ts` checks the active `DeclarativeBlueprint` against the `CredentialSpecification`. If the Spec requires `VehicleData` but the Blueprint omits the `VEHICLE` zone, rendering aborts.

## 3. Visibility Rules (`VisibilityEngine.ts`)
Each Zone in a Blueprint defines `visibilityRules`. The Visibility Engine evaluates these rules against the Context. If `requiredData: ['journey']` is declared but the context has no journey, the zone is safely hidden.

## 4. Zone Resolution (`ZoneResolver.tsx`)
The Resolver iterates over the validated, visible zones and maps `DocumentZoneType` (e.g., `DocumentZoneType.HEADER`) to the actual React component (`<GovernmentHeaderZone />`), passing in the exact slice of data it needs.

## 5. Rendering Manifest
The output of this pipeline is a `RenderingManifest`, which includes the validation state and the fully resolved array of React Nodes ready to be painted to the DOM.
