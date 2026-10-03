export class AuthSession {
  constructor(
    public readonly token: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date = new Date(),
  ) {}
}
