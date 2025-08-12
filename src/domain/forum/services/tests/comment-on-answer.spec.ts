import { makeAnswer } from "@/tests/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "@/tests/repositories/in-memory-answer-attachments.repository";
import { InMemoryAnswerCommentsRepository } from "@/tests/repositories/in-memory-answer-comments.repository";
import { InMemoryAnswersRepository } from "@/tests/repositories/in-memory-answers-repository";
import { CommentOnAnswerService } from "../comment-on-answer.service";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerService;

describe("Comment on Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

    sut = new CommentOnAnswerService(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository
    );
  });

  it("should be able to comment on answer", async () => {
    const answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Comentário teste",
    });

    expect(inMemoryAnswerCommentsRepository.items[0]?.content).toEqual(
      "Comentário teste"
    );
  });
});
