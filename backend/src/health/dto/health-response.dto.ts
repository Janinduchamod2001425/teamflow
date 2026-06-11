import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'TeamFlow Backend is running successfully!' })
  message: string;

  @ApiProperty({ example: '1.0.0' })
  version: string;
}
