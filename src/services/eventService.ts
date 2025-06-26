type EventCallback = () => void;

class EventService {
  private listeners: Map<string, EventCallback[]> = new Map();

  // Subscribe to an event
  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Emit an event
  emit(event: string): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in event callback:', error);
        }
      });
    }
  }

  // Clear all listeners
  clear(): void {
    this.listeners.clear();
  }
}

export const eventService = new EventService();

// Event constants
export const EVENTS = {
  REVIEW_SUBMITTED: 'review_submitted',
  ACTIVITY_CREATED: 'activity_created',
  DATA_UPDATED: 'data_updated'
} as const; 