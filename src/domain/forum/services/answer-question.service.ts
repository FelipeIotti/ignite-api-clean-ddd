import { Either, right } from "@/core/entities/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer } from "../entities/answer";
import { AnswerAttachment } from "../entities/answer-attachment";
import { AnswerAttachmentList } from "../entities/answer-attachment-list";
import { AnswersRepository } from "../repositories/answers.repository";

interface AnswerQuestionServiceRequest {
  instructorId: string;
  questionId: string;
  attachmentsIds: string[];
  content: string;
}

type AnswerQuestionServiceResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionService {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionServiceRequest): Promise<AnswerQuestionServiceResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({ answer });
  }
}
