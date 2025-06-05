import { ICredentialType, INodeProperties } from 'n8n-workflow';

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
    ];
}