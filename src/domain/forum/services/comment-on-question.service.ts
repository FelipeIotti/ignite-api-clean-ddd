import { Either, left, right } from "@/core/entities/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { QuestionComment } from "../entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { QuestionsRepository } from "../repositories/question.repository";

interface CommentOnQuestionServiceRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionServiceResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionService {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionServiceRequest): Promise<CommentOnQuestionServiceResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentsRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
