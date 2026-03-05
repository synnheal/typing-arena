"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const t = useTranslations("home");
  const params = useParams();
  const locale = params.locale as string;

  const features = [
    { title: t("features.precision"), desc: t("features.precisionDesc"), icon: "Target" },
    { title: t("features.heatmap"), desc: t("features.heatmapDesc"), icon: "Grid" },
    { title: t("features.training"), desc: t("features.trainingDesc"), icon: "Zap" },
  ];

  return (
    <div className="flex flex-col items-center gap-12 py-12">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Link href={`/${locale}/test`}>
            <Button size="lg" className="text-base px-8">
              {t("startTest")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3 w-full max-w-3xl">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-2">
              <div className="text-2xl">
                {feature.icon === "Target" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                )}
                {feature.icon === "Grid" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                )}
                {feature.icon === "Zap" && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
                )}
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex gap-4 text-sm">
        <Link href={`/${locale}/stats`} className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
          View Stats
        </Link>
        <Link href={`/${locale}/training`} className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
          Training
        </Link>
      </div>
    </div>
  );
}
