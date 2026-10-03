export interface RequestContext {
  requestId: string;
  userId?: string;
  route?: string;
  method?: string;
}
