import dotenv from 'dotenv-safe';
import app from './app';
import logger from './config/logger';

dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`🚀 @ http://localhost:${PORT}`));
