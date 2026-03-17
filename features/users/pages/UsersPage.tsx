"use client";

import UsersTable from "../components/UsersTable";
import { useUserPage } from "../hooks/useUserPage";
import UserModal from "../components/UserModal";
import { SearchUsersResponse } from "@/services/usersService";
import DeleteUserModal from "../components/DeleteUserModal";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";
import ToastService from "@/services/toastService";

interface UsersPageProps {
	initialData: SearchUsersResponse;
}

export default function UsersPage({ initialData }: UsersPageProps) {
	const router = useRouter();

	const {
		data,
		currentPage,
		pageSize,
		error,
		isModalOpen,
		isDeleteModalOpen,
		selectedUser,
		isSaving,
		isDeleting,
		handlePageChange,
		handleSearch,
		handlePageSizeChange,
		openEditModal,
		openDeleteModal,
		closeModal,
		closeDeleteModal,
		handleSaveUser,
		handleDeleteUser,
	} = useUserPage({ initialData });

	const handleViewUser = (user: User) => {
		if (!user.id) return;
		router.push(`/admin/users/${user.id}`);
	};

	return (
		<>
			{error && ( ToastService.error("No se pudo cargar el listado") )}

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
				<UsersTable
					users={data.content}
					totalItems={data.totalElements}
					currentPage={currentPage}
					totalPages={data.totalPages}
					onPageChange={handlePageChange}
					onSearch={handleSearch}
					onPageSizeChange={handlePageSizeChange}
					pageSize={pageSize}
					onViewUser={handleViewUser}
					onEditUser={openEditModal}
					onDeleteUser={openDeleteModal}
				/>
			</div>
			
			<UserModal 
				isOpen={isModalOpen} 
				onClose={closeModal}
				user={selectedUser}
				isLoading={isSaving}
				onSave={handleSaveUser}
			/>

			<DeleteUserModal
				isOpen={isDeleteModalOpen}
				user={selectedUser}
				isLoading={isDeleting}
				onCancel={closeDeleteModal}
				onConfirm={handleDeleteUser}
			/>
		</>
	);
}
