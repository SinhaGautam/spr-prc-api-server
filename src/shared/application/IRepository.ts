export interface IRepository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
}

export interface IReadRepository<TEntity, TId = string> extends IRepository<TEntity, TId> {}

export interface ICreateRepository<TEntity> {
  create(entity: TEntity): Promise<TEntity>;
}

export interface IMutableRepository<TEntity, TId = string>
  extends IRepository<TEntity, TId>, ICreateRepository<TEntity> {
  update(entity: TEntity): Promise<TEntity>;
  delete(id: TId): Promise<void>;
}
