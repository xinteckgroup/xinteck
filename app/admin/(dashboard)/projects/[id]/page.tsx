import { getProject } from "@/actions/project";
import { ProjectEditorForm } from "@/components/admin/ProjectEditorForm";
import { requireRole } from "@/lib/auth-check";
import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProjectPage(props: { params: Promise<{ id: string }> }) {
  await requireRole([Role.ADMIN, Role.SUPER_ADMIN]);

  const params = await props.params;

  if (params.id === 'new') {
      return <ProjectEditorForm />; // New Project
  }

  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  return <ProjectEditorForm initialData={project} isEditing={true} />;
}
