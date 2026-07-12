import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class RespondInvitationDto {
  @ApiProperty({ enum: ['ACCEPTED', 'DECLINED'], example: 'ACCEPTED' })
  @IsIn(['ACCEPTED', 'DECLINED'])
  status: 'ACCEPTED' | 'DECLINED';
}
