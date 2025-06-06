import { ICredentialDataDecryptedObject } from "n8n-workflow";
import { DremIOClient } from "./Libs/DremIOSDK/DremIOClient";
import { DremIOService } from "./Libs/DremIOSDK/DremIOService";
import { KeyStore } from "./Libs/DremIOSDK/KeyStore";
import { createHash } from "crypto";
import { logger } from "./Libs/DremIOSDK/logger";

export const getDremioService = (credentials: ICredentialDataDecryptedObject, secure?: boolean) => {
    // Hash the key using SHA-256
    const rawKey = String(credentials.endpoint) + String(credentials.username) + String(credentials.password);
    const hashkey = createHash("sha256").update(rawKey).digest("hex");
    logger.info(`Using hash key: ${hashkey}`);
    logger.info(`Using hash key: ${credentials.endpoint}`);
    logger.info(`Using hash key: ${credentials.username}`);
    const client = new DremIOClient(
        {
            host: credentials.endpoint as string,
            username: credentials.username as string,
            password: credentials.password as string,
            secure: secure ?? true, // Default to true if not specified
        },
        new KeyStore(hashkey)
    );
    return new DremIOService(client);
}