import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: true,
      message: 'TeamFlow Backend is running successfully 🚀',
      version: '1.0.0',
    };
  }
}
