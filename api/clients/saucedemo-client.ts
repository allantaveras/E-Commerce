import { APIRequestContext, APIResponse } from '@playwright/test';
import { ENV } from '../../utils/env';

export class MockAPIResponse implements Partial<APIResponse> {
  private _status: number;
  private _body: any;
  private _headers: Record<string, string>;

  constructor(status: number, body: any, headers: Record<string, string> = { 'content-type': 'application/json; charset=utf-8' }) {
    this._status = status;
    this._body = body;
    this._headers = headers;
  }

  status(): number { return this._status; }
  statusText(): string { return this._status === 200 ? 'OK' : 'Bad Request'; }
  ok(): boolean { return this._status >= 200 && this._status < 300; }
  async json(): Promise<any> { return this._body; }
  async text(): Promise<string> { return JSON.stringify(this._body); }
  headers(): Record<string, string> { return this._headers; }
  async body(): Promise<Buffer> { return Buffer.from(JSON.stringify(this._body)); }
  url(): string { return ''; }
  dispose(): Promise<void> { return Promise.resolve(); }
}

export class SaucedemoClient {
  readonly request: APIRequestContext;
  readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    // We mock the API layer for SauceDemo since it's a frontend-heavy application.
    // The base URL can be https://www.saucedemo.com/api (mocked).
    this.baseUrl = ENV.API_BASE_URL;
  }

  // --- Mocked API Endpoints ---

  async login(username: string, password?: string): Promise<APIResponse> {
    if (!username || !password) {
      return new MockAPIResponse(400, { error: 'Username and password are required' }) as unknown as APIResponse;
    }
    if (username === 'locked_out_user') {
       return new MockAPIResponse(401, { error: 'Sorry, this user has been locked out.' }) as unknown as APIResponse;
    }
    return new MockAPIResponse(200, { token: 'mock-session-token-sauce', username }) as unknown as APIResponse;
  }

  async getProducts(): Promise<APIResponse> {
    const products = [
      { id: 1, name: 'Sauce Labs Backpack', description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.', price: 29.99, imageUrl: '/img/sauce-backpack.jpg' },
      { id: 2, name: 'Sauce Labs Bike Light', description: "A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.", price: 9.99, imageUrl: '/img/bike-light.jpg' },
      { id: 3, name: 'Sauce Labs Bolt T-Shirt', description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.', price: 15.99, imageUrl: '/img/bolt-shirt.jpg' }
    ];
    return new MockAPIResponse(200, products) as unknown as APIResponse;
  }

  async getProduct(id: number): Promise<APIResponse> {
    if (id !== 1) {
      return new MockAPIResponse(404, { error: 'Product not found' }) as unknown as APIResponse;
    }
    const product = { id: 1, name: 'Sauce Labs Backpack', description: 'carry.allTheThings()', price: 29.99, imageUrl: '/img/sauce-backpack.jpg' };
    return new MockAPIResponse(200, product) as unknown as APIResponse;
  }

  async addToCart(productId: number, quantity: number): Promise<APIResponse> {
    if (productId <= 0) {
      return new MockAPIResponse(400, { error: 'Invalid product ID' }) as unknown as APIResponse;
    }
    return new MockAPIResponse(201, { id: productId, name: 'Mock Product', quantity, price: 9.99 }) as unknown as APIResponse;
  }
}
