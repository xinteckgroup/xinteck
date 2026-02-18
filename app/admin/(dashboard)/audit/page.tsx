import { getAuditEntities, getAuditLogs } from "@/actions/audit";
import { AuditFilters } from "@/components/admin/AuditFilters";
import { AuditLogTable } from "@/components/admin/AuditLogTable";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AuditPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; action?: string; entity?: string; dateFrom?: string; dateTo?: string }> 
}) {
  await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const action = params.action;
  const entity = params.entity;
  const dateFrom = params.dateFrom;
  const dateTo = params.dateTo;

  const [{ data, totalPages, currentPage, total }, entities] = await Promise.all([
    getAuditLogs({ page, limit: 15, action, entity, dateFrom, dateTo }),
    getAuditEntities(),
  ]);

  return (
    <PageContainer>
      <PageHeader 
        title="Audit Log" 
        subtitle={`System activity tracking. Total Events: ${total}`}
      />

      {/* Filters */}
      <AuditFilters 
        entities={entities}
        currentAction={action}
        currentEntity={entity}
        currentDateFrom={dateFrom}
        currentDateTo={dateTo}
      />

      {/* Main Table */}
      <AuditLogTable 
        logs={data} 
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </PageContainer>
  );
}
