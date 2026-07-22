"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Brain, Network, Database, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AIML() {
  const domains = [
    {
      title: "Generative AI & LLMs",
      icon: <MessageSquare className="w-5 h-5 text-blue-400" />,
      skills: ["Prompt Engineering", "Fine-Tuning", "RAG Pipeline", "LangChain"],
      description: "Building autonomous agents and context-aware query systems."
    },
    {
      title: "Deep Learning",
      icon: <Network className="w-5 h-5 text-purple-400" />,
      skills: ["PyTorch", "TensorFlow", "CNNs", "Transformers"],
      description: "Designing neural network architectures for complex pattern recognition."
    },
    {
      title: "Machine Learning",
      icon: <Brain className="w-5 h-5 text-green-400" />,
      skills: ["Classification", "Regression", "Clustering", "XGBoost"],
      description: "Applying statistical models to extract actionable insights from data."
    },
    {
      title: "Vector Databases",
      icon: <Database className="w-5 h-5 text-orange-400" />,
      skills: ["Milvus", "Pinecone", "ChromaDB", "Embeddings"],
      description: "Optimizing high-dimensional similarity search for semantic applications."
    }
  ];

  return (
    <section className="py-12 px-4 max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-mono border-b border-border pb-2 inline-block">
          ~/ai-ml-expertise
        </h2>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Specialized knowledge in Artificial Intelligence and Machine Learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {domains.map((domain, idx) => (
          <Card key={idx} className="bg-card border-border/50 hover:bg-accent/10 transition-colors group">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-md bg-muted group-hover:scale-110 transition-transform">
                  {domain.icon}
                </div>
                <h3 className="text-lg font-bold font-mono">{domain.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 h-10">
                {domain.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {domain.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="font-mono text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
