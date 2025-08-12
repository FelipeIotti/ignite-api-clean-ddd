import { Either, left, right } from "@/core/entities/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Question } from "../entities/question";
import { AnswersRepository } from "../repositories/answers.repository";
import { QuestionsRepository } from "../repositories/question.repository";

interface ChooseQuestionBestAnswerServiceRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerServiceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChooseQuestionBestAnswerService {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerServiceRequest): Promise<ChooseQuestionBestAnswerServiceResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
