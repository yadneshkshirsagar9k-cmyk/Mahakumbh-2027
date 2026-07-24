import type { ExportProvider, ExportJob, ExportProviderResult } from '@/types/export.types';
import { ExportTarget } from '@/types/export.types';

/**
 * STUB: Handles true client-side PDF generation (e.g. via html2canvas + jspdf).
 * Allows downloading a PDF directly without invoking window.print().
 */
export class ClientPdfProvider implements ExportProvider {
  providerId = 'client-jspdf-generator';
  supportedTargets = [ExportTarget.PDF];

  async execute(job: ExportJob, htmlElement?: HTMLElement): Promise<ExportProviderResult> {
    // Implementation placeholder for future PDF library integration
    return {
      success: false,
      jobId: job.id,
      error: 'ClientPdfProvider is not yet fully implemented. Use BrowserPrintProvider for now.'
    };
  }
}
