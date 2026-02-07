import { Play, Pause, Settings, Zap, GitBranch, Users, Shield, FileText, Plus, CheckCircle2, Clock, MoreVertical, Trash2, Edit } from 'lucide-react';
import { workflowRules } from '@/lib/doraMetricsData';

const ruleTemplates = [
    {
        id: 't1',
        name: 'Auto-merge Small Changes',
        description: 'Automatically merge PRs with less than 10 lines changed',
        icon: Zap,
        color: 'from-emerald-500 to-emerald-600',
        category: 'Automation',
    },
    {
        id: 't2',
        name: 'Require Expert Review',
        description: 'Assign code owners based on file paths',
        icon: Users,
        color: 'from-blue-500 to-blue-600',
        category: 'Review',
    },
    {
        id: 't3',
        name: 'Security Scan Required',
        description: 'Block merge until security checks pass',
        icon: Shield,
        color: 'from-rose-500 to-rose-600',
        category: 'Security',
    },
    {
        id: 't4',
        name: 'Documentation Check',
        description: 'Require docs update for API changes',
        icon: FileText,
        color: 'from-violet-500 to-violet-600',
        category: 'Quality',
    },
];

export function WorkflowsPage() {
    const activeRules = workflowRules.filter(r => r.enabled).length;
    const totalExecutions = workflowRules.reduce((sum, r) => sum + r.executions, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Workflow Automation</h2>
                    <p className="text-slate-600 mt-1">Configure gitStream-style PR automation rules</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
                    <Plus className="size-4" />
                    Create Rule
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg shadow-emerald-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Zap className="size-5" />
                        </div>
                        <span className="text-sm font-medium opacity-90">Active Rules</span>
                    </div>
                    <p className="text-3xl font-semibold mb-1">{activeRules}</p>
                    <p className="text-sm opacity-80">Out of {workflowRules.length} total</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg shadow-blue-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Play className="size-5" />
                        </div>
                        <span className="text-sm font-medium opacity-90">Total Executions</span>
                    </div>
                    <p className="text-3xl font-semibold mb-1">{totalExecutions}</p>
                    <p className="text-sm opacity-80">This month</p>
                </div>

                <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white shadow-lg shadow-violet-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Clock className="size-5" />
                        </div>
                        <span className="text-sm font-medium opacity-90">Time Saved</span>
                    </div>
                    <p className="text-3xl font-semibold mb-1">48h</p>
                    <p className="text-sm opacity-80">This month</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg shadow-amber-500/20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <span className="text-sm font-medium opacity-90">Success Rate</span>
                    </div>
                    <p className="text-3xl font-semibold mb-1">98.5%</p>
                    <p className="text-sm opacity-80">Rule execution</p>
                </div>
            </div>

            {/* Rule Templates */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-1">Quick Templates</h3>
                    <p className="text-sm text-slate-600">Start with a pre-configured automation rule</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {ruleTemplates.map((template) => {
                        const Icon = template.icon;
                        return (
                            <div
                                key={template.id}
                                className="group p-5 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                            >
                                <div className={`bg-gradient-to-br ${template.color} size-12 rounded-xl flex items-center justify-center shadow-lg mb-4`}>
                                    <Icon className="size-6 text-white" />
                                </div>
                                <h4 className="font-medium text-slate-900 mb-1">{template.name}</h4>
                                <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                    {template.category}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Active Rules */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-1">Active Automation Rules</h3>
                    <p className="text-sm text-slate-600">Your configured workflow automations</p>
                </div>

                <div className="space-y-4">
                    {workflowRules.map((rule) => (
                        <div
                            key={rule.id}
                            className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        className={`p-2 rounded-lg transition-colors ${rule.enabled
                                                ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                            }`}
                                    >
                                        {rule.enabled ? <Play className="size-4" /> : <Pause className="size-4" />}
                                    </button>
                                    <div>
                                        <h4 className="font-medium text-slate-900">{rule.name}</h4>
                                        <p className="text-sm text-slate-600">{rule.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                        <Edit className="size-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Trigger</p>
                                    <p className="text-sm text-slate-900">{rule.trigger}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Conditions</p>
                                    <div className="flex flex-wrap gap-1">
                                        {rule.conditions.slice(0, 2).map((cond, idx) => (
                                            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                                {cond}
                                            </span>
                                        ))}
                                        {rule.conditions.length > 2 && (
                                            <span className="text-xs text-slate-500">+{rule.conditions.length - 2} more</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Actions</p>
                                    <div className="flex flex-wrap gap-1">
                                        {rule.actions.slice(0, 2).map((action, idx) => (
                                            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                {action}
                                            </span>
                                        ))}
                                        {rule.actions.length > 2 && (
                                            <span className="text-xs text-slate-500">+{rule.actions.length - 2} more</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Play className="size-3" />
                                        {rule.executions} executions
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3" />
                                        Last triggered {rule.lastTriggered}
                                    </span>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${rule.enabled
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {rule.enabled ? 'Active' : 'Paused'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
