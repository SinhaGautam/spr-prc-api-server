export interface IRepository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
  create(entity: TEntity): Promise<TEntity>;
  update(entity: TEntity): Promise<TEntity>;
  delete(id: TId): Promise<void>;
}

export interface IReadRepository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
}
