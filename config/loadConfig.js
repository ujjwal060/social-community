import dotenv from 'dotenv';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { logger } from "../utils/logger.js";

dotenv.config();

const ENV = process.env.NODE_ENV || "production";
const REGION = process.env.AWS_REGION || "us-east-1";
const SECRET_NAME = process.env.SECRET_NAME || "social-com";
const secretsManager = new SecretsManagerClient({ region: REGION });


// async function getSecrets() {
//   try {
//     const response = await secretsManager.send(
//       new GetSecretValueCommand({ SecretId: SECRET_NAME })
//     );

//     if (response.SecretString) {
//       return JSON.parse(response.SecretString);
//     }
//   } catch (error) {
//     console.error("Error retrieving secrets from AWS Secrets Manager:", error);
//     throw error;
//   }
// }

const loadConfig = async () => {
  if (ENV === 'production') {
    try {
      const response = await secretsManager.send(
        new GetSecretValueCommand({ SecretId: SECRET_NAME })
      );

      if (response.SecretString) {
      console.log(111,response);
        try {
          const secrets = JSON.parse(response.SecretString);
          console.log(222,secrets);
          
          return {
            PORT: secrets.PORT || 3030,
            DB_URI: secrets.DB_URI,
            ACCESS_TOKEN_SECRET: secrets.ACCESS_TOKEN_SECRET,
            REFRESH_TOKEN_SECRET: secrets.REFRESH_TOKEN_SECRET,
            AWS_REGION: secrets.AWS_REGION || 'us-east-1',
            SECRET_NAME: secrets.SECRET_NAME || 'social-com',
            TWILIO_ACCOUNT_SID: secrets.twilio_account_sid,
            TWILIO_AUTH_TOKEN: secrets.twilio_auth_token,
            TWILIO_SERVICE_SID: secrets.twilio_service_sid,
            GOOGLE_CLIENT_ID: secrets.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: secrets.GOOGLE_CLIENT_SECRET,
            GOOGLE_CALLBACK_URL: secrets.GOOGLE_CALLBACK_URL,
            APPLE_CLIENT_ID: secrets.APPLE_CLIENT_ID,
            APPLE_TEAM_ID: secrets.APPLE_TEAM_ID,
            APPLE_KEY_ID: secrets.APPLE_KEY_ID,
            APPLE_PRIVATE_KEY: secrets.APPLE_PRIVATE_KEY,
            APPLE_CALLBACK_URL: secrets.APPLE_CALLBACK_URL,
          };
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          throw new Error("Failed to parse secret value as JSON");
        }
      }
      throw new Error("No secret string found in the response");
    } catch (error) {
      console.error("AWS Secrets Fetch Error:", error);
      throw new Error("Failed to load secrets from AWS Secrets Manager");
    }
  }

  // logger.info('Running in development mode. Using .env for configuration.');

  // return {
  //   NODE_ENV: process.env.NODE_ENV || 'development',
  //   PORT: process.env.PORT || 3030,
  //   DB_URI: process.env.DB_URI,
  //   ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  //   REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  //   AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  //   SECRET_NAME: process.env.SECRET_NAME || 'social-com',
  //   TWILIO_ACCOUNT_SID: process.env.twilio_account_sid,
  //   TWILIO_AUTH_TOKEN: process.env.twilio_auth_token,
  //   TWILIO_SERVICE_SID: process.env.twilio_service_sid,
  //   GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  //   GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  //   GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  //   APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  //   APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
  //   APPLE_KEY_ID: process.env.APPLE_KEY_ID,
  //   APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY,
  //   APPLE_CALLBACK_URL: process.env.APPLE_CALLBACK_URL,
  // }
};

export { loadConfig };
