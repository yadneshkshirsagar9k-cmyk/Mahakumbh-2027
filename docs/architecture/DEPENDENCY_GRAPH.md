# Dependency Graph

The Government Credential Framework enforces a strict, unidirectional dependency flow.

## 1. Domain -> Aggregation
`CitizenStore` and `JourneyStore` are completely unaware of credentials. The `OfficialRegistrationRecord` depends on the Domain models to aggregate data.

## 2. Configuration -> Rendering
`CredentialRenderingEngine` depends on `CredentialSpecs`, `DocumentTokens`, and `DeclarativeBlueprints`. It does *not* contain business logic, it only reads configurations.

## 3. UI Zones -> Tokens
Components inside `components/credentials/zones/` depend strictly on `DocumentTokens`. They are forbidden from using arbitrary hardcoded hex codes or padding values.

## 4. Export -> Rendering
The `ExportEngine` depends on the `RenderingEngine` to provide a finished DOM tree. The Rendering Engine has zero knowledge of printing, PDFs, or exporting.

## Architectural Boundaries
- **Strict Boundary:** UI Components (`zones/`) cannot import `store/` directly. They must receive data via props from the `ZoneResolver`.
- **Strict Boundary:** `ExportProviders` cannot modify the credential payload. They only handle serialization/printing.
