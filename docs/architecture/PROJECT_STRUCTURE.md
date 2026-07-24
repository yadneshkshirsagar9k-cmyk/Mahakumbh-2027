# Project Structure

```text
c:\Users\prite\OneDrive\Desktop\my-shirdi-ws\
├── app/                      # Next.js App Router endpoints (Pages, Layouts)
│   └── account/              # Citizen Dashboard UI
├── components/               # React Components
│   └── credentials/          # Core Credential Framework
│       ├── blueprints/       # Declarative layout configurations
│       ├── engine/           # Rendering pipeline (Validator, Resolver)
│       ├── export/           # Export pipeline (Providers, HiddenRenderer)
│       ├── layers/           # Background, Watermark, and Seal overlays
│       └── zones/            # Official Government UI blocks (Header, Identity)
├── config/                   # Static Business Rules & Design Tokens
│   ├── credential-specs.ts   # Defines what each credential requires
│   └── document-tokens.ts    # Single source of truth for colors, typography
├── store/                    # Zustand State Management (Immutable domains)
│   ├── citizen-store.ts      
│   └── journey-store.ts      
├── types/                    # Strict TypeScript Interfaces
│   ├── citizen.types.ts      
│   ├── credential.types.ts   
│   ├── rendering.types.ts    
│   └── export.types.ts       
└── docs/                     # Architecture and Development Documentation
```
