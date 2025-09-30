import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_DB
} = process.env;

// Redis client configuration
const redisConfig = {
  socket: {
    host: REDIS_HOST || 'localhost',
    port: parseInt(REDIS_PORT) || 6379,
  },
  password: REDIS_PASSWORD || undefined,
  database: parseInt(REDIS_DB) || 0,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null
};

// Create Redis client
const redisClient = createClient(redisConfig);

// Redis event handlers
redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis Client Connected');
});

redisClient.on('ready', () => {
  console.log('✅ Redis Client Ready');
});

redisClient.on('end', () => {
  console.log('✅ Redis Client Disconnected');
});

// Test Redis connection
const testConnection = async () => {
  try {
    console.log('🔍 Redis connection details:');
    console.log(`Host: ${REDIS_HOST || 'localhost'}`);
    console.log(`Port: ${REDIS_PORT || 6379}`);
    console.log(`Password: ${REDIS_PASSWORD ? '***' : 'none'}`);
    console.log(`Database: ${REDIS_DB || 0}`);
    
    await redisClient.connect();
    await redisClient.ping();
    console.log('✅ Redis connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to Redis:', error);
    console.log('⚠️  Continuing without Redis - caching will be disabled');
    // Don't throw error to prevent app crash
    // throw error;
  }
};

// Helper functions for common Redis operations
const cache = {
  // Set cache with expiration
  set: async (key, value, ttl = 3600) => {
    try {
      if (!redisClient.isOpen) {
        console.log('Redis not connected, skipping cache set');
        return;
      }
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await redisClient.setEx(key, ttl, serializedValue);
      } else {
        await redisClient.set(key, serializedValue);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  },

  // Get cache
  get: async (key) => {
    try {
      if (!redisClient.isOpen) {
        console.log('Redis not connected, skipping cache get');
        return null;
      }
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  // Delete cache
  del: async (key) => {
    try {
      if (!redisClient.isOpen) {
        console.log('Redis not connected, skipping cache delete');
        return;
      }
      await redisClient.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  },

  // Check if key exists
  exists: async (key) => {
    try {
      if (!redisClient.isOpen) {
        console.log('Redis not connected, skipping cache exists check');
        return false;
      }
      return await redisClient.exists(key);
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  },

  // Set session data
  setSession: async (sessionId, data, ttl = 86400) => {
    await cache.set(`session:${sessionId}`, data, ttl);
  },

  // Get session data
  getSession: async (sessionId) => {
    return await cache.get(`session:${sessionId}`);
  },

  // Delete session
  deleteSession: async (sessionId) => {
    await cache.del(`session:${sessionId}`);
  }
};

export { redisClient, testConnection, cache };
export default redisClient;
