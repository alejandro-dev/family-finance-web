
import { redirect } from 'next/navigation'
import { getCurrentUser } from "@/lib/auth";
import UserSidebarWrapper from './UserSidebarWrapper';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	
	// Fetch de usuario
	const user = await getCurrentUser();

	if (!user) redirect('/signin');

	// Pasamos user y children al Client Component
	return (
		<UserSidebarWrapper user={user}>
			{children}
		</UserSidebarWrapper>
	);
}
