export interface IRepository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
  create(entity: TEntity): Promise<TEntity>;
}

export interface IMutableRepository<TEntity, TId = string> extends IRepository<TEntity, TId> {
  update(entity: TEntity): Promise<TEntity>;
  delete(id: TId): Promise<void>;
}

export interface IReadRepository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
}
