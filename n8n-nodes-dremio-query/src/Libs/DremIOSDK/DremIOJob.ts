import { DremIOService } from "./DremIOService";
import { JobGetResponse, JobResultResponse } from "./model";

export class DremIOJob {
    private service: DremIOService;

    constructor(service: DremIOService) {
        this.service = service;
    }

    public async getAsync(jobId: string): Promise<JobGetResponse | null> {
        return this.service.Client.getAsync<JobGetResponse>(`/job/${jobId}`);
    }

    public async resultAsync<T>(jobId: string, limit: number = 100, offset: number = 0): Promise<JobResultResponse<T> | null> {
        return this.service.Client.getAsync<JobResultResponse<T>>(`/job/${jobId}/results?limit=${limit}&offset=${offset}`);
    }

    public async *resultAllAsync<T>(jobId: string): AsyncIterable<T> {
        let offset = 0;
        const limit = 500;

        while (true) {
            const result = await this.resultAsync<T>(jobId, limit, offset);

            if (!result || !result.rows || result.rows.length === 0) {
                break; // Dừng khi không còn dữ liệu
            }

            for (const row of result.rows) {
                yield row;
            }

            offset += result.rows.length;

            if (offset >= result.rowCount) {
                break; // Dừng khi đã lấy đủ dữ liệu
            }
        }
    }

    public async waitAsync(jobId: string, timeout: number = 300): Promise<JobGetResponse> {
        const start = Date.now();

        while (Date.now() - start < timeout * 1000) {
            const res = await this.getAsync(jobId);
            if (res?.jobState && ["COMPLETED", "CANCELED", "FAILED"].includes(res.jobState)) {
                return res;
            }
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        throw new Error("Job wait timeout!");
    }
}
