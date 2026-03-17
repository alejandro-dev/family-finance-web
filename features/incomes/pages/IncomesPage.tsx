"use client";

import { useIncomesPage } from "@/features/incomes/hooks/useIncomesPage";
import { SearchMyIncomeRulesResponse, SearchMyIncomesResponse } from "@/features/incomes/types/incomes";
import { FamilyMember } from "@/types/FamilyMember";
import { CategoryOption } from "@/features/users/types/userAnalytics";
import IncomesFilters from "@/features/incomes/components/IncomesFilters";
import IncomesDataTable from "@/features/incomes/components/IncomesDataTable";
import IncomeRulesDataTable from "@/features/incomes/components/IncomeRulesDataTable";
import IncomeModal from "@/features/incomes/components/IncomeModal";
import IncomeRuleModal from "@/features/incomes/components/IncomeRuleModal";
import DeleteIncomeModal from "@/features/incomes/components/DeleteIncomeModal";
import DeleteIncomeRuleModal from "@/features/incomes/components/DeleteIncomeRuleModal";
import ToastService from "@/services/toastService";

interface IncomesPageProps {
   initialIncomes: SearchMyIncomesResponse;
   initialRules: SearchMyIncomeRulesResponse;
   familyMembersOptions: FamilyMember[];
   categoriesOptions: CategoryOption[];
}

export default function IncomesPage({
   initialIncomes,
   initialRules,
   familyMembersOptions,
   categoriesOptions,
}: IncomesPageProps) {
   const {
      incomesRows,
      incomesTotal,
      incomesPage,
      incomesTotalPages,
      incomesPageSize,
      rulesRows,
      rulesTotal,
      rulesPage,
      rulesTotalPages,
      rulesPageSize,
      startDate,
      endDate,
      familyMemberIdFilter,
      error,
      isIncomeModalOpen,
      isSavingIncome,
      selectedIncome,
      isDeleteIncomeModalOpen,
      isDeletingIncome,
      isRuleModalOpen,
      isSavingRule,
      selectedRule,
      isDeleteRuleModalOpen,
      isDeletingRule,
      handleFiltersChange,
      handleIncomesPageChange,
      handleIncomesPageSizeChange,
      handleRulesPageChange,
      handleRulesPageSizeChange,
      handleOpenCreateIncomeModal,
      handleOpenEditIncomeModal,
      closeIncomeModal,
      handleSaveIncome,
      openDeleteIncomeModal,
      closeDeleteIncomeModal,
      handleDeleteIncome,
      handleOpenCreateRuleModal,
      handleOpenEditRuleModal,
      closeRuleModal,
      handleSaveRule,
      openDeleteRuleModal,
      closeDeleteRuleModal,
      handleDeleteRule,
   } = useIncomesPage({ initialIncomes, initialRules });

   return (
      <>
         {error && ToastService.error("The income module could not be loaded")}

         <div className="space-y-6">
            <IncomesFilters
               startDate={startDate}
               endDate={endDate}
               familyMemberIdFilter={familyMemberIdFilter}
               familyMembersOptions={familyMembersOptions}
               onFiltersChange={handleFiltersChange}
            />

            <IncomesDataTable
               rows={incomesRows}
               totalItems={incomesTotal}
               currentPage={incomesPage}
               totalPages={incomesTotalPages}
               pageSize={incomesPageSize}
               onPageChange={handleIncomesPageChange}
               onPageSizeChange={handleIncomesPageSizeChange}
               openCreateModal={handleOpenCreateIncomeModal}
               onEditIncome={handleOpenEditIncomeModal}
               onDeleteIncome={openDeleteIncomeModal}
            />

            <IncomeRulesDataTable
               rows={rulesRows}
               totalItems={rulesTotal}
               currentPage={rulesPage}
               totalPages={rulesTotalPages}
               pageSize={rulesPageSize}
               onPageChange={handleRulesPageChange}
               onPageSizeChange={handleRulesPageSizeChange}
               openCreateModal={handleOpenCreateRuleModal}
               onEditRule={handleOpenEditRuleModal}
               onDeleteRule={openDeleteRuleModal}
            />
         </div>

         <IncomeModal
            key={`income-modal-${isIncomeModalOpen ? "open" : "closed"}`}
            isOpen={isIncomeModalOpen}
            income={selectedIncome}
            isLoading={isSavingIncome}
            categoriesOptions={categoriesOptions}
            familyMembersOptions={familyMembersOptions}
            onClose={closeIncomeModal}
            onSave={handleSaveIncome}
         />

         <DeleteIncomeModal
            isOpen={isDeleteIncomeModalOpen}
            income={selectedIncome}
            isLoading={isDeletingIncome}
            onCancel={closeDeleteIncomeModal}
            onConfirm={handleDeleteIncome}
         />

         <IncomeRuleModal
            key={`income-rule-modal-${isRuleModalOpen ? "open" : "closed"}`}
            isOpen={isRuleModalOpen}
            incomeRule={selectedRule}
            isLoading={isSavingRule}
            categoriesOptions={categoriesOptions}
            familyMembersOptions={familyMembersOptions}
            onClose={closeRuleModal}
            onSave={handleSaveRule}
         />

         <DeleteIncomeRuleModal
            isOpen={isDeleteRuleModalOpen}
            incomeRule={selectedRule}
            isLoading={isDeletingRule}
            onCancel={closeDeleteRuleModal}
            onConfirm={handleDeleteRule}
         />
      </>
   );
}
