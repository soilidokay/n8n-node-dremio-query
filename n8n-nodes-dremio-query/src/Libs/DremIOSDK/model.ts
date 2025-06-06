export interface DremIOConfig {
    host: string;
    username: string;
    password: string;
    secure?: boolean;
}
// JobGetResponse.ts
export interface ReflectionRelationship {
    datasetId: string;
    reflectionId: string;
    relationship: string;
}

export interface Acceleration {
    reflectionRelationships: ReflectionRelationship[];
}

export enum JobState {
    NOT_SUBMITTED = "NOT_SUBMITTED",
    STARTING = "STARTING",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
    FAILED = "FAILED",
    CANCELLATION_REQUESTED = "CANCELLATION_REQUESTED",
    PLANNING = "PLANNING",
    PENDING = "PENDING",
    METADATA_RETRIEVAL = "METADATA_RETRIEVAL",
    QUEUED = "QUEUED",
    ENGINE_START = "ENGINE_START",
    EXECUTION_PLANNING = "EXECUTION_PLANNING",
    INVALID_STATE = "INVALID_STATE",
}

export interface JobGetResponse {
    jobState?: JobState;
    rowCount: number;
    errorMessage?: string;
    startedAt: string;
    endedAt: string;
    acceleration?: Acceleration;
    queryType: string;
    queueName: string;
    queueId: string;
    resourceSchedulingStartedAt: string;
    resourceSchedulingEndedAt: string;
    cancellationReason?: string;
}

// JobResultResponse.ts
export interface Schema {
    name: string;
    type: { name: string };
}

export interface JobResultResponse<T = Record<string, any>> {
    rowCount: number;
    schema: Schema[];
    rows: T[];
}

// PayloadSqlRequest.ts
export interface NessieSource {
    type: string;
    value: string;
}

export interface PayloadSqlRequest {
    sql: string;
    context: string[];
    references?: Record<string, NessieSource>;
}

// TokenResponse.ts
export interface Permissions {
    canUploadProfiles: boolean;
    canDownloadProfiles: boolean;
    canEmailForSupport: boolean;
    canChatForSupport: boolean;
    canViewAllJobs: boolean;
    canCreateUser: boolean;
    canCreateRole: boolean;
    canCreateSource: boolean;
    canUploadFile: boolean;
    canManageNodeActivity: boolean;
    canManageEngines: boolean;
    canManageQueues: boolean;
    canManageEngineRouting: boolean;
    canManageSupportSettings: boolean;
    canConfigureSecurity: boolean;
    canRunDiagnostic: boolean;
}

export interface TokenResponse {
    token: string;
    userName: string;
    firstName: string;
    lastName: string;
    expires: number;
    email: string;
    userId: string;
    admin: boolean;
    clusterId: string;
    clusterCreatedAt: number;
    version: string;
    permissions: Permissions;
    userCreatedAt: number;
}
