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
  let config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3030,
    DB_URI: process.env.DB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    SECRET_NAME: process.env.SECRET_NAME || 'social-com',
    TWILIO_ACCOUNT_SID: process.env.twilio_account_sid,
    TWILIO_AUTH_TOKEN: process.env.twilio_auth_token,
    TWILIO_SERVICE_SID: process.env.twilio_service_sid,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
    APPLE_KEY_ID: process.env.APPLE_KEY_ID,
    APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY,
    APPLE_CALLBACK_URL: process.env.APPLE_CALLBACK_URL,
  };

  if (config.NODE_ENV === 'production') {
    logger.info('Fetching secrets from AWS Secrets Manager...');
    try {
      const secrets = await getSecrets();

      logger.info('Secrets successfully loaded from AWS.');

      // return { ...config, ...secrets };
      config = {
        NODE_ENV: secrets.process.env.NODE_ENV,
        PORT: secrets.process.env.PORT,
        DB_URI: secrets.process.env.DB_URI,
        ACCESS_TOKEN_SECRET: secrets.process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: secrets.process.env.REFRESH_TOKEN_SECRET,
        AWS_REGION: process.env.AWS_REGION || 'us-east-1',
        SECRET_NAME: process.env.SECRET_NAME || 'social-com',
        TWILIO_ACCOUNT_SID: secrets.process.env.twilio_account_sid,
        TWILIO_AUTH_TOKEN: secrets.process.env.twilio_auth_token,
        TWILIO_SERVICE_SID: process.env.twilio_service_sid,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
        APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
        APPLE_KEY_ID: process.env.APPLE_KEY_ID,
        APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY,
        APPLE_CALLBACK_URL: process.env.APPLE_CALLBACK_URL,
      };
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
