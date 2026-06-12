import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// The UpdateUserDto extends the CreateUserDto, making all fields optional for updates
export class UpdateUserDto extends PartialType(CreateUserDto) {}
