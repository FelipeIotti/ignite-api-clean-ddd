import { InMemoryNotificationsRepository } from "@/tests/repositories/in-memory-notifications-repository";
import { SendNotificationService } from "../send-notification.service";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationService;

describe("Send Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationService(inMemoryNotificationsRepository);
  });

  it("should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "1",
      title: "Nova notificação",
      content: "Conteúdo da notificação",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification
    );
  });
});
