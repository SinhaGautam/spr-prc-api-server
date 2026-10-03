import type { Db } from "mongodb";
import type { UserRepository } from "../application/UserRepository";
import { UserEntity } from "../entities/UserEntity";

type Document = Record<string, unknown>;

function mapUser(doc: Document): UserEntity {
  return new UserEntity(
    String(doc._id ?? ""),
    String(doc.authProvider ?? ""),
    String(doc.authSubject ?? ""),
    String(doc.timezone ?? "UTC"),
    String(doc.language ?? "en"),
    String(doc.status ?? "active") as UserEntity["status"],
    typeof doc.displayName === "string" ? doc.displayName : undefined,
    typeof doc.email === "string" ? doc.email : undefined,
    doc.createdAt instanceof Date ? doc.createdAt : new Date(String(doc.createdAt)),
    doc.updatedAt instanceof Date ? doc.updatedAt : new Date(String(doc.updatedAt)),
  );
}

export class MongoUserRepository implements UserRepository {
  constructor(private readonly db: Db) {}

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await this.db.collection<Document>("users").findOne({ _id: id });
    return doc ? mapUser(doc) : null;
  }

  async findByAuth(authProvider: string, authSubject: string): Promise<UserEntity | null> {
    const doc = await this.db.collection<Document>("users").findOne({ authProvider, authSubject });
    return doc ? mapUser(doc) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    await this.db.collection<Document>("users").insertOne({ ...user });
    return user;
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const result = await this.db.collection<Document>("users").replaceOne({ _id: user._id }, { ...user, updatedAt: new Date() });
    if (result.matchedCount === 0) throw new Error(`User ${user._id} was not found`);
    return user;
  }
}
