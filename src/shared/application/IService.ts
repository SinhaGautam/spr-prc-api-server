export interface IService<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface IQueryService<TQuery, TResponse> extends IService<TQuery, TResponse> {}

export interface IMutationService<TRequest, TResponse> extends IService<TRequest, TResponse> {}

export interface ICrudService<TCreateRequest, TUpdateRequest, TResponse> {
  getById(id: string): Promise<TResponse>;
  getAll(): Promise<TResponse[]>;
  create(request: TCreateRequest): Promise<TResponse>;
  update(id: string, request: TUpdateRequest): Promise<TResponse>;
  delete(id: string): Promise<void>;
}
