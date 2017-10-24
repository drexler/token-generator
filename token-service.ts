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

function getAccessToken(callback: any): any {
  const jwt = generateJwt();

  request
    .post(`${parameters.endpoint}/${parameters.tenant}/oauth/token/`)
    .set('authorization', `Bearer ${jwt}`)
    .set('Content-Type', 'application/json')
    .send(`{"grant_type": "password","username": "${parameters.username}","password": "${parameters.password}"}`)
    .end((error, response) => {
      if (error) {
        callback(error);
      } else {
        callback(undefined, response.body.access_token);
      }
    });

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

export function create(event: any, context: any, callback: any): void {
  let response: any;
  let responseBody: any;

  parameters = JSON.parse(event.body);
  const numberOfProperties = Object.keys(parameters).length;
  if (numberOfProperties !== 7) {
    responseBody = {
      httpStatus: 400,
      code: 10,
      message: 'Request body cannot be intepreted.',
      developerMessage: `Expected 7 properties; received ${numberOfProperties}`,
    };
    response = {
      statusCode: responseBody.httpStatus,
      body: JSON.stringify(responseBody)
    };
    callback(null, response);
  } else {
    getAccessToken((tokenError, tokenResponse) => {
      if (tokenError) {
        responseBody = {
          httpStatus: 400,
          code: 10,
          message: 'Error generating token',
          developerMessage: tokenError,
        };
        response = {
          statusCode: responseBody.httpStatus,
          body: JSON.stringify(responseBody)
        };
        callback(null, response);
      } else {
        response = {
          statusCode: 200,
          body: JSON.stringify({
            token: tokenResponse})
        };
        callback(null, response);
      }
    });
  }
}
