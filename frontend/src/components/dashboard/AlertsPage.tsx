import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Settings, X, Clock, TrendingUp, Mail, MessageSquare, Link2, Plus } from 'lucide-react';
import { alerts } from '@/lib/doraMetricsData';

const alertThresholds = [
    {
        id: 1,
        metric: 'Deployment Frequency',
        operator: 'below',
        value: 3,
        unit: 'per day',
        severity: 'warning',
        enabled: true,
    },
    {
        id: 2,
        metric: 'Change Failure Rate',
        operator: 'above',
        value: 5,
        unit: '%',
        severity: 'critical',
        enabled: true,
    },
    {
        id: 3,
        metric: 'Lead Time',
        operator: 'above',
        value: 5,
        unit: 'days',
        severity: 'warning',
        enabled: true,
    },
    {
        id: 4,
        metric: 'PR Review Time',
        operator: 'above',
        value: 24,
        unit: 'hours',
        severity: 'warning',
        enabled: false,
    },
];

const notificationChannels = [
    { id: 'slack', name: 'Slack', icon: MessageSquare, connected: true, channel: '#engineering-alerts' },
    { id: 'email', name: 'Email', icon: Mail, connected: true, recipients: 'team-leads@company.com' },
    { id: 'webhook', name: 'Webhook', icon: Link2, connected: false, endpoint: null },
];

function getAlertIcon(type: string) {
    switch (type) {
        case 'critical': return <AlertTriangle className="size-5 text-rose-600" />;
        case 'warning': return <AlertCircle className="size-5 text-amber-600" />;
        case 'info': return <Info className="size-5 text-primary" />;
        default: return <Bell className="size-5 text-muted-foreground" />;
    }
}

function getAlertBg(type: string) {
    switch (type) {
        case 'critical': return 'bg-rose-50 border-rose-200';
        case 'warning': return 'bg-amber-50 border-amber-500/30';
        case 'info': return 'bg-blue-50 border-blue-200';
        default: return 'bg-secondary border-border';
    }
}

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function AlertsPage() {
    const activeAlerts = alerts.filter(a => !a.acknowledged);
    const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.acknowledged);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground">Alerts & Notifications</h2>
                    <p className="text-muted-foreground mt-1">Configure alerts and monitor delivery health</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
                    <Plus className="size-4" />
                    New Alert Rule
                </button>
            </div>

            {/* Alert Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`rounded-xl p-5 border ${criticalAlerts.length > 0 ? 'bg-rose-50 border-rose-200' : 'bg-card border-border'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${criticalAlerts.length > 0 ? 'text-rose-700' : 'text-muted-foreground'}`}>Critical Alerts</span>
                        <AlertTriangle className={`size-5 ${criticalAlerts.length > 0 ? 'text-rose-600' : 'text-muted-foreground'}`} />
                    </div>
                    <p className={`text-3xl font-semibold ${criticalAlerts.length > 0 ? 'text-rose-700' : 'text-foreground'}`}>
                        {criticalAlerts.length}
                    </p>
                    <p className={`text-xs mt-1 ${criticalAlerts.length > 0 ? 'text-rose-600' : 'text-muted-foreground'}`}>
                        {criticalAlerts.length > 0 ? 'Requires immediate attention' : 'All clear'}
                    </p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Active Alerts</span>
                        <Bell className="size-5 text-amber-600" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{activeAlerts.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Unacknowledged</p>
                </div>

                <div className="bg-card rounded-xl p-5 border border-border">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-muted-foreground text-sm">Alert Rules</span>
                        <Settings className="size-5 text-primary" />
                    </div>
                    <p className="text-3xl font-semibold text-foreground">{alertThresholds.filter(t => t.enabled).length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Active thresholds</p>
                </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">Active Alerts</h3>
                        <p className="text-sm text-muted-foreground">Current alerts requiring attention</p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary font-medium">
                        Mark all as read
                    </button>
                </div>

                <div className="space-y-3">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`flex items-start gap-4 p-4 rounded-xl border ${getAlertBg(alert.type)} ${alert.acknowledged ? 'opacity-60' : ''
                                }`}
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                {getAlertIcon(alert.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-medium text-foreground">{alert.title}</h4>
                                    {!alert.acknowledged && (
                                        <button className="text-muted-foreground hover:text-muted-foreground p-1 hover:bg-card rounded transition-colors">
                                            <X className="size-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3" />
                                        {formatTimestamp(alert.timestamp)}
                                    </span>
                                    {alert.metric && (
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="size-3" />
                                            {alert.metric}
                                        </span>
                                    )}
                                    {alert.acknowledged && (
                                        <span className="flex items-center gap-1 text-emerald-600">
                                            <CheckCircle2 className="size-3" />
                                            Acknowledged
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Alert Thresholds */}
            <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-foreground mb-1">Alert Thresholds</h3>
                        <p className="text-sm text-muted-foreground">Configure when to trigger alerts</p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary font-medium flex items-center gap-1">
                        <Plus className="size-4" />
                        Add Threshold
                    </button>
                </div>

                <div className="space-y-3">
                    {alertThresholds.map((threshold) => (
                        <div
                            key={threshold.id}
                            className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${threshold.enabled ? 'bg-blue-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-card shadow-sm transition-transform ${threshold.enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>

                                <div>
                                    <p className="font-medium text-foreground">{threshold.metric}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Alert when {threshold.operator} {threshold.value} {threshold.unit}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${threshold.severity === 'critical'
                                            ? 'bg-rose-100 text-rose-700'
                                            : 'bg-amber-500/20 text-amber-400'
                                        }`}
                                >
                                    {threshold.severity}
                                </span>
                                <button className="p-2 text-muted-foreground hover:text-muted-foreground hover:bg-card rounded-lg transition-colors">
                                    <Settings className="size-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notification Channels */}
            <div className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-1">Notification Channels</h3>
                    <p className="text-sm text-muted-foreground">Where to send alert notifications</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {notificationChannels.map((channel) => {
                        const Icon = channel.icon;
                        return (
                            <div
                                key={channel.id}
                                className={`p-5 rounded-xl border ${channel.connected
                                        ? 'border-emerald-500/30 bg-emerald-50/50'
                                        : 'border-border bg-secondary'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-lg ${channel.connected ? 'bg-emerald-500/20' : 'bg-secondary'
                                                }`}
                                        >
                                            <Icon
                                                className={`size-5 ${channel.connected ? 'text-emerald-600' : 'text-muted-foreground'
                                                    }`}
                                            />
                                        </div>
                                        <span className="font-medium text-foreground">{channel.name}</span>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${channel.connected
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-slate-200 text-muted-foreground'
                                            }`}
                                    >
                                        {channel.connected ? 'Connected' : 'Not configured'}
                                    </span>
                                </div>

                                {channel.connected ? (
                                    <p className="text-sm text-muted-foreground">
                                        {channel.channel || channel.recipients || channel.endpoint}
                                    </p>
                                ) : (
                                    <button className="text-sm text-primary hover:text-primary font-medium">
                                        Configure →
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
