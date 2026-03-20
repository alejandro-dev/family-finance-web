import { requireUser } from "@/lib/authorize";
import type { Metadata } from "next";
import ExpensesPage from "@/features/expenses/pages/ExpensesPage";
import { getCategoryOptions, searchMyExpensesAction, searchMyFamilyMembersAction } from "./actions";

export const metadata: Metadata = {
	title: "Expenses",
	description: "Manage household expenses, apply filters, and review spending records in Family Finance.",
};

export default async function Expenses() {
	// Obtenemos usuario autenticado para contexto de familia, sin repetir reglas de redirección.
	const user = await requireUser();

	const initialData = await searchMyExpensesAction({ page: 1, size: 10, isEnabled: true });
	const familyMembersOptions = await searchMyFamilyMembersAction(user.familyId!);
	const categoriesOptions = await getCategoryOptions();

	return (
		<ExpensesPage initialData={initialData} familyMembersOptions={familyMembersOptions} categoriesOptions={categoriesOptions} />
	);
}
