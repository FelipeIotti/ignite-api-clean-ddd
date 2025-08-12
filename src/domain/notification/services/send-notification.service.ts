import { Either, right } from "@/core/entities/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Notification } from "../entities/notification";
import { NotificationsRepository } from "../repositories/notifications.repository";

export interface SendNotificationServiceRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationServiceResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationService {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationServiceRequest): Promise<SendNotificationServiceResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return right({
      notification,
    });
  }
}
