import { getMessages } from "@/actions/leads";
import { LeadsClient } from "@/components/admin/LeadsClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ filter?: string; search?: string; page?: string; limit?: string }> 
}) {
  const params = await searchParams;
  const filter = (params.filter as "all" | "unread" | "starred" | "archived") || "all";
  const search = params.search;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;

  const result = await getMessages({ filter, search, page, pageSize: limit });

  return <LeadsClient initialData={result} />;
}
