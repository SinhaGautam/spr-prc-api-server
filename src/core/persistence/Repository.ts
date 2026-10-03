export interface Repository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
}

export interface CreateRepository<TEntity> {
  create(entity: TEntity): Promise<TEntity>;
}

export interface UpdateRepository<TEntity> {
  update(entity: TEntity): Promise<TEntity>;
}

export interface DeleteRepository<TId = string> {
  deleteById(id: TId): Promise<void>;
}

export interface ReadWriteRepository<TEntity, TId = string>
  extends Repository<TEntity, TId>,
    CreateRepository<TEntity>,
    UpdateRepository<TEntity>,
    DeleteRepository<TId> {}
