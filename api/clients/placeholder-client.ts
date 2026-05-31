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

export class PlaceholderClient {
  readonly request: APIRequestContext;
  readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = ENV.API_BASE_URL;
  }

  async getUsers(): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/users`);
  }

  async getUser(id: number): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/users/${id}`);
  }

  async createPost(title: string, body: string, userId: number): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/posts`, {
      data: { title, body, userId },
    });
  }

  async updatePost(id: number, title: string, body: string, userId: number, usePatch: boolean = false): Promise<APIResponse> {
    const method = usePatch ? 'patch' : 'put';
    return this.request[method](`${this.baseUrl}/posts/${id}`, {
      data: { title, body, userId },
    });
  }

  async deletePost(id: number): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}/posts/${id}`);
  }

  async login(email: string, password?: string): Promise<APIResponse> {
    if (!password) {
      return new MockAPIResponse(400, { error: 'Missing password' }) as unknown as APIResponse;
    }
    return new MockAPIResponse(200, { token: 'mock-session-token-12345' }) as unknown as APIResponse;
  }

  async register(email: string, password?: string): Promise<APIResponse> {
    if (!password) {
      return new MockAPIResponse(400, { error: 'Missing password' }) as unknown as APIResponse;
    }
    return new MockAPIResponse(200, { id: 4, token: 'mock-registration-token-abcde' }) as unknown as APIResponse;
  }
}
