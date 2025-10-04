import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../modules/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mock bcrypt once at the top
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser = {
    id: 1,
    email: 'admin@example.com',
    password: 'hashedpassword',
    role: 'admin',
  };

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(mockUser);
    mockRepo.save.mockResolvedValue(mockUser);

    // ✅ Use cast to jest.Mock
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

    const result = await service.create({ email: 'admin@example.com', password: '123456', role: 'admin' });
    expect(result).toEqual(mockUser);
  });

  it('should throw error if email exists', async () => {
    mockRepo.findOne.mockResolvedValue(mockUser);
    await expect(service.create({ email: 'admin@example.com', password: '123456', role: 'admin' })).rejects.toThrow(BadRequestException);
  });

  it('should return all users', async () => {
    mockRepo.find.mockResolvedValue([mockUser]);
    const result = await service.findAll();
    expect(result).toEqual([mockUser]);
  });

  it('should find one user', async () => {
    mockRepo.findOne.mockResolvedValue(mockUser);
    const result = await service.findOne(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });
});
