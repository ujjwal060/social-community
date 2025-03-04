import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import {logger} from "../utils/logger.js"


dotenv.config();

const loadConfig = async () => {
  const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3030,
    DB_URI: process.env.DB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    SECRET_NAME: process.env.SECRET_NAME || 'social-com',
  };

  if (config.NODE_ENV === 'production') {
    logger.info('Fetching secrets from AWS Secrets Manager...');
    const secretsManager = new AWS.SecretsManager({ region:config.AWS_REGION});
    try {
      const secretData = await secretsManager.getSecretValue({ SecretId:'social-com' }).promise();
      if (secretData.SecretString) {
        const secrets = JSON.parse(secretData.SecretString);

        logger.info('Secrets successfully loaded from AWS.');
        return { ...config, ...secrets };
      }
    } catch (error) {
      logger.error(`Error fetching secrets from AWS Secrets Manager: ${error.message}`);
      process.exit(1);
    }
  }

  logger.info('Running in development mode. Using .env for configuration.');
  return config;
};

export default loadConfig;
