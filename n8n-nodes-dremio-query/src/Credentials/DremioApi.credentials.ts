import { ICredentialType, INodeProperties, ICredentialTestFunctions, ICredentialDataDecryptedObject, IHttpRequestOptions, INodeCredentialTestResult, ICredentialTestRequest } from 'n8n-workflow';
import { getDremioService } from '../helper';

export class DremioApi implements ICredentialType {
    name = 'dremioApi';
    displayName = 'Dremio API';
    documentationUrl = 'https://docs.dremio.com/';
    properties: INodeProperties[] = [
        {
            displayName: 'Endpoint URL',
            name: 'endpoint',
            type: 'string',
            default: '',
            placeholder: 'https://your-dremio-instance:9047',
            required: true,
        },
        {
            displayName: 'Username',
            name: 'username',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
        },
        {
            displayName: 'Allow Self-signed Certificate',
            name: 'secure',
            type: 'boolean',
            default: true,
            description: 'Allow connections to servers with self-signed SSL certificates',
        },
    ];

    // Add test method for n8n credential UI
    async authenticate(credentials: ICredentialDataDecryptedObject, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions> {
        const result = getDremioService(credentials);
        await result.Client.authenticate();
        return {
            ...requestOptions,
            headers: {
                ...requestOptions.headers,
                Authorization: `Bearer ${result.Client.keyStore.getToken()}`,
            },
        };
    }

    // Add test property for n8n "Test Connection" button
    test: ICredentialTestRequest = {
        request: {
            method: 'POST',
            url: '={{$credentials.endpoint}}/apiv2/login',
            body: {
                userName: '={{$credentials.username}}',
                password: '={{$credentials.password}}',
            },
            headers: {
                'Content-Type': 'application/json',
            },
            // Nếu muốn bỏ qua SSL, có thể thêm skipSslCertificateValidation: '={{$credentials.secure}}',
            skipSslCertificateValidation: '={{$credentials.secure}}' as any, // Cast to any to avoid type error
        },
        rules: [
            {
                type: 'responseCode',
                properties: {
                    value: 200,
                    message: 'Login successful!',
                },
            },
        ],
    };
}