import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function VerifyRequestPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            A verification link has been sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Please check your email inbox and click on the verification link to
            complete your registration.
          </p>
          <p>If you don&apos;t see the email, please check your spam folder.</p>
        </CardContent>
      </Card>
    </div>
  );
}
