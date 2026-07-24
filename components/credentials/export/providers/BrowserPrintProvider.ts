import type { ExportProvider, ExportJob, ExportProviderResult } from '@/types/export.types';
import { ExportTarget } from '@/types/export.types';

/**
 * Handles ExportTarget.PRINT using the browser's native window.print() API.
 * 
 * This provider receives the VIEWER DOM element directly — the exact same
 * element the user sees in the Document Viewer. No hidden copy is created.
 * The CSS @media print rules isolate .credential-viewer for printing.
 */
export class BrowserPrintProvider implements ExportProvider {
  providerId = 'browser-native-print';
  supportedTargets = [ExportTarget.PRINT, ExportTarget.PDF]; // Browsers can "Save as PDF" via print

  async execute(job: ExportJob, htmlElement?: HTMLElement): Promise<ExportProviderResult> {
    if (!htmlElement) {
      return { success: false, jobId: job.id, error: 'BrowserPrintProvider requires an HTML element to print.' };
    }

    try {
      // The htmlElement IS the Document Viewer — tag body for CSS print isolation
      document.body.classList.add('is-printing');

      // Wait a tick for CSS to apply and images/canvas to stabilize
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Trigger native print dialog — CSS rules will show only .credential-viewer
      window.print();
      
      // Cleanup
      document.body.classList.remove('is-printing');

      return {
        success: true,
        jobId: job.id,
      };
    } catch (err: any) {
      document.body.classList.remove('is-printing');
      return {
        success: false,
        jobId: job.id,
        error: err.message || 'Failed to execute browser print.'
      };
    }
  }
}
