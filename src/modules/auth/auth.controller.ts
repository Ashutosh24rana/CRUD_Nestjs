import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginUserDto)  //this will extract the login data from request body and ensures it matches Loginuserdto structure
   {
    return this.authService.login(dto);//this will call login method in auth service
  }
}
