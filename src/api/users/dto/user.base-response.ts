import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'prisma/generated/enums';
import { SafeUserData } from 'src/shared/domain/users/user.entity';

export class UserBaseResponse implements SafeUserData {
  @ApiProperty({
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User emaill',
    example: 'john@mail.com',
  })
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User access role',
    enum: UserRole,
    example: UserRole.HR,
  })
  role: UserRole;

  @ApiProperty({
    description: 'User creation date',
    example: '2026-03-27T15:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update time',
    example: '2026-03-27T15:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User deletion date',
    example: null,
  })
  deletedAt?: Date;
}
