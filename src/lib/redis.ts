import { Redis } from "@upstash/redis";

const url = process.env.REDIS_URL;
const token = process.env.REDIS_TOKEN;

export const redis = url && token
  ? new Redis({ url, token })
  : null;
