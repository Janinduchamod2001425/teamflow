import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthResponseDto } from './dto/health-response.dto';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getHealth(): HealthResponseDto {
    return {
      status: true,
      message: `${this.configService.get<string>('APP_NAME')} is running successfully!`,
      version: this.configService.get<string>('APP_VERSION') ?? '1.0.0',
    };
  }
}
