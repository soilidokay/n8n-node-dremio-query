# n8n Custom Query Node

This project provides a custom query node for n8n, allowing users to execute custom queries and handle input/output data seamlessly.

## Installation

To install the necessary dependencies, run:

```
npm install
```

## Usage

To use the custom query node in your n8n workflow, follow these steps:

1. Build the project:
    ```
    npm run build
    ```
2. Start n8n using Docker Compose:
    ```
    docker compose up
    ```
3. Open your browser and go to [http://localhost:5678/](http://localhost:5678/) to test the custom node in your n8n instance.
4. Import the custom node into your n8n instance.
5. Configure the node with the required parameters for your custom query.
6. Connect the node to other nodes in your workflow as needed.

## Development

For development, you can run:

```
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.