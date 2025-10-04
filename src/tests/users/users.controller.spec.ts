import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../modules/users/users.controller';
import { UsersService } from '../../modules/users/users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUser = { id: 1, email: 'admin@example.com', role: 'admin' };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(mockUser),
  };

  const mockGuard = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should create user', async () => {
    const dto = { email: 'admin@example.com', password: '123456', role: 'admin' };
    expect(await controller.create(dto)).toEqual(mockUser);
  });

  it('should get all users', async () => {
    const req = { user: { role: 'admin' } };
    expect(await controller.findAll(req)).toEqual([mockUser]);
  });

  it('should get one user', async () => {
    const req = { user: { role: 'admin', id: 1 } };
    expect(await controller.findOne(req, '1')).toEqual(mockUser);
  });
});
