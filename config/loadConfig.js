import dotenv from 'dotenv';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { logger } from "../utils/logger.js";

dotenv.config();

const REGION = "us-east-1";
const SECRET_NAME = "social-com";

const client = new SecretsManagerClient({
    region: REGION,
});

async function getSecrets() {
    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: SECRET_NAME,
            })
        );

        const secrets = JSON.parse(response.SecretString);
        return secrets;
    } catch (error) {
        console.error('Error retrieving secrets:', error);
        throw error;
    }
}

const loadConfig = async () => {
    const config = {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 3030,
        DB_URI: process.env.DB_URI,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        AWS_REGION: process.env.AWS_REGION,
        SECRET_NAME: process.env.SECRET_NAME
    };

    if (config.NODE_ENV === 'production') {
        logger.info('Fetching secrets from AWS Secrets Manager...');
        try {
            const secrets = await getSecrets();
            logger.info('Secrets successfully loaded from AWS.');
            return { ...config, ...secrets };
        } catch (error) {
            logger.error(`Error fetching secrets from AWS Secrets Manager: ${error.message}`);
            process.exit(1);
        }
    }

    logger.info('Running in development mode. Using .env for configuration.');
    return config;
};

export {
    loadConfig
};
