export class CreateUserDbDto {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly passwordHash: string,
  ) {}
}
