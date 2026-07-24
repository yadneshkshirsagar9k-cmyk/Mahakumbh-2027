import type { ExportJob, ExportManifest, ExportProvider, ExportProviderResult } from '@/types/export.types';
import { ExportJobStatus, ExportTarget } from '@/types/export.types';
import { BrowserPrintProvider } from './providers/BrowserPrintProvider';
import { ClientPdfProvider } from './providers/ClientPdfProvider';
import { FileNamingStrategy } from './FileNamingStrategy';

class ExportEngineCore {
  private providers: ExportProvider[] = [];

  constructor() {
    this.registerProvider(new BrowserPrintProvider());
    this.registerProvider(new ClientPdfProvider());
  }

  registerProvider(provider: ExportProvider) {
    this.providers.push(provider);
  }

  createJob(manifest: Omit<ExportManifest, 'jobId' | 'outputFilename'>): ExportJob {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Assign filename if not present
    const extension = manifest.exportTarget === ExportTarget.PDF ? 'pdf' : manifest.exportTarget === ExportTarget.PNG ? 'png' : 'html';
    
    const fullManifest: ExportManifest = {
      ...manifest,
      jobId,
      outputFilename: FileNamingStrategy.generateFilename(manifest as unknown as ExportManifest, extension)
    };

    return {
      id: jobId,
      manifest: fullManifest,
      status: ExportJobStatus.PENDING,
      createdAt: Date.now()
    };
  }

  async executeJob(job: ExportJob, htmlElement?: HTMLElement): Promise<ExportProviderResult> {
    job.status = ExportJobStatus.EXPORTING;
    
    // Find provider
    // If target is PDF, we currently route to BrowserPrintProvider to let user "Save as PDF",
    // unless ClientPdfProvider becomes active in the future.
    let provider = this.providers.find(p => p.supportedTargets.includes(job.manifest.exportTarget));
    
    // Force BrowserPrintProvider for PDF right now since ClientPDF is stubbed
    if (job.manifest.exportTarget === ExportTarget.PDF) {
       provider = this.providers.find(p => p.providerId === 'browser-native-print');
    }

    if (!provider) {
      job.status = ExportJobStatus.FAILED;
      job.error = `No provider found for target ${job.manifest.exportTarget}`;
      return { success: false, jobId: job.id, error: job.error };
    }

    try {
      const result = await provider.execute(job, htmlElement);
      if (result.success) {
        job.status = ExportJobStatus.COMPLETED;
        job.completedAt = Date.now();
      } else {
        job.status = ExportJobStatus.FAILED;
        job.error = result.error;
      }
      return result;
    } catch (e: any) {
      job.status = ExportJobStatus.FAILED;
      job.error = e.message;
      return { success: false, jobId: job.id, error: e.message };
    }
  }
}

export const ExportEngine = new ExportEngineCore();
