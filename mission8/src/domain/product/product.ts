export class PriceUpdateEvent {
  constructor(
    public readonly productId: number,
    public readonly oldPrice: number,
    public readonly newPrice: number,
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class Product {
  private _price: number;
  private domainEvents: any[] = [];

  constructor(
    public readonly id: number,
    public name: string,
    price: number,
    public readonly userId: number,
  ) {
    this._price = price;
  }

  get price(): number {
    return this._price;
  }

  updatePrice(newPrice: number): void {
    const oldPrice = this._price;
    this._price = newPrice;
    this.domainEvents.push(new PriceUpdateEvent(this.id, oldPrice, newPrice));
  }

  getDomainEvents() {
    return [...this.domainEvents];
  }

  clearDomainEvents() {
    this.domainEvents = [];
  }
}
