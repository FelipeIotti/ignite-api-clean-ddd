import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "@/tests/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "@/tests/repositories/in-memory-answer-attachments.repository";
import { InMemoryAnswersRepository } from "@/tests/repositories/in-memory-answers-repository";
import { FetchQuestionAnswersService } from "../fetch-question-answers.service";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersService;

describe("Fetch Question Answers", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new FetchQuestionAnswersService(inMemoryAnswersRepository);
  });

  it("should be able to fetch question answers", async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("question-1"),
      })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("question-1"),
      })
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID("question-1"),
      })
    );

    const result = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it("should be able to fetch paginated question answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID("question-1"),
        })
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
