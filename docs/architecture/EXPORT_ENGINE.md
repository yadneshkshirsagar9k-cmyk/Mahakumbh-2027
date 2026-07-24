# Export Engine

The Export Engine separates the act of *drawing* a document from the act of *saving/printing* it.

## 1. Hidden Rendering (`HiddenCredentialRenderer.tsx`)
To prevent the main UI from distorting print layouts, the Export Engine uses a React Portal to mount the credential into a hidden `<iframe>` or off-screen `<div>` attached directly to `document.body`. This guarantees perfect CSS `@media print` isolation.

## 2. Export Manifest and Jobs
When an export is triggered, the system constructs an `ExportJob` containing an `ExportManifest`. The Manifest defines:
- The target format (A4, ID Card)
- The credential ID
- The desired filename (generated via `FileNamingStrategy`)
- The required provider

## 3. Export Providers
The engine uses the Adapter Pattern. 
- **BrowserPrintProvider:** Invokes native `window.print()` targeting the hidden container.
- **Future Providers:** The interfaces `ClientPdfProvider` (e.g. jsPDF) and `ServerPdfProvider` (e.g. Puppeteer) are defined as extension points for Phase 3+.

## 4. Print Profiles
CSS is heavily optimized via `@media print` to ensure background colors, watermarks, and high-contrast QR codes survive the transition to physical paper.
