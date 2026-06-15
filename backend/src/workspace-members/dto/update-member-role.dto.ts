import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateMemberRoleDto {
  @ApiProperty({
    enum: Role,
    example: Role.MANAGER,
  })
  @IsEnum(Role)
  role: Role;
}
