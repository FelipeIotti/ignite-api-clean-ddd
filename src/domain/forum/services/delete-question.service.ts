import { Either, left, right } from "@/core/entities/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { QuestionsRepository } from "../repositories/question.repository";

interface DeleteQuestionServiceRequest {
  authorId: string;
  questionId: string;
}

type DeleteQuestionServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>;
export class DeleteQuestionService {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionServiceRequest): Promise<DeleteQuestionServiceResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);

    return right({});
  }
}
