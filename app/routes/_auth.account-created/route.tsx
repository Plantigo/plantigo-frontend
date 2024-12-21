import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@remix-run/react";
import { CheckCircle, ChevronRightIcon } from "lucide-react";

export default function AccountCreatedPage() {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle size="48" className="text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Account Created!</h1>

        <p className="text-gray-600 text-center text-lg leading-relaxed">
          Your account has been successfully created. A verification email has
          been sent to your email address. Please check your inbox and follow
          the instructions to verify your account.
        </p>

        <div className="pt-4">
          <Button variant="default" size="lg" className="rounded-full" asChild>
            <Link to="/login">
              Go to Login
              <ChevronRightIcon className="ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
