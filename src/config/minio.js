import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

const {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_USE_SSL,
  MINIO_BUCKET_NAME
} = process.env;

// MinIO client configuration
const minioClient = new Client({
  endPoint: MINIO_ENDPOINT || 'localhost',
  port: parseInt(MINIO_PORT) || 9000,
  useSSL: MINIO_USE_SSL === 'true',
  accessKey: MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: MINIO_SECRET_KEY || 'minioadmin',
  // Add SSL configuration for production
  region: 'us-east-1',
  transportAgent: MINIO_USE_SSL === 'true' ? undefined : undefined
});

// Initialize MinIO bucket
const initializeBucket = async () => {
  try {
    const bucketName = MINIO_BUCKET_NAME || 'riders-moto-media';
    const bucketExists = await minioClient.bucketExists(bucketName);
    
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`✅ Created bucket: ${bucketName}`);
    } else {
      console.log(`✅ Bucket already exists: ${bucketName}`);
    }
    
    // Set bucket policy for public read access to uploaded files
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`]
        }
      ]
    };
    
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    console.log(`✅ Set public read policy for bucket: ${bucketName}`);
    
  } catch (error) {
    console.error('❌ MinIO initialization error:', error);
    throw error;
  }
};

// Test MinIO connection
const testConnection = async () => {
  try {
    await minioClient.listBuckets();
    console.log('✅ MinIO connection established successfully.');
    await initializeBucket();
  } catch (error) {
    console.error('❌ Unable to connect to MinIO:', error);
    throw error;
  }
};

// Helper function to get file URL
const getFileUrl = (fileName) => {
  const bucketName = MINIO_BUCKET_NAME || 'riders-moto-media';
  const endpoint = MINIO_ENDPOINT || 'localhost';
  const port = MINIO_PORT || 9000;
  const protocol = MINIO_USE_SSL === 'true' ? 'https' : 'http';
  
  return `${protocol}://${endpoint}:${port}/${bucketName}/${fileName}`;
};

export { minioClient, testConnection, getFileUrl };
export default minioClient;
