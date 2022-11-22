# Express rate limiter

Basic API with public and private routes used to demonstrate a implementation of a rate limit middleware, using a sliding window algorithm and persistence in redis.

## Start the project

### Clone the repository

Clone the repository to your local machine

```
cd directory/to/clone
git clone https://github.com/joan-canellas-fontanilles/express-rate-limitter.git
```

### Install dependencies

Once you have cloned the repository, we can start the installation of the dependencies. 

Execute the following commands:

```
cd /path/to/repository
npm install
```

### Environment variables

Create a `.env` file containing the environment variables, following the `.env.example` file.

There are some required variable that must be defined in the .env file. Table with all the possible environment variables.

| Variable         | Required | Type                    | Default value | Description                                                      |
|------------------|---------|-------------------------|--------------|------------------------------------------------------------------|
| PORT             | No      | Number                  | 4040         | Port used by express to listen for request.                      |
| API_PREFIX       | No      | String                  | api          | Base api route where the routes will be mounted.                 |
| REDIS_HTTP_PORT  | No      | Number                  | 6379         | The port number of the redis database to connect to.             |
| REDIS_HTTP_URL   | NO      | String                  | 127.0.0.1    | The hostname of the redis database you are connecting to.        |
| LOG_DIR          | NO      | String                  | logs         | Name of the folder used to store the log.log file.               |
| LOG_LEVEL        | NO      | 'error', 'warn', 'info' | info         | The level of details that will be displayed on the logs          |
| JWT_SECRET       | Yes     | String                  | -            | The secret used to validate the jwt                              |
| JWT              | Yes     | String                  | -            | The json web token that have access to the private routes        |
| IP_RATE_LIMIT    | No      | Number                  | 100          | The allowed number of request that an ip can perform in an hour  |
| TOKEN_RATE_LIMIT | No      | Number                  | 200          | The allowed number of request that a user can perform in an hour |

### Build project and start

After you have defined the environment variables, you can perform a build to generate the javascript code from the typescript files, this will be generated in the `dist` folder.

```
npm run build
```

The build will also be executed when the start script is called as a pre-start script.

Before starting the project make sure that you have a instance of redis open, as well as the correct configuration needed to access it in the `.env` file.

The command to start the express project is the following:

```
npm run start
```

## Executing the tests

### Unit and integration tests

The project have multiple `*.spec.ts` file containing the unit tests, those are located next to the implementation with a similar file name. 

Also, some integration test are located in the `integration` folder, those tests application and the basic routes.

In order to run the tests you must install before the dependencies. Check the section [above](#install-dependencies)

```
npm run test
```

### Performance tests

There are some commands to simulate requests peaks from one user / ip.

The public command will perform 4000 requests to `/api/public` in 1 second

The private command will perform ~1500 requests to `/api/private` in the span of 10 seconds

```
npm run test:performance:private
npm run test:performance:public
```

You must have installed globally the package `artillery` to perform those tests. You can install the package with this command:

```
npm install -g artillery
```

## Using docker

You can also create a docker instance of the application with an instance of the redis database.


To build, (re)create, start the containers.
```
npm run docker-compose:up
```

To stop and remove the containers, networks, volumes, and images created by the up command

```
npm run docker-compose:down
```

You can also execute the command to start just one of the docker-compose services. Example:
```
npm run docker-compose:up redis-db
```

## Implementation Notes

### Rate limit middleware

The middleware is implemented in the [rate-limiter.middleware.ts](https://github.com/joan-canellas-fontanilles/express-rate-limitter/blob/main/src/middlewares/rate-limiter.middleware.ts) file.

This middleware is in charge of throwing the TooManyRequestHttpException error, when the rate limit is reached. It also adds the headers to track some rate limit properties.

Create an instance of the class, using the constructor. The constructor parameters are: 
- RequestStore instance. This determines the behaviour of the rate-limiter and where the request are stored to take accountability of the remaining calls.
- Rate limit properties. Those are explained in more detail at the table below.

Rate limit properties:

| Name                | Required | Description                                              | Default    |
|---------------------|---------|-----------------------------------------------------------|------------|
| rateLimit           | Yes     | The maximum request allowed for this identifier           | -          |
| identifierGenerator | Yes     | Method used to generate the identifier                    | -          |
| timeWindow          | No      | The time in milliseconds that will store the last request | 3600000    |


Example:

```
const instance = new RateLimiterMiddleware(
  requestStore,
  {
    rateLimit: this.environment.tokenRateLimit,
    identifierGenerator: (_, res) => res.locals.user,
  }
)

router.get(this.route, rateLimitMiddleware.handle.bind(rateLimitMiddleware))
```

### Redis request storage

The middleware is implemented in the [rate-request.store.ts](https://github.com/joan-canellas-fontanilles/express-rate-limitter/blob/main/src/store/redis-request.store.ts) file.

The storage implemented for this example consists in a redis database that persists the requests. The rate limit algorithm used is a **sliding window** algorithm. 

The requests are stored in a sorted set, where each request is stored with a score that references the timestamp of the request.

The redis operation consists in a single multi-stage operation (transaction), which preserves the atomicity of the execution and avoids possible problems with race conditions with read/write operations.

The operation performs the following tasks:
- Remove the old request that are older than the limit threshold.
- Execute a lua script in charge of:
  - Counting the number of request that are stored in the set.
  - Writing the new request only if the limit of request is not reached.
  - Return the remaining request available, without taking into account the last request.
- Set an expiry time for this identity, to clean up memory if no more request are made.

Other possible implementations:

- Instead of making a single transaction create a lock to ensure that the record is not modified. For example, using the DLM Redlock. This would affect the delay due to the communication with the database, with heavy impact if mainly one identifier is making all the request.
- Use a watch command to check if the key was altered. This would be a simpler execution than the implemented with a retry mechanism. However, less efficient. 

### In memory request cache

The middleware is implemented in the [rate-memory-request.store.ts](https://github.com/joan-canellas-fontanilles/express-rate-limitter/blob/main/src/store/redis-memory-request.store.ts) file.

An in-memory cache is used to preserve the first request made in the time window. This cache is used to minimize the number of requests made to redis. 

Once an identifier have used all the possible request, the cache will manage when the next request can be made. Limiting the amount of request that are sent to redis.

This implementation however have a disadvantage. If the redis is deleted manually, this will not be reflected in the in-memory cache.

## Distributed system

This implementation allows the usage of a rate limiter middleware for a distributed system.

The instances of the express application and redis can be scaled. Event if the redis instances are scaled, ensure that an identifier points always to the same instance.

In the docker folder there is a file named **service.yaml** with the configuration of a load balancer for the express application (3 replicas) and one instance of redis.

In order to apply this configuration:

```
npm run k8s:apply
```

