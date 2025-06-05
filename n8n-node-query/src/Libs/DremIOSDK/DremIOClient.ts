import { KeyStore } from "./KeyStore";
import { logger } from "./logger";
import { DremIOConfig, TokenResponse } from "./model";

export class DremIOClient {
    private config: DremIOConfig;
    keyStore: KeyStore;

    constructor(config: DremIOConfig, KeyStore: KeyStore) {
        this.config = config;
        this.keyStore = KeyStore;
    }
    // Xác thực với Dremio và lấy token (nếu chưa có hoặc hết hạn)
    private async authenticate(): Promise<void> {
        let token = this.keyStore.getToken();
        if (token) return; // Nếu token hợp lệ thì không cần login lại
        try {
            const response = await fetch(`${this.config.host}/apiv2/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: this.config.username,
                    password: this.config.password,
                }),
            });

            if (!response.ok) {
                throw new Error(`Authentication failed: ${response.statusText}`);
            }

            const data = await (response.json() as Promise<TokenResponse>);
            const expiresIn = (data.expires - Date.now()) / 1000 - 3600;
            this.keyStore.saveToken(data.token, expiresIn);
            logger.info("Authenticated with Dremio successfully!");
        } catch (error) {
            logger.error("Dremio authentication failed:" + error);
            throw new Error("Authentication failed");
        }
    }
    private async request<T>(endpoint: string, method: string = "GET", body?: any): Promise<T> {
        await this.authenticate();
        const token = this.keyStore.getToken();
        const response = await fetch(`${this.config.host}/api/v3${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.statusText}`);
        }

        return response.json() as Promise<T>;
    }

    public async postAsync<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, "POST", body);
    }

    public async getAsync<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, "GET");
    }
}
