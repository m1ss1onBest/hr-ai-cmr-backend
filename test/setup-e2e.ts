// 1. Мок для ioredis (це ми вже маємо)
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        on: jest.fn(),
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        quit: jest.fn().mockResolvedValue('OK'),
        status: 'ready',
    }));
}, { virtual: true });

import { MinioService } from '../src/shared/infrastructure/storage/services/minio.service';

jest.spyOn(MinioService.prototype, 'onModuleInit').mockImplementation(async () => {});
jest.spyOn(MinioService.prototype, 'uploadFile').mockImplementation(async () => {});
jest.spyOn(MinioService.prototype, 'getFileBuffer').mockImplementation(async () => Buffer.from(''));
jest.spyOn(MinioService.prototype, 'checkFileType').mockImplementation(async () => 'PDF');

// 3. Решта твоїх налаштувань (file-type, env змінні)
jest.mock('file-type', () => ({
    fileTypeFromBuffer: jest.fn().mockResolvedValue({ mime: 'application/pdf', ext: 'pdf' }),
}), { virtual: true });

process.env.EMAIL_FORGOT_PASSWORD_URL = 'http://localhost:3000/reset-password';
process.env.GEMINI_API_KEY = 'test';
process.env.ACCESS_TOKEN_SECRET = 'secret';