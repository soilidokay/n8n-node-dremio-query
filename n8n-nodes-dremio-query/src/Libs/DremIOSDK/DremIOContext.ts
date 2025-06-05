import { DremIOService } from "./DremIOService";

export class DremIOContext {
    private contexts: string[];
    private service: DremIOService;

    constructor(service: DremIOService, ...contexts: string[]) {
        this.service = service;
        this.contexts = contexts;
    }

    public async queryAsync(sqlQuery: string): Promise<string | null> {
        const result = await this.service.queryAsync<{ id: string }>(sqlQuery, this.contexts);
        if (result?.id) return result.id;
        throw new Error("Failed to retrieve query ID.");
    }

    public async *queryWaitAsync<T>(sqlQuery: string, timeout: number = 30): AsyncIterable<T> {
        const jobId = await this.queryAsync(sqlQuery);
        if (!jobId) throw new Error("Query failed to start!");

        const job = this.service.createJob();
        const jobStatus = await job.waitAsync(jobId, timeout);
        if (jobStatus.jobState === "COMPLETED") {
            for await (const item of job.resultAllAsync<T>(jobId)) {
                yield item;
            }
        } else {
            throw new Error(`Job failed, state: ${jobStatus.jobState}`);
        }
    }
}
