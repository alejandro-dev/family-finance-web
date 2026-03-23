"use client";

import { useCallback, useMemo, useState } from "react";
import {
	SaveUserPayload,
	SearchUsersParams,
	SearchUsersResponse,
	deleteUser,
	searchUsers as searchUsersService,
	updateUser,
} from "@/services/usersService";
import { useQuery } from "@/hooks/useQuery";
import useMutation from "@/hooks/useMutation";
import { User } from "@/types/User";

interface UsersPageProps {
	initialData: SearchUsersResponse;
}

export const useUserPage = ({ initialData }: UsersPageProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");
	const [pageSize, setPageSize] = useState(10);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	// Función para abrir el modal de edición de usuario.
	const openEditModal = useCallback((user: User) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	}, []);

	// Función para abrir el modal de eliminar usuario.
	const openDeleteModal = useCallback((user: User) => {
		setSelectedUser(user);
		setIsDeleteModalOpen(true);
	}, []);

	// Función para cerrar el modal de edición de usuario.
	const closeModal = useCallback(() => setIsModalOpen(false), []);

	// Función para cerrar el modal de eliminar usuario.
	const closeDeleteModal = useCallback(() => setIsDeleteModalOpen(false), []);

	// Derivamos los parámetros del query desde el estado local de la pantalla.
	const queryParams = useMemo<SearchUsersParams>(
		() => ({
			search: searchQuery,
			page: currentPage - 1, // El backend usa índice base 0.
			size: pageSize,
		}),
		[searchQuery, currentPage, pageSize] // Se ejecuta cuando se modifican estos valores.
	);

	// Encapsulamos la llamada para que useQuery pueda ejecutarla y re-ejecutarla.
	const queryFn = useCallback(
		() => searchUsersService(queryParams),
		[queryParams], // Se ejecuta cuando se modifican estos valores.
	);

	// Usamos useQuery para manejar la petición al backend.
	const { data, error, refetch } = useQuery<SearchUsersResponse>({
		// Función que realiza la llamada al backend.
		queryFn,

		// Reaccionamos a cambios de filtros/paginación, es decir, cuando cambia el texto de búsqueda o la página.
		deps: [queryParams.search, queryParams.page, queryParams.size],

		// Aprovechamos SSR y evitamos un segundo fetch al hidratar.
		initialData,

		// Evitamos un segundo fetch al montar la pantalla.
		skipInitialFetch: true,
	});

	// Función para actualizar un usuario.
	const { mutate: saveUser, isLoading: isSaving } = useMutation<void, SaveUserPayload>({
		mutationFn: async (payload) => {
			if (!selectedUser?.id) return;
			await updateUser(selectedUser.id, payload);
		},
		successMessage: "User updated successfully",
		onSuccess: async () => {
			closeModal();
			await refetch();
		},
	});

	// Función para eliminar un usuario.
	const { mutate: removeUser, isLoading: isDeleting } = useMutation<void, { id: string }>({
		mutationFn: async ({ id }) => {
			await deleteUser(id);
		},
		successMessage: "User deleted successfully",
		onSuccess: async () => {
			closeDeleteModal();
			await refetch();
		},
	});

	// Eventos de cambio de página.
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Evento de búsqueda.
	const handleSearch = (search: string) => {
		setSearchQuery(search);
		setCurrentPage(1); // Siempre volvemos a página 1 al cambiar búsqueda.
	};

	// Evento de cambio de tamaño de página.
	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
		setCurrentPage(1); // Reubicamos a la primera página al cambiar tamaño.
	};

	// Evento para actualizar el usuario seleccionado.
	const handleSaveUser = async (payload: SaveUserPayload) => {
		if (!selectedUser?.id) return;
		await saveUser(payload);
	};

	// Evento para eliminar el usuario seleccionado.
	const handleDeleteUser = async () => {
		if (!selectedUser?.id) return;
		await removeUser({ id: selectedUser.id });
	};

	return {
		data: data ?? initialData,
		currentPage,
		pageSize,
		error,
		isModalOpen,
		selectedUser,
		isDeleteModalOpen,
		isSaving,
		isDeleting,
		refetch,
		handlePageChange,
		handleSearch,
		handlePageSizeChange,
		openEditModal,
		openDeleteModal,
		closeModal,
		closeDeleteModal,
		handleSaveUser,
		handleDeleteUser,
	};
};
