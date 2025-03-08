import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { MakeStudent } from 'test/factories/make-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { AuthenticateStudentUseCase } from './authenticate-student';

let inMemoryInMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryInMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(
      inMemoryInMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter
    ); // system under test
  });

  it('Should be able authenticate a student', async () => {
    const student = MakeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryInMemoryStudentsRepository.items.push(student);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
