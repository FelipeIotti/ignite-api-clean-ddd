import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { Either, right } from "@/core/entities/either";
import { Question } from "../entities/question";
import { QuestionAttachment } from "../entities/question-attachment";
import { QuestionAttachmentList } from "../entities/question-attachment-list";
import { QuestionsRepository } from "../repositories/question.repository";

interface CreateQuestionServiceRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type CreateQuestionServiceResponse = Either<
  null,
  {
    question: Question;
  }
>;

export class CreateQuestionService {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionServiceRequest): Promise<CreateQuestionServiceResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    });

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      });
    });

    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.questionsRepository.create(question);

    return right({
      question,
    });
  }
}
