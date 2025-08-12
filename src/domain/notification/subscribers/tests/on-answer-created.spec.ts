import { makeAnswer } from "@/tests/factories/make-answer";
import { makeQuestion } from "@/tests/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "@/tests/repositories/in-memory-answer-attachments.repository";
import { InMemoryAnswersRepository } from "@/tests/repositories/in-memory-answers-repository";
import { InMemoryNotificationsRepository } from "@/tests/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "@/tests/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "@/tests/repositories/in-memory-questions-repository";
import { waitFor } from "@/tests/utils/wait-for";
import { SpyInstance } from "vitest";
import {
  SendNotificationService,
  SendNotificationServiceRequest,
  SendNotificationServiceResponse,
} from "../../services/send-notification.service";
import { OnAnswerCreated } from "../on-answer-created";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationService: SendNotificationService;

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationServiceRequest],
  Promise<SendNotificationServiceResponse>
>;

describe("On Answer Created", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationService = new SendNotificationService(
      inMemoryNotificationsRepository
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationService, "execute");

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationService);
  });

  it("should  send a notification when an answer is created", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
