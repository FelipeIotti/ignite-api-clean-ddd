import { Either, left, right } from "@/core/entities/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Question } from "../entities/question";
import { QuestionsRepository } from "../repositories/question.repository";

interface GetQuestionBySlugServiceRequest {
  slug: string;
}

type GetQuestionBySlugServiceResponse = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

export class GetQuestionBySlugService {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugServiceRequest): Promise<GetQuestionBySlugServiceResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}
