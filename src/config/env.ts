import dotenv from 'dotenv';

dotenv.config();

interface env {
  port: number;
  nodeEnv: string;
  jwt_secret: string;
}

const env: env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt_secret: `${process.env.JWT_SECRET!}`
};

export default env;
