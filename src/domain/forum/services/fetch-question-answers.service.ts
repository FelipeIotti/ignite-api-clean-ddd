import { Either, right } from "@/core/entities/either";
import { Answer } from "../entities/answer";
import { AnswersRepository } from "../repositories/answers.repository";

interface FetchQuestionAnswersServiceRequest {
  questionId: string;
  page: number;
}

type FetchQuestionAnswersServiceResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersService {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersServiceRequest): Promise<FetchQuestionAnswersServiceResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page }
    );

    return right({
      answers,
    });
  }
}
