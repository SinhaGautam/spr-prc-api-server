export interface IService<TResponse> {
  getById(id: string): Promise<TResponse>;
  getAll(): Promise<TResponse[]>;
}

export interface ICrudService<TCreateRequest, TUpdateRequest, TResponse> extends IService<TResponse> {
  create(request: TCreateRequest): Promise<TResponse>;
  update(id: string, request: TUpdateRequest): Promise<TResponse>;
  delete(id: string): Promise<void>;
}
