import { UsersRepository } from 'src/shared/infrastructure/database/repositories/users.repository';
import { DeleteUserResponse } from '../../dto/delete.user.dto';
import { IDeleteUserUseCase } from './delete-user.interface';
import { EventHandlerLogger } from 'src/shared/infrastructure/logger/handler-logger.service';
import { User } from 'src/shared/domain/users/user.entity';

export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(
    private readonly users: UsersRepository,
    private readonly event: EventHandlerLogger,
  ) {}
  async run(request: {
    userId: string;
    adminId?: string;
  }): Promise<DeleteUserResponse> {
    try {
      const userData = await this.users.deleteOne(request.userId);
      this.event.log(
        `User ${userData.id} was successfully deleted by ${request.adminId}`,
      );
      return new User(userData).safe();
    } catch {
      this.event.badRequest(`Failed to delete user ${request.userId}`);
    }
  }
}
