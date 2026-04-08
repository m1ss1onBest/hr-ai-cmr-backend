import { registerAs } from '@nestjs/config';

export default registerAs('files', () => ({
  driver: process.env.FILE_STORAGE_DRIVER || 'local', // local | s3 (future)
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxSizeBytes: parseInt(process.env.RESUME_MAX_SIZE_BYTES || '10485760', 10), // 10MB
}));

