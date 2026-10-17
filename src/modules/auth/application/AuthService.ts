import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { BaseApiService } from "../../../core/application/BaseApiService";
import { AuthenticationError, ConflictError } from "../../../lib/errors";
import type { CreateSessionRequest } from "../contracts/AuthRequest";
import type { CreateSessionResponse } from "../contracts/AuthResponse";
import type { Installation } from "../entities/Installation";
import { AuthSession } from "../entities/AuthSession";
import type { InstallationRepository } from "./InstallationRepository";
import type { SessionRepository } from "./SessionRepository";
import type { UserRepository } from "../../users/application/UserRepository";
import { UserEntity } from "../../users/entities/UserEntity";

const ACCESS_SESSION_TTL_MS = 15 * 60 * 1000;

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function safeHashEquals(left: string, right: string): boolean {
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function generatedUsername(): string {
  return `seeker-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function validTimezone(timezone: string | undefined): string {
  if (!timezone) return "Asia/Kolkata";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
    return timezone;
  } catch {
    return "Asia/Kolkata";
  }
}

function isDuplicateKey(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000;
}

export class AuthService extends BaseApiService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
    private readonly installationRepository: InstallationRepository,
  ) { super(); }

  async createSession(input: CreateSessionRequest): Promise<CreateSessionResponse> {
    return this.execute("auth.createSession", async () => {
      const now = new Date();
      const secretHash = sha256(input.installationSecret);
      let installation = await this.installationRepository.findById(input.installationId);
      let user: UserEntity | null;

      if (installation) {
        if (!safeHashEquals(installation.secretHash, secretHash)) {
          throw new AuthenticationError("Installation credentials are invalid");
        }
        user = await this.userRepository.findById(installation.userId);
        if (!user) throw new AuthenticationError("Installation is not associated with an active user");
        if (user.status !== "active") throw new AuthenticationError("User is not active");
        installation = {
          ...installation,
          platform: input.platform,
          appVersion: input.appVersion,
          osVersion: input.osVersion,
          deviceModel: input.deviceModel,
          language: input.language ?? installation.language,
          timezone: validTimezone(input.timezone ?? installation.timezone),
          updatedAt: now,
          lastSeenAt: now,
        };
        await this.installationRepository.update(installation);
      } else {
        user = await this.userRepository.findByAuth("installation", input.installationId);
        if (!user) {
          const newUser = new UserEntity(
            randomUUID(),
            "installation",
            input.installationId,
            validTimezone(input.timezone),
            input.language ?? "en",
            "active",
            undefined,
            undefined,
            now,
            now,
            generatedUsername(),
          );
          try {
            user = await this.userRepository.create(newUser);
          } catch (error) {
            if (!isDuplicateKey(error) && !(error instanceof ConflictError)) throw error;
            user = await this.userRepository.findByAuth("installation", input.installationId);
            if (!user) throw error;
          }
        }
        if (user.status !== "active") throw new AuthenticationError("User is not active");
        const newInstallation: Installation = {
          installationId: input.installationId,
          secretHash,
          userId: String(user._id),
          platform: input.platform,
          appVersion: input.appVersion,
          osVersion: input.osVersion,
          deviceModel: input.deviceModel,
          language: input.language ?? "en",
          timezone: validTimezone(input.timezone),
          createdAt: now,
          updatedAt: now,
          lastSeenAt: now,
        };
        try {
          installation = await this.installationRepository.create(newInstallation);
        } catch (error) {
          if (!isDuplicateKey(error) && !(error instanceof ConflictError)) throw error;
          installation = await this.installationRepository.findById(input.installationId);
          if (!installation || !safeHashEquals(installation.secretHash, secretHash)) {
            throw new AuthenticationError("Installation credentials are invalid");
          }
          user = await this.userRepository.findById(installation.userId);
          if (!user) throw new AuthenticationError("Installation is not associated with an active user");
        }
      }

      if (!user) throw new AuthenticationError("Installation is not associated with an active user");
      if (!user.username) {
        user.username = generatedUsername();
        await this.userRepository.update(user);
      }

      const token = randomBytes(32).toString("base64url");
      const expiresAt = new Date(Date.now() + ACCESS_SESSION_TTL_MS);
      await this.sessionRepository.save(new AuthSession(
        sha256(token), String(user._id), input.installationId, expiresAt, now,
      ));

      return {
        session: { token, expiresAt: expiresAt.toISOString() },
        user: {
          id: String(user._id),
          username: user.username,
          ...(user.displayName ? { displayName: user.displayName } : {}),
          provider: user.authProvider,
          status: user.status,
          timezone: user.timezone,
          language: user.language,
        },
        installation: {
          installationId: installation.installationId,
          platform: installation.platform,
          createdAt: installation.createdAt.toISOString(),
        },
      };
    }, { installationId: input.installationId, platform: input.platform });
  }

  async revokeSession(token: string): Promise<void> {
    await this.execute("auth.revokeSession", () => this.sessionRepository.deleteByToken(token));
  }
}
