# Government Credential Platform

The Government Credential Platform is the core engine responsible for turning citizen data into official, verifiable documents.

## Credential Lifecycle
1. **Trigger:** A Government Application is Approved.
2. **Generation:** The `DocumentFactory` creates a new `GovernmentCredential` record.
3. **Storage:** The credential is saved in the Credential Repository (immutable).
4. **Rendering:** The UI requests a render; the Engine evaluates the Blueprint and Context.
5. **Export:** The user requests a print; the Export Engine dispatches to a Provider.
6. **Audit:** Every print/download/view is recorded in the credential's `timeline`.

## Credential Storage (Repository)
Credentials are treated as immutable records. If a Citizen's name changes, a *new* credential version is generated, and the old version is marked as `SUPERSEDED`. 

## Public Contracts
The platform operates on strict TypeScript interfaces:
- `GovernmentCredential`: The database record.
- `CredentialSpecification`: The business rules defining what a credential *must* contain (e.g. "Vehicle Pass requires Vehicle Info").
- `OfficialRegistrationRecord`: The data payload.
