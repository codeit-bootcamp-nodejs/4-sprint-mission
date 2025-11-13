import type { ProductProps } from './product.type.js';

export class PriceUpdateEvent {
  constructor(
    public readonly productId: number,
    public readonly name: string,
    public readonly oldPrice: number,
    public readonly newPrice: number,
    public readonly updatedAt: Date = new Date(),
  ) {}
}

export class Product {
  private _price: number;
  private domainEvents: PriceUpdateEvent[] = [];

  constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this._price = props.price;
    this.userId = props.userId;
  }

  public readonly id: number;
  public readonly name: string;
  public readonly userId: number;

  get price(): number {
    return this._price;
  }

  updatePrice(newPrice: number): void {
    const oldPrice = this._price;
    this._price = newPrice;
    this.domainEvents.push(new PriceUpdateEvent(this.id, this.name, oldPrice, newPrice));
  }

  getDomainEvents() {
    return [...this.domainEvents];
  }

  clearDomainEvents() {
    this.domainEvents = [];
  }
}
