export class AuthSession {
  constructor(
    public readonly tokenHash: string,
    public readonly userId: string,
    public readonly installationId: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date = new Date(),
    public readonly revokedAt?: Date,
  ) {}
}
