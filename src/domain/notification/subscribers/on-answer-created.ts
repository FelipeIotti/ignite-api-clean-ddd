import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswerCreatedEvent } from "@/domain/forum/events/answer-created-event";
import { QuestionsRepository } from "@/domain/forum/repositories/question.repository";
import { SendNotificationService } from "../services/send-notification.service";

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationService
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title
          .substring(0, 40)
          .concat("...")}"`,
        content: answer.excerpt,
      });
    }
  }
}
