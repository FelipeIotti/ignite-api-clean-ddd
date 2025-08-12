import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { Either, left, right } from "@/core/entities/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { AnswerComment } from "../entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments.repository";
import { AnswersRepository } from "../repositories/answers.repository";

interface CommentOnAnswerServiceRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerServiceResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerService {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerServiceRequest): Promise<CommentOnAnswerServiceResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({
      answerComment,
    });
  }
}
