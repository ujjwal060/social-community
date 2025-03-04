import dotenv from "dotenv";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

dotenv.config();

const ENV = process.env.NODE_ENV || "development";
const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION || "us-east-1" });

async function getConfig() {
  let config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3030,
    DB_URI: process.env.DB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    AWS_REGION: process.env.AWS_REGION || "us-east-1",
    SECRET_NAME: process.env.SECRET_NAME || "social-com",
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

  if (NODE_ENV === "production") {
    try {
      console.log("Fetching secrets from AWS...");

      const command = new GetSecretValueCommand({
        SecretId: config.SECRET_NAME,
      });

      const response = await secretsManager.send(command);

      if (response.SecretString) {
        const secrets = JSON.parse(response.SecretString);

        console.log("Secrets successfully loaded from AWS.");

        // Overriding config with AWS secrets
        config = {
          ...config, // Keep existing .env values
          ...secrets, // Override with AWS secrets
        };
      } else {
        throw new Error("No secret string found in the response");
      }
    } catch (error) {
      console.error("AWS Secrets Fetch Error:", error);
      throw new Error("Failed to load secrets from AWS Secrets Manager");
    }
  } else {
    console.log("Running in development mode. Using .env values.");
  }

  return config;
}

export default getConfig;
