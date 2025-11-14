export type EventHandler<T> = {
  handle: (event: T) => Promise<void>;
};

export class EventBus {
  private handlers = new Map<string, EventHandler<any>[]>();

  subscribe<T>(eventType: new (...args: any[]) => T, handler: EventHandler<T>) {
    const eventName = eventType.name;

    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName)!.push(handler);
  }

  async publish<T extends object>(event: T) {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];
    await Promise.allSettled(handlers.map((handler) => handler.handle(event)));
  }
}

export const eventBus = new EventBus();
