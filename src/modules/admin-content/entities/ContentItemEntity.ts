export type PublicationStatus = "draft" | "published" | "archived";

export class ContentItemEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public status: PublicationStatus,
    public traditionIds: string[],
    public focusIds: string[],
    public tagIds: string[],
    public language: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
