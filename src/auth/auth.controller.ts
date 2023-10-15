import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import {User} from "./schemas/user.schema";
import {UpdatedRolesDto} from "./dto/updated-roles.dto";
import {AuthGuard} from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('/users')
  getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Get('/users/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.authService.getUserById(id);
  }


  @Put('/users/:id')
  @UsePipes(new ValidationPipe())
  async updateUserRoles(@Param('id') id: string, @Body() updatedRoles: UpdatedRolesDto): Promise<User> {
    return await this.authService.updateUserRoles(id, updatedRoles);
  }
}
