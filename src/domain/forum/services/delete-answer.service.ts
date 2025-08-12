import { Either, left, right } from "@/core/entities/either";

import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { AnswersRepository } from "../repositories/answers.repository";

interface DeleteAnswerServiceRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;

export class DeleteAnswerService {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerServiceRequest): Promise<DeleteAnswerServiceResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);

    return right({});
  }
}
