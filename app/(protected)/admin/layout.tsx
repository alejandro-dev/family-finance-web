import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminSectionLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();

	if (!user) redirect("/signin");
	if (!user.isAdmin) redirect("/dashboard");

	return <>{children}</>;
}

