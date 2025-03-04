import dotenv from 'dotenv';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import {logger} from "../utils/logger.js"


// dotenv.config();

const loadConfig = async () => {
//   const config = {
//     NODE_ENV: process.env.NODE_ENV || 'development',
//     PORT: process.env.PORT || 3030,
//     DB_URI: process.env.DB_URI,
//     ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
//     REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
//     AWS_REGION: process.env.AWS_REGION || 'us-east-1',
//     SECRET_NAME: process.env.SECRET_NAME || 'social-com',
//   };

//   if (config.NODE_ENV === 'production') {
//     logger.info('Fetching secrets from AWS Secrets Manager...');
//     const secretsManager = new SecretsManagerClient({ region: "us-east-1" });
//     try {
//       const secretData = new GetSecretValueCommand({
//         SecretId: "social-com",
//       });
//       const response = await secretsManager.send(secretData);
//       console.log(111,response);
//       if (response.SecretString) {
//         const secrets = JSON.parse(response.SecretString);
//       console.log(222,secrets);
//         logger.info('Secrets successfully loaded from AWS.');
//         return { ...config, ...secrets };
//       }
//     } catch (error) {
//       console.log(error);
      
//       logger.error(`Error fetching secrets from AWS Secrets Manager: ${error.message}`);
//       process.exit(1);
//     }
//   }

//   logger.info('Running in development mode. Using .env for configuration.');
//   return config;
};

// export default loadConfig;

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
        
        // Parse the secret string to JSON
        const secrets = JSON.parse(response.SecretString);
        return secrets;
    } catch (error) {
        console.error('Error retrieving secrets:', error);
        throw error;
    }
}

async function getSpecificSecret(key) {
    try {
        const secrets = await getSecrets();
        return secrets[key];
    } catch (error) {
        console.error(`Error retrieving secret for key ${key}:`, error);
        throw error;
    }
}

export {
    getSecrets,
    getSpecificSecret,
    loadConfig
};
