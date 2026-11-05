/**
 * Global TypeScript types for OmniSales AI.
 * Domain-specific types will be added in later phases.
 */

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: "success" | "error" | "loading";
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}
