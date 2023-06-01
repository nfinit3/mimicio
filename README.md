# Mimicio

A simple CLI tool for running a mock API server based on a directory structure. 

## Installation

```bash
npm install -g mimicio
```

## Directory Structure

The mock server uses a specific directory structure to determine the available services, methods, endpoints, and responses. Here's an example of how to set up your directories and files:

```
.
├── serviceName
│   ├── GET
│   │   ├── endpointName
│   │   │   ├── 200.json
│   │   │   └── 404.json
│   ├── POST
│   │   ├── endpointName
│   │   │   └── 200.json
```

In this example:

- `serviceName` is the name of the service.
- `GET` and `POST` are HTTP methods.
- `endpointName` is the name of the endpoint.
- `200.json` and `404.json` are JSON files representing the response bodies for their respective status codes.

## Usage

Navigate to the directory containing your service directories, then run the `mock-server` command:

```bash
mimicio
```

The mock server will start on a random available port in the range 3000-3999. The console will display the port number.

You can then send HTTP requests to the server. For example, if the server is running on port 3000, you could send a GET request to the `endpointName` endpoint of the `serviceName` service like this:

```bash
curl http://localhost:3000/serviceName/endpointName
```

The server will respond with the contents of the `200.json` file in the `GET/endpointName` directory of the `serviceName` service. If the `200.json` file does not exist, the server will respond with a 500 Internal Server Error.

## License

This project is licensed under the MIT License.
