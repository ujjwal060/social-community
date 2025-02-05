import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

const loadConfig = async () => {
  const config = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.DB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    SECRET_NAME: process.env.SECRET_NAME || 'john3',
  };

  if (config.NODE_ENV === 'production') {
    console.log('Fetching secrets from AWS Secrets Manager...');
    const secretsManager = new AWS.SecretsManager({ region: config.AWS_REGION });

    try {
      const secretData = await secretsManager.getSecretValue({ SecretId:'john3' }).promise();

      if (secretData.SecretString) {
        const secrets = JSON.parse(secretData.SecretString);

        return { ...config, ...secrets };
      }
    } catch (error) {
      console.error('Error fetching secrets from AWS Secrets Manager:', error);
      process.exit(1);
    }
  }

  console.log('Running in development mode. Using .env for configuration.');
  return config;
};

export default loadConfig;
