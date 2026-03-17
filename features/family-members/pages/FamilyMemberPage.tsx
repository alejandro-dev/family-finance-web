"use client";

import { SearchFamilyMembersResponse } from "@/services/familyMembersService";
import { useFamilyMembers } from "../hooks/useFamilyMembers";
import ToastService from "@/services/toastService";
import FamilyMembersDataTable from "../components/FamilyMembersDataTable";
import FamilyMemberModal from "../components/FamilyMemberModal";
import InviteFamilyMemberModal from "../components/InviteFamilyMemberModal";

interface FamilyMembersPageProps {
   initialData: SearchFamilyMembersResponse;
   familyId: string;
}

export default function FamilyMembersPage({ initialData, familyId }: FamilyMembersPageProps) {

   const {
      dataFamilyMembers,
      familyMembersTotal,
      familyMembersPage,
      familyMembersTotalPages,
      familyMembersPageSize,
      error,
      isModalOpen,
      selectedFamilyMember,
      isSaving,
      isInviteModalOpen,
      isInviteLoading,
      handlePageChange,
      handlePageSizeChange,
      handleOpenCreateFamilyMemberModal,
      closeModal,
      handleSaveFamilyMember,
      handleOpenEditFamilyMemberModal,
      openInviteModal,
      closeInviteModal,
      handleInviteFamilyMember,
      handleViewFamilyMember
   } = useFamilyMembers({ initialData, familyId });

   return (
      <>
         {error && ( ToastService.error("No se pudo cargar el listado") )}

         <div className="space-y-6">
            <FamilyMembersDataTable
               rows={dataFamilyMembers}
               totalItems={familyMembersTotal}
               currentPage={familyMembersPage}
               totalPages={familyMembersTotalPages}
               pageSize={familyMembersPageSize}
               onPageChange={handlePageChange}
               onPageSizeChange={handlePageSizeChange}
               openCreateModal={handleOpenCreateFamilyMemberModal}
               onEditFamilyMember={handleOpenEditFamilyMemberModal}
               onInviteFamilyMember={openInviteModal}
               onViewFamilyMember={handleViewFamilyMember}
            />
         </div>

         <FamilyMemberModal
            key={`family-member-modal-${isModalOpen ? "open" : "closed"}`}
            isOpen={isModalOpen}
            familyMember={selectedFamilyMember}
            isLoading={isSaving}
            onClose={closeModal}
            onSave={handleSaveFamilyMember}
         />

         <InviteFamilyMemberModal
            key={`inivite-family-member-modal-${isInviteModalOpen ? "open" : "closed"}`}
            isOpen={isInviteModalOpen}
            onClose={closeInviteModal}
            onSave={handleInviteFamilyMember}
            isLoading={isInviteLoading}
         />
      </>
   );
}