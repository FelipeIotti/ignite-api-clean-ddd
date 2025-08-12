import { Either, right } from "@/core/entities/either";
import { AnswerComment } from "../entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments.repository";

interface FetchAnswerCommentsServiceRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsServiceResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

export class FetchAnswerCommentsService {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsServiceRequest): Promise<FetchAnswerCommentsServiceResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({
      answerComments,
    });
  }
}
