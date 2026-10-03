import type { Db } from "mongodb";
import type { ContentRepository } from "../application/ContentRepository";
import { FocusEntity } from "../entities/FocusEntity";
import { TagEntity } from "../entities/TagEntity";
import { TraditionEntity } from "../entities/TraditionEntity";

type Document = Record<string, unknown>;

export class MongoContentRepository implements ContentRepository {
  constructor(private readonly db: Db) {}

  async listTraditions(): Promise<TraditionEntity[]> {
    const docs = await this.db.collection<Document>("traditions").find({ status: "published" }).sort({ sortOrder: 1 }).toArray();
    return docs.map((d) => new TraditionEntity(String(d._id), String(d.key), String(d.name), "published", Number(d.sortOrder ?? 0)));
  }

  async listFocuses(): Promise<FocusEntity[]> {
    const docs = await this.db.collection<Document>("focuses").find({ status: "published" }).sort({ sortOrder: 1 }).toArray();
    return docs.map((d) => new FocusEntity(String(d._id), String(d.key), String(d.name), Array.isArray(d.traditionIds) ? d.traditionIds.map(String) : [], "published", Number(d.sortOrder ?? 0)));
  }

  async listTags(): Promise<TagEntity[]> {
    const docs = await this.db.collection<Document>("tags").find({ status: "published" }).sort({ name: 1 }).toArray();
    return docs.map((d) => new TagEntity(String(d._id), String(d.key), String(d.name), String(d.type ?? "theme") as TagEntity["type"], "published"));
  }
}
