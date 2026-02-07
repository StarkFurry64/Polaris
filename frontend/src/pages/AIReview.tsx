import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Clock,
  Loader2
} from 'lucide-react';
import { generateAIReviewFromDiff } from '@/services/api';
import { Header } from '@/components/dashboard/Header';

interface ReviewResult {
  summary: string;
  issues: Array<{ severity: string; description: string; line?: string }>;
  suggestions: Array<{ type: string; description: string }>;
  complexityScore: number;
  estimatedReviewTime: string;
  overallAssessment: string;
}

const AIReviewPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [diff, setDiff] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diff.trim()) {
      setError('Please enter code diff to review');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateAIReviewFromDiff(title || 'Code Review', description, diff);
      let review = response.review;
      if (typeof review === 'string') {
        review = review.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        review = JSON.parse(review);
      }
      setResult(review);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate review');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getAssessmentBadge = (assessment: string) => {
    switch (assessment) {
      case 'approve': return <Badge className="bg-green-500">Approve</Badge>;
      case 'request_changes': return <Badge className="bg-red-500">Request Changes</Badge>;
      default: return <Badge className="bg-yellow-500">Needs Discussion</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-cyan-500" />
            AI Code Review (DeepSeek-V3)
          </CardTitle>
          <CardDescription>
            Paste your code diff below and get instant AI-powered review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">PR Title</label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Add user authentication"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description (optional)</label>
                <Input 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of changes"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Code Diff</label>
              <Textarea 
                value={diff}
                onChange={(e) => setDiff(e.target.value)}
                placeholder={`Paste your code diff here, e.g.:

+ function validateUser(user) {
+   if (!user.email) {
+     throw new Error('Email required');
+   }
+   return true;
+ }`}
                className="font-mono text-sm min-h-[200px]"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing with DeepSeek-V3...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Generate AI Review
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-500">{error}</span>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Review Summary</CardTitle>
              {getAssessmentBadge(result.overallAssessment)}
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">{result.summary}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {result.estimatedReviewTime}
                </span>
                <span>Complexity: {result.complexityScore}/10</span>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          {result.issues && result.issues.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Issues Found ({result.issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(issue.severity)}`} />
                    <div>
                      <Badge variant="outline" className="mb-1">{issue.severity}</Badge>
                      <p className="text-sm text-slate-600">{issue.description}</p>
                      {issue.line && <p className="text-xs text-slate-400 mt-1">Line: {issue.line}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Suggestions ({result.suggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div>
                      <Badge variant="outline" className="mb-1 border-emerald-500 text-emerald-600">{suggestion.type}</Badge>
                      <p className="text-sm text-slate-600">{suggestion.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
        </div>
      </main>
    </div>
  );
};

export default AIReviewPage;
