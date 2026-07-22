"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Database, Activity, Lock } from "lucide-react";

export function SystemDesign() {
  const topics = [
    {
      title: "High-Level Design (HLD)",
      icon: <Server className="w-4 h-4" />,
      items: ["URL Shortener", "Chat Application", "Notification Service", "Rate Limiter"]
    },
    {
      title: "Low-Level Design (LLD)",
      icon: <Database className="w-4 h-4" />,
      items: ["Object Oriented Design", "Design Patterns", "SOLID Principles", "Concurrency"]
    }
  ];

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-mono border-b border-border pb-2 inline-block">
          System Design
        </h2>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Architectural patterns and scalable system design concepts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic, idx) => (
          <Card key={idx} className="bg-card border-border/50">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                {topic.icon} {topic.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3 font-mono text-sm text-muted-foreground">
                {topic.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-primary">&gt;</span> {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
