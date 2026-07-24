import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ExportJob } from '@/types/export.types';
import { ExportEngine } from './ExportEngine';
import { CredentialRenderingEngine } from '../engine/CredentialRenderingEngine';
import { RenderingContextData } from '@/types/rendering.types';
import { DeclarativeBlueprint } from '@/types/rendering.types';

interface Props {
  job: ExportJob | null;
  blueprint: DeclarativeBlueprint | null;
  contextData: RenderingContextData | null;
  onComplete: (success: boolean) => void;
}

/**
 * A hidden container that dynamically renders a credential only when an ExportJob is dispatched.
 * It waits for the render to complete, then passes the DOM node to the ExportEngine.
 */
export function HiddenCredentialRenderer({ job, blueprint, contextData, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (job && blueprint && contextData && containerRef.current && mounted) {
      // Small timeout to let React flush the DOM
      const timer = setTimeout(() => {
        ExportEngine.executeJob(job, containerRef.current!)
          .then(result => onComplete(result.success))
          .catch(() => onComplete(false));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [job, blueprint, contextData, mounted, onComplete]);

  if (!mounted || !job || !blueprint || !contextData) return null;

  // We portal this to the body so it sits outside the normal React tree flow
  // It is visually hidden from screen readers and normal users, but visible to print media via CSS
  return createPortal(
    <div 
      ref={containerRef} 
      className="hidden-credential-portal"
      aria-hidden="true"
    >
      <div className="print-canvas shadow-xl bg-white" style={{ 
        width: job.manifest.printProfile.format === 'a4' ? '210mm' : '148mm', 
        height: job.manifest.printProfile.format === 'a4' ? '297mm' : '210mm',
        position: 'relative'
      }}>
        <CredentialRenderingEngine 
          blueprint={blueprint}
          contextData={contextData}
        />
      </div>
    </div>,
    document.body
  );
}
