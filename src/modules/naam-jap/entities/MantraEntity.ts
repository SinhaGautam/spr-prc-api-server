export class MantraEntity {
  constructor(
    public readonly _id: string,
    public readonly name: string,
    public readonly text: string,
    public readonly language: string,
  ) {}
}
