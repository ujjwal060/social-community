import express from 'express';
import loadConfig from './config/loadConfig.js';
import connectToDatabase from './config/db.js';
import {logger} from "./utils/logger.js";
import routes from './routes/index.js';

const startServer = async () => {
    try {
        const config = await loadConfig();

        await loadConfig();
        const app = express();

        app.use(express.json());

        await connectToDatabase('mongodb+srv://ujjwalsingh:ujjwal123@cluster0.qbl1z.mongodb.net/social-community');
        console.log(555);

        app.use('/', routes);

        const PORT = 3030;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Server failed to start: ${error.message}`);
    }

};

startServer();