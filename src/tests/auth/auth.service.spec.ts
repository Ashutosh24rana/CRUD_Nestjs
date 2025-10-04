import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../modules/auth/auth.service';
import { UsersService } from '../../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

// MOCK bcrypt once
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 1,
    email: 'admin@example.com',
    password: 'hashedpassword',
    role: 'admin',
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token123'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate user successfully', async () => {
    // Use cast to jest.Mock
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockUsersService.findByEmail.mockResolvedValue(mockUser);

    const result = await service.validateUser('admin@example.com', '123456');
    expect(result).toEqual({ id: 1, email: 'admin@example.com', role: 'admin' });
  });

  it('should throw UnauthorizedException on wrong password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    mockUsersService.findByEmail.mockResolvedValue(mockUser);

    await expect(service.validateUser('admin@example.com', 'wrong')).rejects.toThrow(UnauthorizedException);
  });

  it('should login and return JWT token', async () => {
    jest.spyOn(service, 'validateUser').mockResolvedValue({ id: 1, email: 'admin@example.com', role: 'admin' });
    const result = await service.login({ email: 'admin@example.com', password: '123456' });
    expect(result).toEqual({ access_token: 'token123' });
  });
});
