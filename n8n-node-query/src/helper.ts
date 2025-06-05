import { ICredentialDataDecryptedObject } from "n8n-workflow";
import { DremIOClient } from "./Libs/DremIOSDK/DremIOClient";
import { DremIOService } from "./Libs/DremIOSDK/DremIOService";
import { KeyStore } from "./Libs/DremIOSDK/KeyStore";

export const getDremioService = (credentials: ICredentialDataDecryptedObject) => {
    const client = new DremIOClient(
        {
            host: credentials.endpoint as string,
            username: credentials.username as string,
            password: credentials.password as string,
        },
        new KeyStore('dremio_keystore')
    );
    return new DremIOService(client);
}