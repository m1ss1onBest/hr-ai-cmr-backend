import { JwtService } from '@nestjs/jwt';
import { JwtTokensService } from './jwt.service';
import { Test, TestingModule } from '@nestjs/testing';
import { IJwtPayload } from './jwt.interface';

describe('JwtTokensService', () => {
  let service: JwtTokensService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokensService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<JwtTokensService>(JwtTokensService);
    jwtService = module.get<JwtService>(JwtService);
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

  it('should return null if token verification fails', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const result = await service.verifyAccessToken('bad_token');

    expect(result).toBeNull();
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('bad_token');
  });
});
