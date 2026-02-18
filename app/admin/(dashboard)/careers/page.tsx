import { getCareerDepartments, getCareerPositions } from "@/actions/careers";
import { CareersManager } from "@/components/admin/CareersManager";

export const dynamic = "force-dynamic";

export default async function CareersPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; department?: string; status?: string; page?: string; limit?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;

    const [result, departments] = await Promise.all([
        getCareerPositions({
            search: params.search,
            department: params.department,
            status: params.status,
            page,
            pageSize: limit,
        }),
        getCareerDepartments(),
    ]);

    return <CareersManager initialData={result} departments={departments} />;
}
