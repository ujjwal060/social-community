import express from 'express';
import loadConfig from './config/loadConfig.js';
import connectToDatabase from './config/db.js';
import {logger} from "./utils/logger.js";
import routes from './routes/index.js';

const startServer = async () => {
    try {
        console.log(111);
        
        const config = await loadConfig();
        console.log(222);

        await loadConfig();
        const app = express();
        console.log(333);

        app.use(express.json());
        console.log(444);

        await connectToDatabase(config.DB_URI);
        console.log(555);

        app.use('/', routes);

        const PORT = config.PORT;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Server failed to start: ${error.message}`);
    }

};

startServer();