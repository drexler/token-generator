import * as request from 'superagent';
import * as uniqueifier from 'uuid/v4';
import * as nJwt from 'njwt';

let parameters: {
  apiKey: string,
  apiSecret: string,
  tenant: string,
  applicationId: string,
  username: string,
  password: string,
  endpoint: string
};

async function getAccessToken(): Promise<any> {
  const jwt = generateJwt();

  const response = await request
    .post(`${parameters.endpoint}/${parameters.tenant}/oauth/token/`)
    .set('authorization', `Bearer ${jwt}`)
    .set('Content-Type', 'application/json')
    .send(`{"grant_type": "password","username": "${parameters.username}","password": "${parameters.password}"}`);

  return response.body.access_token;

}

function generateJwt(): string {
  const claims = {
    callbackUrl: parameters.endpoint,
    iat: Math.trunc(Date.now() / 1000),
    iss: parameters.apiKey,
    jti: uniqueifier(),
    sub: parameters.applicationId,
    tenantName: parameters.tenant
  };

  return nJwt.create(claims, parameters.apiSecret).compact();
}

function uniqueify(): string {
  return uniqueifier().substring(0, 20);
}

function buildLambdaErrorResponse(statusCode: number, message: string, developerMessage: any): any {
  return {
    httpStatus: statusCode,
    message,
    developerMessage
  };
}

export async function createToken(event: any, context: any, callback: any) {
  let response: any;
  let responseBody: any;

  parameters = JSON.parse(event.body);
  const numberOfProperties = Object.keys(parameters).length;
  if (numberOfProperties !== 7) {
    responseBody = buildLambdaErrorResponse(400,
                    'Request body cannot be intepreted.',
                    `Expected 7 properties; received ${numberOfProperties}`);
    response = {
      statusCode: responseBody.httpStatus,
      body: JSON.stringify(responseBody)
    };
    callback(undefined, response);
  } else {
    try {
      const accessToken = await getAccessToken();
      response = {
        statusCode: 200,
        body: JSON.stringify({ token: accessToken })
      };
      callback(undefined, response);

    } catch (error) {
      responseBody = buildLambdaErrorResponse(400, 'Error generating token', error);
      response = {
        statusCode: responseBody.httpStatus,
        body: JSON.stringify(responseBody)
      };
      callback(undefined, response);
    }
  }
}

export async function createJwt(event: any, context: any, callback: any) {
  const request = JSON.parse(event.body);

  const claims = {
    iat: Math.trunc(Date.now() / 1000),
    iss: request.apiKey,
    sub: request.applicationHref,
    callbackUrl: request.callbackUrl,
    tenantId: request.tenantId,
    jti: uniqueifier()
  }

  const jwt = nJwt.create(claims, request.apiSecret).compact();

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      jwt
    })
  };

  callback(undefined, response);
}

export async function testLambdaInput(event: any, context: any, callback: any)
{
  console.log(`received event: ${JSON.stringify(event)}`);
  const payload = JSON.parse(event.body);

  const origin = event.headers["origin"];

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : origin, // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
    },
    body: JSON.stringify({
      received: payload,
    })
  };

  callback(undefined, response);
}
