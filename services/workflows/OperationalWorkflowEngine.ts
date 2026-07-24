import { operationalEventBus } from '../event-bus/OperationalEventBus';
import { OperationalEvent } from '@/types/operational-models';

export interface WorkflowStep {
  id: string;
  action: (event: OperationalEvent) => void;
  nextStepId?: string;
}

export interface WorkflowDefinition {
  id: string;
  triggerEventType: string;
  steps: Record<string, WorkflowStep>;
  initialStepId: string;
}

export class OperationalWorkflowEngine {
  private workflows: Map<string, WorkflowDefinition> = new Map();

  constructor() {
    operationalEventBus.subscribe('*', (event) => {
      this.workflows.forEach(workflow => {
        if (workflow.triggerEventType === event.eventType || workflow.triggerEventType === '*') {
          this.executeWorkflow(workflow, event);
        }
      });
    });
  }

  registerWorkflow(workflow: WorkflowDefinition) {
    this.workflows.set(workflow.id, workflow);
  }

  private executeWorkflow(workflow: WorkflowDefinition, event: OperationalEvent) {
    let currentStepId: string | undefined = workflow.initialStepId;
    
    while (currentStepId && workflow.steps[currentStepId]) {
      const step: WorkflowStep = workflow.steps[currentStepId];
      try {
        step.action(event);
        currentStepId = step.nextStepId;
      } catch (error) {
        console.error(`Workflow ${workflow.id} failed at step ${currentStepId}:`, error);
        break; 
      }
    }
  }
}

export const operationalWorkflowEngine = new OperationalWorkflowEngine();
