import { ICredentialDataDecryptedObject, IExecuteFunctions, INodeExecutionData, INodeProperties, INodeType } from 'n8n-workflow';
import { DremIOClient } from '../Libs/DremIOSDK/DremIOClient';
import { KeyStore } from '../Libs/DremIOSDK/KeyStore';
import { DremIOService } from '../Libs/DremIOSDK/DremIOService';
import { getDremioService } from '../helper';

export class DremioQuery implements INodeType {
    description = {
        displayName: 'Dremio Query',
        name: 'dremioQuery',
        group: ['transform'],
        version: 1,
        description: 'Execute custom SQL query on Dremio',
        defaults: { name: 'Dremio Query' },
        inputs: ['main'],
        outputs: ['main'],
        icon: 'file:dremio.png', // <-- Add this line, use SVG or PNG file
        properties: [
            {
                displayName: 'Query',
                name: 'query',
                type: 'string',
                default: '',
                placeholder: 'SELECT * FROM my_table',
                description: 'SQL query to execute',
                required: true,
                typeOptions: {
                    rows: 5, // <-- Add this line to make textarea higher
                },
            },
            {
                displayName: 'Context',
                name: 'context',
                type: 'fixedCollection',
                placeholder: 'Add Context',
                description: 'Array of context (database/schema) to execute the query, each item is one context',
                required: false,
                typeOptions: {
                    multipleValues: true,
                },
                default: {},
                options: [
                    {
                        name: 'contexts',
                        displayName: 'Contexts',
                        values: [
                            {
                                displayName: 'Context',
                                name: 'value',
                                type: 'string',
                                default: '',
                                placeholder: 'my_space.my_folder',
                            },
                        ],
                    },
                ],
            },
        ] as INodeProperties[],
        credentials: [
            {
                name: 'dremioApi',
                required: true,
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | null> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const query = this.getNodeParameter('query', 0) as string;

        // Get context as array from fixedCollection
        const contextCollection = this.getNodeParameter('context.contexts', 0, []) as Array<{ value: string }>;

        const contextArr = contextCollection.map(c => c.value).filter(Boolean);

        const credentials = await this.getCredentials('dremioApi');

        // Create Dremio service connection
        const service = getDremioService(credentials);

        // Execute query
        const dremioContext = service.createContext(...contextArr);
        for await (const row of dremioContext.queryWaitAsync<any>(query)) {
            returnData.push({ json: row });
        }

        return this.prepareOutputData(returnData);
    }
}
export default DremioQuery;