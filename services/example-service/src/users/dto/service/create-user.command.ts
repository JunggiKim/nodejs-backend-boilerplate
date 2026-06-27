export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
  ) {}

  static of(email: string, passwordHash: string, name: string): CreateUserCommand {
    return new CreateUserCommand(email, passwordHash, name);
  }
}
