import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification_Type } from '../../interfaces/enums';
import { User } from '../../users/models/user.model';
import { UsersService } from '../../users/services/users.service';
import { Notification } from '../entities/notification.entity';

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
      order: {
        created_at: 'DESC',
      },
      take: 20,
    });
  }

  async createNotification(data: string, type: string, userId: number) {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new HttpException('User not found', 404);

    const newNotification = this.notificationRepository.create({
      data,
      type,
    });

    newNotification.user = user;

    return await this.notificationRepository.save(newNotification);
  }

  async markAsRead(notificationId: number, cUser: User) {
    const notification = await this.notificationRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: notificationId,
      },
    });

    if (!notification) throw new HttpException('Notification not found', 404);
    if (notification.user.id !== cUser.id)
      throw new HttpException(
        'Something was wrong, notification does not belong to the current user',
        500,
      );

    notification.read = true;
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(cUser: User) {
    await this.notificationRepository.update(
      { user: { id: cUser.id } },
      { read: true },
    );
    return cUser.id;
  }
}
