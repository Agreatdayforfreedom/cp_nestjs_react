import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/models/user.model';
import { UsersService } from '../../users/services/users.service';
import { Notification } from '../entities/notification.entity';
import { NotificationType } from '../member.resolver';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UsersService,
  ) {}
  async findNotifications(cUser: User) {
    return await this.notificationRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: cUser.id,
        },
      },
    });
  }

  async createNotification(
    data: string,
    // type: NotificationType,
    userId: number,
  ) {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new HttpException('User not found', 404);

    const newNotification = this.notificationRepository.create({
      data,
      //   type,
    });

    newNotification.user = user;

    return await this.notificationRepository.save(newNotification);
  }
}
