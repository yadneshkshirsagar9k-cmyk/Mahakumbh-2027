import { operationalEventBus } from '../event-bus/OperationalEventBus';

export interface OperationalCommand {
  commandId: string;
  type: string;
  payload: any;
  targetService?: string;
  scheduledTime?: number; 
}

export class OperationalCommandEngine {
  private scheduledCommands: Map<string, NodeJS.Timeout> = new Map();

  executeCommand(command: OperationalCommand) {
    if (command.scheduledTime && command.scheduledTime > Date.now()) {
      this.scheduleCommand(command);
    } else {
      this.dispatchCommand(command);
    }
  }

  private dispatchCommand(command: OperationalCommand) {
    try {
      operationalEventBus.publish({
        eventId: `cmd-complete-${command.commandId}`,
        eventType: 'COMMAND_COMPLETED',
        timestamp: Date.now(),
        payload: { commandId: command.commandId, status: 'success' },
        source: 'OperationalCommandEngine'
      });
    } catch (error) {
      operationalEventBus.publish({
        eventId: `cmd-failed-${command.commandId}`,
        eventType: 'COMMAND_FAILED',
        timestamp: Date.now(),
        payload: { commandId: command.commandId, error },
        source: 'OperationalCommandEngine'
      });
    }
  }

  private scheduleCommand(command: OperationalCommand) {
    const delay = command.scheduledTime! - Date.now();
    const timeout = setTimeout(() => {
      this.dispatchCommand(command);
      this.scheduledCommands.delete(command.commandId);
    }, delay);
    this.scheduledCommands.set(command.commandId, timeout);
  }

  cancelScheduledCommand(commandId: string) {
    const timeout = this.scheduledCommands.get(commandId);
    if (timeout) {
      clearTimeout(timeout);
      this.scheduledCommands.delete(commandId);
    }
  }
}

export const operationalCommandEngine = new OperationalCommandEngine();
