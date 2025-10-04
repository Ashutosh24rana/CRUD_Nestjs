import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards,Request,ForbiddenException} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Anyone can register
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // Only admin can view all users
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can view all users');
    }
    return this.usersService.findAll();
  }

  // Admin or same user can view a single user
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'admin' && req.user.id !== +id) {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(+id);
  }

  // Only admin can update users
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can update users');
    }
    return this.usersService.update(+id, dto);
  }

  // Only admin can delete users
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Only admin can delete users');
    }
    return this.usersService.remove(+id);
  }
}