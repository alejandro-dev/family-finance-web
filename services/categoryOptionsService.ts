import { backendFetch } from "@/services/backend";
import {
   buildCategoriesSearchPath,
   SearchCategoriesResponse,
} from "@/services/categoriesService";
import { CategoryOption } from "@/features/users/types/userAnalytics";
import { Category } from "@/types/Category";

// Obtiene catálogo amplio para poblar selects sin depender de la página actual.
const DEFAULT_CATEGORY_OPTIONS_SIZE = 200;

export async function getCategoryOptions(): Promise<CategoryOption[]> {
   const path = buildCategoriesSearchPath({
      page: 0,
      size: DEFAULT_CATEGORY_OPTIONS_SIZE,
   }).replace("/api", "");

   const data = await backendFetch<SearchCategoriesResponse>(path, {
      // Forzamos cache ya que se usa en muchas vistas.
      cache: "force-cache", 
      next: { revalidate: 300 },
   });
   const content = data.content ?? [];

   // Deduplicamos por id porque algunos backends pueden devolver repetidos por paginación/caché.
   const uniqueById = new Map<string, CategoryOption>();

   content.forEach((category: Category) => {
      if (!category.id) return;
      uniqueById.set(String(category.id), {
         id: String(category.id),
         name: category.name,
      });
   });

   return Array.from(uniqueById.values());
}
