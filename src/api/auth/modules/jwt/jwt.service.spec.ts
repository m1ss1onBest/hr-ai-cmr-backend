process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'access_secret';
process.env.ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION ?? '15m';
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? 'refresh_secret';
process.env.REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION ?? '7d';

import { JwtService } from '@nestjs/jwt';
import { JwtTokensService } from './jwt.service';
import { Test, TestingModule } from '@nestjs/testing';
import { IJwtPayload } from './jwt.interface';
import { AuthConfig } from '../configs';

describe('JwtTokensService', () => {
  let service: JwtTokensService;

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockAuthConfig = {
    ACCESS_TOKEN_SECRET: 'access_secret',
    ACCESS_TOKEN_EXPIRATION: '15m',
    REFRESH_TOKEN_SECRET: 'refresh_secret',
    REFRESH_TOKEN_EXPIRATION: '7d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokensService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuthConfig, useValue: mockAuthConfig },
      ],
    }).compile();

    service = module.get<JwtTokensService>(JwtTokensService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate access token', async () => {
    const payload: IJwtPayload = { sub: '123', email: 'user@gmail.com' };
    mockJwtService.signAsync.mockResolvedValue('mocked_token');

    const token = await service.generateAccessToken(payload);

    expect(token).toBe('mocked_token');
    expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload);
  });

  it('should verify access token successfully', async () => {
    const payload: IJwtPayload = { sub: '123', email: 'test@example.com' };
    mockJwtService.verifyAsync.mockResolvedValue(payload);

    const result = await service.verifyAccessToken('token');

    expect(result).toEqual(payload);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('token');
  });

  it('should return null if access token verification fails', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const result = await service.verifyAccessToken('bad_token');

    expect(result).toBeNull();
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('bad_token');
  });

  it('should generate refresh token with custom secret/expiration', async () => {
    const payload: IJwtPayload = { sub: '123', email: 'user@gmail.com' };
    mockJwtService.signAsync.mockResolvedValue('refresh_token');

    const { token, jti } = await service.generateRefreshToken(payload);

    expect(token).toBe('refresh_token');
    expect(typeof jti).toBe('string');
    expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
    const [callPayload, callOptions] = mockJwtService.signAsync.mock.calls[0] as unknown as [
      { sub: string; email: string; jti: string },
      { secret: string; expiresIn: string },
    ];

    expect(callPayload.sub).toBe(payload.sub);
    expect(callPayload.email).toBe(payload.email);
    expect(typeof callPayload.jti).toBe('string');

    expect(callOptions).toMatchObject({
      secret: mockAuthConfig.REFRESH_TOKEN_SECRET,
      expiresIn: mockAuthConfig.REFRESH_TOKEN_EXPIRATION,
    });
  });

  it('should verify refresh token successfully with custom secret', async () => {
    mockJwtService.verifyAsync.mockResolvedValue({
      sub: '123',
      email: 'test@example.com',
      jti: 'jti_1',
    });

    const result = await service.verifyRefreshToken('refresh');

    expect(result).toEqual({
      sub: '123',
      email: 'test@example.com',
      jti: 'jti_1',
    });

    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('refresh', {
      secret: mockAuthConfig.REFRESH_TOKEN_SECRET,
    });
  });
});
