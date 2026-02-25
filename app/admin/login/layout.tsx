/*
  Purpose: Force the login page to always render dynamically (never cached).
  Decision: This prevents stale cached login pages from being served to users,
  which can cause blank screens if a previous deployment's JS chunk hashes changed.
*/

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
