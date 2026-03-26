export class PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
