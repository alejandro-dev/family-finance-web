// Contrato paginado genérico reutilizable en tablas server-side.
export interface PaginatedResponse<T> {
   content: T[];
   totalElements: number;
   totalPages: number;
   number: number;
   size: number;
}
