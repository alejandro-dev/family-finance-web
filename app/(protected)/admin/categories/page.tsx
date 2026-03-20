import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import type { Metadata } from "next";
import { searchCategories } from "./actions";

export const metadata: Metadata = {
	title: "Category management",
	description: "Administer expense and income categories used across the Family Finance workspace.",
};

export default async function Categories() {	
	// Carga inicial de categorias (SSR)
	const initialData = await searchCategories({ page: 0, size: 10 });

	return (
		<CategoriesPage 
			initialData={initialData} 
		/>
	);
}
