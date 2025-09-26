import dotenv from 'dotenv';

dotenv.config();

interface env {
  port: number;
  nodeEnv: string;
}

const env: env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default env;
