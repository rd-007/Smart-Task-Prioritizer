import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-light to-secondary-light">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-dashboard-title text-foreground">
            Smart Task Prioritizer
          </h1>
          <p className="text-body text-muted-foreground">
            Start organizing your chaos today
          </p>
        </div>

        {/* Clerk Sign Up */}
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              cardBox: "shadow-card rounded-[24px]",
            },
          }}
        />
      </div>
    </div>
  );
}
