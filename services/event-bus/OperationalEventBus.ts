import { OperationalEvent } from '@/types/operational-models';

type EventHandler = (event: OperationalEvent) => void;

class OperationalEventBus {
  private subscribers: Map<string, Set<EventHandler>> = new Map();

  subscribe(eventType: string, handler: EventHandler): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(handler);

    return () => {
      const handlers = this.subscribers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  publish(event: OperationalEvent) {
    const handlers = this.subscribers.get(event.eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${event.eventType}:`, error);
        }
      });
    }
    
    const wildcardHandlers = this.subscribers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => handler(event));
    }
  }
}

export const operationalEventBus = new OperationalEventBus();
