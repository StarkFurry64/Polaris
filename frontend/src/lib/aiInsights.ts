// frontend/src/lib/aiInsights.ts

export function generateResourceInsights(_jiraData: unknown) {
  return [
    {
      title: "Backend Team Overloaded",
      insight: "Backend team has 45% more active tasks than other teams.",
      recommendation: "Reassign 2 authentication tasks to Platform team."
    },
    {
      title: "Bottleneck Detected",
      insight: "Authentication tasks stuck in progress for over 3 days.",
      recommendation: "Add reviewer from Infra team to unblock PRs."
    },
    {
      title: "Underutilized Team",
      insight: "Frontend team has low workload this sprint.",
      recommendation: "Move UI-related auth tasks to Frontend team."
    }
  ];
}

export function generateTechStackInsights(_repoMetrics: unknown) {
  return [
    {
      stack: "Custom JWT Authentication",
      risk: "High",
      issue: "Frequent token expiry bugs and reopens.",
      recommendation: "Adopt OAuth2 or managed identity provider."
    },
    {
      stack: "Node.js + Express",
      risk: "Medium",
      issue: "High coupling across multiple repositories.",
      recommendation: "Migrate to NestJS for better modularity."
    },
    {
      stack: "Manual CI/CD Scripts",
      risk: "Medium",
      issue: "Delayed PR merges and deployment failures.",
      recommendation: "Adopt GitHub Actions with reusable workflows."
    }
  ];
}
