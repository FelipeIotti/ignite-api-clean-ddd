import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/events/question-best-answer-chosen-event";
import { AnswersRepository } from "@/domain/forum/repositories/answers.repository";
import { SendNotificationService } from "../services/send-notification.service";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationService
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString()
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida!`,
        content: `A resposta que você enviou em "${question.title
          .substring(0, 20)
          .concat("...")}" foi escolhida pelo autor!"`,
      });
    }
  }
}
