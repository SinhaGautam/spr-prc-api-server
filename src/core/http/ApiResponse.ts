export interface ApiErrorBody {
  code: string;
  message: string;
  requestId: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: ApiErrorBody;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export function success<T>(data: T): ApiSuccessResponse<T> {
  return { data };
}

export function failure(error: ApiErrorBody): ApiErrorResponse {
  return { error };
}
