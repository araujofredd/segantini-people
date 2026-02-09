import { redirect } from "next/navigation";

export default function EmployeeIdPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/dashboard/employees/${params.id}/edit`);
}
