import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardPage from "@/components/templates/DashboardPage";
import { authOptions } from "@/lib/authOptions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <DashboardPage />;
}
