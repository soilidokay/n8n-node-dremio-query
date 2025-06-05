import { DremIOClient } from "./DremIOClient";
import { DremIOContext } from "./DremIOContext";
import { DremIOJob } from "./DremIOJob";

export class DremIOService {
    private dremIOClient: DremIOClient;

    constructor(dremIOClient: DremIOClient) {
        this.dremIOClient = dremIOClient;
    }

    get Client(): DremIOClient {
        return this.dremIOClient;
    }

    public async queryAsync<T>(sql: string, context?: string[]): Promise<T | null> {
        const response = await this.dremIOClient.postAsync<T>("/sql", { sql, context });
        return response;
    }

    public createContext(...contexts: string[]): DremIOContext {
        return new DremIOContext(this, ...contexts);
    }

    public createJob(): DremIOJob {
        return new DremIOJob(this);
    }
}
