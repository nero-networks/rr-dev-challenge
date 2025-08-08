# rr DEV Challenge - backend

NestJS app utilizing the [db-vendo-client](https://github.com/public-transport/db-vendo-client) to serve as the backend for the web-client.


## Technology
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Language**: TypeScript
- **Testing**: Jest


## Quick Start
```bash
npm install
npm run build
npm start
```

A Swagger-UI runs on **http://localhost:3000/**

The open-Api 3 configuration is available for download as 
[json](http://localhost:3000/openapi.json) or [yaml](http://localhost:3000/openapi.yaml)


## Environment Variables
By default the backend runs on port 3000

this can be overridden by declaring a PORT environment variable on the command line
```
$ PORT=3002 npm start
```

## Tests
```bash
npm run test
npm run test:e2e
npm run test:cov
```

The coverage is not impressive and the e2e tests are practically not existent. 
But the environments are set up and the existing tests are all green.

## Next steps
- api parameter sanitazion / validation
- more tests
- access control
