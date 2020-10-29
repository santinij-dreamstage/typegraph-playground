
export enum Environment {
    Development,
    Staging,
    Production,
    Unknown
}

export function getEnvironment(env?: string): Environment {
    if (!env) {
        return Environment.Unknown;
    }
    if (env.includes("dev")) {
        return Environment.Development;
    }
    else if (env.includes("staging")) {
        return Environment.Staging;

    }
    else if (env.includes("prod")) {
        return Environment.Production;
    }
    return Environment.Unknown;
}

export function getCorsOrigins(env: Environment): string[] {
    switch (env) {
        case Environment.Development:
        case Environment.Unknown:
            return [
                "https://staging.dreamstage.live",
                "https://dreamstage.live",
                "http://localhost:3000",
                "http://localhost:4000",
            ];
        case Environment.Staging:
            return [
                "https://staging.dreamstage.live",
                "https://dreamstage.live",
                "http://localhost:3000",
                "http://localhost:4000",
            ];
        case Environment.Production:
            return [
                "https://dreamstage.live",
            ];
    }
}
