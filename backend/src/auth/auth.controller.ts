import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user by accepting their name, email, and password, and creating them in the database
  @Public()
  @ResponseMessage('User registered successfully')
  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // Authenticate a user by accepting their email and password, verifying their credentials, and returning a JWT access token if successful

  @Public()
  @ResponseMessage('User logged in successfully')
  @ApiOperation({ summary: 'Login a user' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Get the currently authenticated user's information by validating their JWT access token and retrieving their user details from the database
  @ResponseMessage('Current user retrieved successfully')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: any) {
    return this.authService.me(user);
  }
}
