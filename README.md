#### Token-Generator

An [AWS Lambda](https://aws.amazon.com/lambda/)-based token generation using [Serverless](https://serverless.com/)

##### Prerequisite
- An existing [AWS Account](https://aws.amazon.com/free)
- [Serverless CLI](https://serverless.com/framework/docs/providers/aws/guide/installation/) installation.

##### Usage
- Clone the project.
- Deploy the service: `sls deploy -v`
- Invoke the function locally: `sls invoke --local -f createToken`
- Invoke the function locally with event: `sls invoke --local -f createToken --path event.json`
- Bundle and just see the output: `sls webpack --out dist`
- Teardown the service: `sls remove`
