import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all users, excluding their passwords
  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const allowedSortFields = ['name', 'email', 'createdAt', 'updatedAt'];
    const sortBy = allowedSortFields.includes(query.sortBy ?? '')
      ? query.sortBy!
      : 'createdAt';

    const where = query.search
      ? {
          OR: [
            {
              name: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
            {
              email: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: query.order ?? 'desc',
        },
        omit: {
          password: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Create a new user with hashed password and check for email uniqueness
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });
  }

  // Get a user by ID, excluding the password
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    return user;
  }

  // Update a user by ID, hashing the password if it's being updated
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Ensure the user exists before updating

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      omit: {
        password: true,
      },
    });
  }

  // Delete a user by ID
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return null;
  }

  // Find a user by email, used for authentication purposes
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
