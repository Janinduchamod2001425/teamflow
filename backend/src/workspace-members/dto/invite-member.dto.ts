import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class InviteMemberDto {
  @ApiProperty({
    example: 'member@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: Role,
    example: Role.MEMBER,
  })
  @IsEnum(Role)
  role: Role;
}
