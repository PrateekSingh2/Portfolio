"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GitCommit, Trophy, Award, FileText } from "lucide-react";

export function ActivityFeed() {
  const activities = [
    {
      type: "commit",
      content: "Pushed 5 commits to ai-auto-coder",
      time: "2 hours ago",
      icon: <GitCommit className="w-4 h-4 text-green-500" />
    },
    {
      type: "contest",
      content: "Ranked #145 in LeetCode Weekly Contest 350",
      time: "1 day ago",
      icon: <Trophy className="w-4 h-4 text-yellow-500" />
    },
    {
      type: "blog",
      content: "Published new note: 'Understanding Raft Consensus'",
      time: "3 days ago",
      icon: <FileText className="w-4 h-4 text-blue-500" />
    },
    {
      type: "achievement",
      content: "Earned 5★ on CodeChef",
      time: "1 week ago",
      icon: <Award className="w-4 h-4 text-purple-500" />
    }
  ];

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto w-full" id="activity">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-mono border-b border-border pb-2 inline-block">
          ~/activity-feed
        </h2>
      </div>

      <div className="space-y-4 relative border-l border-border/50 ml-2 md:ml-4 pb-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="relative pl-6 md:pl-8">
            <span className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center">
              {activity.icon}
            </span>
            <Card className="bg-card/50 border-border/50 hover:bg-card transition-colors">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="text-sm font-mono text-muted-foreground">
                  <span className="text-primary">&gt;</span> {activity.content}
                </div>
                <div className="text-xs font-mono text-muted-foreground/70">
                  {activity.time}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
