import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <MainLayout>
      <section className="container flex flex-col items-center justify-center gap-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Modern Frontend
            <span className="block text-primary">Scaffold</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
            Built with Next.js, shadcn/ui, Zustand, TanStack Query, and more. 
            Everything you need to build modern web applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Authentication"
            description="Server and client-side auth with cookie handling"
          />
          <FeatureCard
            title="State Management"
            description="Zustand for simple and scalable state"
          />
          <FeatureCard
            title="Data Fetching"
            description="TanStack Query with Axios interceptors"
          />
          <FeatureCard
            title="Design System"
            description="shadcn/ui components with Tailwind CSS"
          />
          <FeatureCard
            title="Error Tracking"
            description="Sentry integration ready to enable"
          />
          <FeatureCard
            title="Type Safety"
            description="Full TypeScript support throughout"
          />
        </div>
      </section>
    </MainLayout>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
