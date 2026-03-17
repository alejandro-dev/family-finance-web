"use client";

import { useExpensesPage } from "../hooks/useExpensesPage";
import ExpensesDataTable from "@/features/expenses/components/ExpensesDataTable";
import { SearchMyExpensesResponse } from "@/features/expenses/types/expenses";
import ExpensesFilters from "../components/ExpensesFilters";
import { CategoryOption } from "@/features/users/types/userAnalytics";
import ExpenseModal from "../components/ExpenseModal";
import ToastService from "@/services/toastService";
import { FamilyMember } from "@/types/FamilyMember";
import DeleteExpenseModal from "../components/DeleteExpenseModal";

interface ExpensesPageProps {
	initialData: SearchMyExpensesResponse;
	familyMembersOptions: FamilyMember[];
	categoriesOptions: CategoryOption[];
}

export default function ExpensesPage({ initialData, familyMembersOptions, categoriesOptions }: ExpensesPageProps) {

	const {
		dataExpenses,
		expensesTotal,
		expensesPage,
		expensesTotalPages,
		expensesPageSize,
		error,
		startDate,
      endDate,
      categoryIdFilter,
		familyMemberIdFilter,
		isModalOpen,
      selectedExpense,
		isSaving,
		isDeleteModalOpen,
		isDeleting,
		handlePageChange,
      handlePageSizeChange,
		handleFiltersChange,
		handleOpenCreateExpenseModal,
		closeModal,
		handleSaveExpense,
		handleOpenEditExpenseModal,
		openDeleteModal,
		closeDeleteModal,
		handleDeleteExpense
	} = useExpensesPage({ initialData });

	return (
		<>
			{error && ( ToastService.error("No se pudo cargar el listado") )}

			<div className="space-y-6">
				<ExpensesFilters
					startDate={startDate}
					endDate={endDate}
					categoryFilter={categoryIdFilter}
					categoriesOptions={categoriesOptions}
					familyMemberIdFilter={familyMemberIdFilter}
					familyMembersOptions={familyMembersOptions}
					onFiltersChange={handleFiltersChange}
				/>

				<ExpensesDataTable
               rows={dataExpenses}
               totalItems={expensesTotal}
               currentPage={expensesPage}
               totalPages={expensesTotalPages}
               pageSize={expensesPageSize}
               onPageChange={handlePageChange}
               onPageSizeChange={handlePageSizeChange}
					openCreateModal={handleOpenCreateExpenseModal}
					onEditExpense={handleOpenEditExpenseModal}
					onDeleteExpense={openDeleteModal}
            />
			</div>

			<ExpenseModal
				key={`expense-modal-${isModalOpen ? "open" : "closed"}`}
				isOpen={isModalOpen}
				expense={selectedExpense}
				isLoading={isSaving}
				categoriesOptions={categoriesOptions}
				familyMembersOptions={familyMembersOptions}
				onClose={closeModal}
				onSave={handleSaveExpense}
			/>
			
			<DeleteExpenseModal
				isOpen={isDeleteModalOpen}
				expense={selectedExpense}
				isLoading={isDeleting}
				onCancel={closeDeleteModal}
				onConfirm={handleDeleteExpense}
			/>
		</>
	);
}
