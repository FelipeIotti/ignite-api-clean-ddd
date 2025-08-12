import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentsRepository } from "@/tests/repositories/in-memory-answer-attachments.repository";
import { InMemoryAnswersRepository } from "@/tests/repositories/in-memory-answers-repository";
import { AnswerQuestionService } from "../answer-question.service";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionService;

describe("Create Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new AnswerQuestionService(inMemoryAnswersRepository);
  });

  it("should be able to create a answer", async () => {
    const result = await sut.execute({
      questionId: "1",
      instructorId: "1",
      content: "Conteúdo da resposta",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
    ]);
  });
});
