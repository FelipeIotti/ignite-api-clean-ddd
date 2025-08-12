import { Either, left, right } from "@/core/entities/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { AnswerCommentsRepository } from "../repositories/answer-comments.repository";

interface DeleteAnswerCommentServiceRequest {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteAnswerCommentService {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentServiceRequest): Promise<DeleteAnswerCommentServiceResponse> {
    const answerComment = await this.answerCommentsRepository.findById(
      answerCommentId
    );

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.answerCommentsRepository.delete(answerComment);

    return right({});
  }
}
