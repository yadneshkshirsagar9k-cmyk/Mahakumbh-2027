# TypeScript Guidelines

1. **No `any`:** The use of `any` is strictly prohibited in the Credential Framework. Use generics or `unknown` if a type is truly dynamic.
2. **Exported Types:** All domain types must reside in the `types/` directory. Do not define business interfaces inline inside React components.
3. **Readonly Configurations:** Blueprints and Specifications should be defined as `const` or `Readonly<>` to enforce immutability at compile time.
