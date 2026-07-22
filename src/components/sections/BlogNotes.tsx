"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlogNotes() {
  const notes = [
    {
      title: "Understanding Raft Consensus Algorithm",
      category: "System Design",
      date: "Jul 15, 2026",
      readTime: "10 min read",
    },
    {
      title: "Optimizing Segment Trees for Range Queries",
      category: "DSA",
      date: "Jun 28, 2026",
      readTime: "8 min read",
    },
    {
      title: "Fine-Tuning LLaMA 3 for Code Generation",
      category: "AI / ML",
      date: "May 10, 2026",
      readTime: "12 min read",
    }
  ];

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto w-full" id="notes">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold font-mono border-b border-border pb-2 inline-block">
            ~/engineering-journal
          </h2>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Technical notes, tutorials, and competitive programming editorials.
          </p>
        </div>
        <Button variant="ghost" className="font-mono text-sm hidden md:flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {notes.map((note, idx) => (
          <Card key={idx} className="bg-card border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="text-xs font-mono text-primary mb-2 flex items-center gap-2 uppercase tracking-wider">
                <BookOpen className="w-3 h-3" /> {note.category}
              </div>
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                {note.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <span>{note.date}</span>
                <span className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
                <span>{note.readTime}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
