import fs from "fs";

export class KeyStore {
    private tokenData: { token: string; expiry: number } | null = null;
    private folderPath: string;

    constructor(folderPath: string = "dremio") {
        this.folderPath = folderPath;
        this.loadFromFile();
    }
    private get filePath() {
        if (!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath, { recursive: true });
        }
        return `${this.folderPath}/keystore.json`;
    }

    // Load token from file (if available)
    private loadFromFile(): void {
        if (fs.existsSync(this.filePath)) {
            try {
                const data = fs.readFileSync(this.filePath, "utf-8");
                this.tokenData = JSON.parse(data);
            } catch (error) {
                console.error("Error reading key store file:", error);
            }
        }
    }

    // Save token to file
    private saveToFile(): void {
        fs.writeFileSync(this.filePath, JSON.stringify(this.tokenData, null, 2));
    }

    // Get token if still valid
    public getToken(): string | null {
        if (this.tokenData && this.tokenData.expiry > Date.now()) {
            return this.tokenData.token;
        }
        return null;
    }

    // Save new token to file
    public saveToken(token: string, expiresIn: number): void {
        this.tokenData = {
            token,
            expiry: Date.now() + expiresIn * 1000, // Convert to milliseconds
        };
        this.saveToFile();
    }
}
