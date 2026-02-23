import { ProjectIdeaQueue } from "@/components/admin/ai/ProjectIdeaQueue";
import { PageContainer, PageHeader } from "@/components/admin/ui";

export const metadata = { title: "AI Case Study Assistant | Xinteck" };

export default function AIProjectsPage() {
    return (
        <PageContainer>
            <PageHeader
                title="AI Case Study Assistant"
                subtitle="Scout engineering trends and automatically draft rich-text Case Studies"
                backUrl="/admin/projects"
                backLabel="Back to Projects"
            />

            <div className="mt-6 flex flex-col gap-6 w-full max-w-full overflow-hidden">
                <ProjectIdeaQueue />
            </div>
        </PageContainer>
    );
}
