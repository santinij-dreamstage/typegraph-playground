import CognitoExpress from "cognito-express";

//TODO: implement this...
// copied from https://github.com/DreamStageLive/stripe-apigw/blob/master/src/authentication.js

async function _cognitorInitializer(userPoolSecret: string) {
    try {
        let userPoolId = '';

        try {
            userPoolId = JSON.parse(userPoolSecret)['pool_id'];
        } catch (err) {
            userPoolId = userPoolSecret;
        }
        return new CognitoExpress({
            region: process.env.AWS_REGION,
            cognitoUserPoolId: userPoolId,
            tokenUse: 'id',
            tokenExpiration: 3600000,
        });
    } catch (err) {
        console.error('Failed to initialize CognitoExpress', err);
        throw err;
    }
}

async function _localAuthInitializer(_userPoolSecret: string) {
    return Promise.resolve({
        validate: (token: string, callback: (arg0: null, arg1: { sub: string; email: string; }) => void) => {
            if (token === '8e7bc3fa-8425-49b3-9c9b-2efeb9d2bc7a')
                callback(null, {
                    sub: '8e7bc3fa-8425-49b3-9c9b-2efeb9d2bc7a',
                    email: 'test1@dreamstage.live',
                });
        },
    });
}

class InitializedAuthenticator extends Error { }
class InvalidAuthorizationHeader extends Error { }
class FailedAuthentication extends Error {
    constructor(name: string, message: string) {
        super(message);
        this.name = name;
    }
}
class Authenticator {
    constructor(authenticationPromise: any) {
        this.authenticationPromise = authenticationPromise;
    }
    static initializeFor(secretsManager: any, environment: string) {
        if (environment === 'local') {
            return this.initialize(secretsManager, _localAuthInitializer);
        } else {
            return this.initialize(secretsManager, _cognitorInitializer);
        }
    }
    static initialize(secretsManager: { getSecret: (arg0: string) => Promise<any>; }, initAuth = _cognitorInitializer) {
        const authenticationPromise = secretsManager
            .getSecret('user-pool')
            .then((userPoolSecret: string) => {
                return initAuth(userPoolSecret);
            })
            .catch((err: any) => {
                console.error('Failed to access user-pool secret', err);
                throw new InitializedAuthenticator();
            });
        return new Authenticator(authenticationPromise);
    }

    verify(event: { headers: never[]; }) {
        return this.authenticationPromise.then((cognitoAuth: { validate: (arg0: any, arg1: (err: any, response: any) => void) => void; }) => {
            return new Promise((resolve, reject) => {
                const headers = event.headers || [];

                const authorizationHeader =
                    headers['Authorization'] || headers['authorization'];
                if (!authorizationHeader) {
                    reject(
                        new InvalidAuthorizationHeader('Authorization header is not set'),
                    );
                }

                const token = authorizationHeader.split('Bearer ')[1];
                if (!token) {
                    reject(
                        new InvalidAuthorizationHeader(
                            'Authorization header is not valid bearer token',
                        ),
                    );
                }

                cognitoAuth.validate(token, function (err: { name: string; message: string; }, response: unknown) {
                    if (err) {
                        console.error('Failed to validate token', err);
                        reject(new FailedAuthentication(err.name, err.message));
                    } else {
                        console.debug('User is ', response);
                        resolve(response);
                    }
                });
            });
        });
    }
}

module.exports = {
    Authenticator,
    InitializedAuthenticator,
    InvalidAuthorizationHeader,
    FailedAuthentication,
};
