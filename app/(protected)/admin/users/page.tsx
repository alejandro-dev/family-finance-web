import type { Metadata } from "next";
import UsersPage from "@/features/users/pages/UsersPage";
import { searchUsers } from "./actions";

export const metadata: Metadata = {
	title: "User Management | Admin Dashboard",
	description: "User administration panel",
};

export default async function Users() {
	// Carga inicial de usuarios (SSR)
	const initialData = await searchUsers({ page: 0, size: 10 });
	
	return (
		<UsersPage initialData={initialData} />
	);
}
