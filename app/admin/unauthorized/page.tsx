import { Button } from "@/components/admin/ui/Button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-xl border border-border bg-card shadow-lg">
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
          <ShieldAlert size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
        
        <p className="text-muted-foreground">
          Your account does not have the required permissions to access this area.
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="flex flex-col gap-3 pt-4">
          <Link href="/admin/login" className="w-full">
            <Button className="w-full" variant="outline">
              Sign in with different account
            </Button>
          </Link>
          
          <Link href="/" className="w-full">
            <Button className="w-full" variant="ghost">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
