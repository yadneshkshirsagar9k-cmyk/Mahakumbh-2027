# Coding Standards

## 1. Configuration-Driven Architecture
Avoid hardcoding `if/else` logic for features. If a credential needs a new behavior, attach it to the `CredentialSpecification` or the `DeclarativeBlueprint`.

## 2. Component Philosophy
React components in this project must remain "dumb".
- Zones (`IdentityZone`) only accept props and render UI.
- They must not fetch data, manage state, or evaluate business rules.

## 3. Separation of Concerns
Never mix layout generation with export logic. If you need to add a PDF export feature, write a new `ExportProvider`. Do not modify the `RenderingEngine`.

## 4. Immutability
All records in the `store/` and `types/` are considered immutable. If a citizen's data changes, a *new* timeline event is pushed, and the credential version is incremented.

## 5. Type Safety
Use strictly typed enums (`CredentialType`, `DocumentZoneType`) instead of magic strings. Every component prop must be backed by an interface from the `types/` directory.
