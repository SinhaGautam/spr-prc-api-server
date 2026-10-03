export interface ContentCatalogResponse {
  traditions: Array<{ id: string; key: string; name: string }>;
  focuses: Array<{ id: string; key: string; name: string; traditionIds: string[] }>;
  tags: Array<{ id: string; key: string; name: string; type: string }>;
}
