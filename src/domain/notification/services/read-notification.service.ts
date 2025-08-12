import { Either, left, right } from "@/core/entities/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Notification } from "../entities/notification";
import { NotificationsRepository } from "../repositories/notifications.repository";

interface ReadNotificationServiceRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationService {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationServiceRequest): Promise<ReadNotificationServiceResponse> {
    const notification = await this.notificationsRepository.findById(
      notificationId
    );

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({ notification });
  }
}
