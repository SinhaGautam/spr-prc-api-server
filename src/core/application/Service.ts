export interface Service<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface QueryService<TRequest, TResponse> extends Service<TRequest, TResponse> {}

export interface CommandService<TRequest, TResponse> extends Service<TRequest, TResponse> {}
