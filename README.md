# health-service
A service that monitors hosts and displays their status in a web ui.

## Dependencies
The following dependencies are required to run the project:

- Maven
- Java 8
- Node.js version 6 or greater

## Run the project

### Server

```
cd server
mvn install
mvn package
java -jar target/health-monitor-1.0.0-fat.jar
```

The server listens on port 4711

### Client

```
cd client
npm i
npm start
```

The UI can be accessed on http://localhost:4713

### Tests

The are some automatic integration tests as well as a server that can be used as a target for the application for manual testing.

```
cd tests
npm i
```

in order to run the server use `npm start` and in order to run the test suite use `npm test`.

The test server listens on port 4712

## Additional notes

Time spent:

|---------------+--------|
| *Total time*  | *6:39* |
|---------------+--------|
| Setup         |   1:00 |
| Server        |   2:49 |
| Web client    |   1:18 |
| Prettify UI   |   0:57 |
| Documentation |   0:35 |
