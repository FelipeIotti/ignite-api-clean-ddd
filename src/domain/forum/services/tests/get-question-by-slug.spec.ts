import { makeQuestion } from "@/tests/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "@/tests/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "@/tests/repositories/in-memory-questions-repository";
import { Slug } from "../../entities/value-objects/slug";
import { GetQuestionBySlugService } from "../get-question-by-slug.service";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugService;

describe("Get Question By Slug", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new GetQuestionBySlugService(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("example-question"),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    });
  });
});
