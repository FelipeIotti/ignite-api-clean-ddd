import { Either, left, right } from "@/core/entities/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Answer } from "../entities/answer";
import { AnswerAttachment } from "../entities/answer-attachment";
import { AnswerAttachmentList } from "../entities/answer-attachment-list";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments.repository";
import { AnswersRepository } from "../repositories/answers.repository";

interface EditAnswerServiceRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerService {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerServiceRequest): Promise<EditAnswerServiceResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments
    );

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });

    answerAttachmentList.update(answerAttachments);

    answer.attachments = answerAttachmentList;
    answer.content = content;

    await this.answersRepository.save(answer);

    return right({
      answer,
    });
  }
}
