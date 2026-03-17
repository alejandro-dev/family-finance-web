"use client";

import { useQuery } from "@/hooks/useQuery";
import { createFamilyMember, inviteFamilyMember, InviteFamilyMemberPayload, SaveFamilyMemberPayload, SearchFamilyMembersResponse, updateFamilyMember } from "@/services/familyMembersService";
import { useCallback, useMemo, useState } from "react";
import { FamilyMembersPagination } from "../types/familyMembers";
import { searchFamilyMembers } from "@/app/(protected)/family-members/actions";
import { FamilyMember } from "@/types/FamilyMember";
import useMutation from "@/hooks/useMutation";
import { useRouter } from "next/navigation";

interface FamilyMembersPageProps {
   initialData: SearchFamilyMembersResponse;
   familyId: string;
}

export const useFamilyMembers = ({ initialData, familyId }: FamilyMembersPageProps) => {
   // TABLA
   // Número de página actual.
   const [familyMembersPage, setFamilyMembersPageState] = useState(initialData.number ?? 1);

   // Tamaño de página actual.
   const [familyMembersPageSize, setFamilyMembersPageSize] = useState(initialData.size ?? 10);

   // Derivamos los parámetros del query desde el estado local de la pantalla.
   const queryParams = useMemo<FamilyMembersPagination>(
      () => ({
         page: familyMembersPage, // La action traduce a backend 0-based.
         size: familyMembersPageSize
      }),
      [familyMembersPage, familyMembersPageSize] // Se ejecuta cuando se modifican estos valores.
   );

   // Encapsulamos la llamada para que useQuery pueda ejecutarla y re-ejecutarla.
   const queryFn = useCallback(
      () => searchFamilyMembers(queryParams),
      [queryParams], // Se ejecuta cuando se modifican estos valores.
   );

   // Usamos useQuery para manejar la petición al backend.
   const { data, error, refetch } = useQuery<SearchFamilyMembersResponse>({
      // Función que realiza la llamada al backend.
      queryFn,

      // Reaccionamos a cambios de filtros/paginación, es decir, cuando cambia el texto de búsqueda o la página.
      deps: [queryParams.page, queryParams.size],

      // Aprovechamos SSR y evitamos un segundo fetch al hidratar.
      initialData,

      // Evitamos un segundo fetch al montar la pantalla.
      skipInitialFetch: true,
   });

   // Si no hay data nueva, usamos el snapshot inicial de SSR.
   const safeData = data ?? initialData;

   // Eventos de cambio de página.
   const handlePageChange = (page: number) => {
      setFamilyMembersPageState(page);
   };

   // Evento de cambio de tamaño de página.
   const handlePageSizeChange = (newPageSize: number) => {
      setFamilyMembersPageSize(newPageSize);
      setFamilyMembersPageState(1); // Reubicamos a la primera página al cambiar tamaño.
   };
   // END TABLA


   // MODAL CREAR/EDITAR FAMILIAR
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMember | null>(null);

   // Función para cerrar el modal de creación y edición de categoría.
   const closeModal = useCallback(() => setIsModalOpen(false), []);

   // Función para abrir el modal de creación de gasto.
   const handleOpenCreateFamilyMemberModal = useCallback(() => {
      setSelectedFamilyMember(null);
      setIsModalOpen(true);
   }, []);

   // Evento para guardar el familiar.
   const handleSaveFamilyMember = async (payload: SaveFamilyMemberPayload) => {
      await saveFamilyMember(payload);
   };

   // Función para guardar una categoría.
   const { mutate: saveFamilyMember, isLoading: isSaving } = useMutation<void,  SaveFamilyMemberPayload>({
      mutationFn: async (payload) => {
         // Se agrega el id de la familia al payload para que el servidor sepa a qué familia pertenece el familiar.
         payload.familyId = familyId;

         if (selectedFamilyMember?.id) {
            await updateFamilyMember(selectedFamilyMember.id, payload);
            return;
         }

         await createFamilyMember(payload);
      },
      successMessage: selectedFamilyMember?.id
         ? "Familiar actualizado correctamente"
         : "Familiar creado correctamente",
      onSuccess: async () => {
         closeModal();
         await refetch();
      },
   });

   // Función para editar un gasto.
   const handleOpenEditFamilyMemberModal = async (familyMember: FamilyMember) => {
      setSelectedFamilyMember(familyMember);
      setIsModalOpen(true);
   };

   // END MODAL CREAR/EDITAR FAMILIAR

   // MODAL INVITAR FAMILIAR
   const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

   // Función para abrir el modal de eliminar gasto.
   const openInviteModal = useCallback(() => {
      setIsInviteModalOpen(true);
   }, []);

   // Función para cerrar el modal de eliminar gasto.
   const closeInviteModal = useCallback(() => setIsInviteModalOpen(false), []);

   // Evento para eliminar el familiar seleccionado.
   const handleInviteFamilyMember = async (payload: InviteFamilyMemberPayload) => {
      await sendEmailInvitation(payload);
   };

   const errorMessages: Record<number, string> = {
      409: "This email is registered as a family member"
   };

   const { mutate: sendEmailInvitation, isLoading: isInviteLoading } = useMutation<void, InviteFamilyMemberPayload>({
      mutationFn: async (payload) => {
         await inviteFamilyMember(payload);
      },
      successMessage: "Invitation sent successfully",
      errorMessages: errorMessages,
      onSuccess: async () => {
         closeInviteModal();
         // await refetch();
      },
   });
   // END MODAL INVITAR FAMILIAR

   // MOSTRAR INFORMACIÓN DEL FAMILIAR
   const router = useRouter();

   // Función para redirigir a la página de usuario.
   const handleViewFamilyMember = (familyMember: FamilyMember) => {
      if (!familyMember.id) return;
      router.push(`/family-members/${familyMember.id}`);
   };

   // END MOSTRAR INFORMACIÓN DEL FAMILIAR

   return {
      dataFamilyMembers: safeData.content,
      familyMembersTotal: safeData.totalElements,
      familyMembersPage: safeData.number,
      familyMembersTotalPages: safeData.totalPages,
      familyMembersPageSize: safeData.size,
      error,
      isModalOpen,
      selectedFamilyMember,
      isSaving,
      isInviteModalOpen,
      isInviteLoading,
      handlePageChange,
      handlePageSizeChange,
      handleOpenCreateFamilyMemberModal,
      handleOpenEditFamilyMemberModal,
      closeModal,
      handleSaveFamilyMember,
      openInviteModal,
      closeInviteModal,
      handleInviteFamilyMember,
      handleViewFamilyMember
   }
}
