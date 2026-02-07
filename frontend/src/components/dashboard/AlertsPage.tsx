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
        case 'info': return <Info className="size-5 text-blue-600" />;
        default: return <Bell className="size-5 text-slate-600" />;
    }
}

function getAlertBg(type: string) {
    switch (type) {
        case 'critical': return 'bg-rose-50 border-rose-200';
        case 'warning': return 'bg-amber-50 border-amber-200';
        case 'info': return 'bg-blue-50 border-blue-200';
        default: return 'bg-slate-50 border-slate-200';
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
                    <h2 className="text-2xl font-semibold text-slate-900">Alerts & Notifications</h2>
                    <p className="text-slate-600 mt-1">Configure alerts and monitor delivery health</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-blue-500/20">
                    <Plus className="size-4" />
                    New Alert Rule
                </button>
            </div>

            {/* Alert Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`rounded-xl p-5 border ${criticalAlerts.length > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${criticalAlerts.length > 0 ? 'text-rose-700' : 'text-slate-600'}`}>Critical Alerts</span>
                        <AlertTriangle className={`size-5 ${criticalAlerts.length > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
                    </div>
                    <p className={`text-3xl font-semibold ${criticalAlerts.length > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
                        {criticalAlerts.length}
                    </p>
                    <p className={`text-xs mt-1 ${criticalAlerts.length > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {criticalAlerts.length > 0 ? 'Requires immediate attention' : 'All clear'}
                    </p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Active Alerts</span>
                        <Bell className="size-5 text-amber-600" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900">{activeAlerts.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Unacknowledged</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600 text-sm">Alert Rules</span>
                        <Settings className="size-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-semibold text-slate-900">{alertThresholds.filter(t => t.enabled).length}</p>
                    <p className="text-xs text-slate-500 mt-1">Active thresholds</p>
                </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Active Alerts</h3>
                        <p className="text-sm text-slate-600">Current alerts requiring attention</p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
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
                                    <h4 className="font-medium text-slate-900">{alert.title}</h4>
                                    {!alert.acknowledged && (
                                        <button className="text-slate-400 hover:text-slate-600 p-1 hover:bg-white rounded transition-colors">
                                            <X className="size-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{alert.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
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
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Alert Thresholds</h3>
                        <p className="text-sm text-slate-600">Configure when to trigger alerts</p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        <Plus className="size-4" />
                        Add Threshold
                    </button>
                </div>

                <div className="space-y-3">
                    {alertThresholds.map((threshold) => (
                        <div
                            key={threshold.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${threshold.enabled ? 'bg-blue-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${threshold.enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>

                                <div>
                                    <p className="font-medium text-slate-900">{threshold.metric}</p>
                                    <p className="text-sm text-slate-600">
                                        Alert when {threshold.operator} {threshold.value} {threshold.unit}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${threshold.severity === 'critical'
                                            ? 'bg-rose-100 text-rose-700'
                                            : 'bg-amber-100 text-amber-700'
                                        }`}
                                >
                                    {threshold.severity}
                                </span>
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors">
                                    <Settings className="size-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notification Channels */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-1">Notification Channels</h3>
                    <p className="text-sm text-slate-600">Where to send alert notifications</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {notificationChannels.map((channel) => {
                        const Icon = channel.icon;
                        return (
                            <div
                                key={channel.id}
                                className={`p-5 rounded-xl border ${channel.connected
                                        ? 'border-emerald-200 bg-emerald-50/50'
                                        : 'border-slate-200 bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-lg ${channel.connected ? 'bg-emerald-100' : 'bg-slate-100'
                                                }`}
                                        >
                                            <Icon
                                                className={`size-5 ${channel.connected ? 'text-emerald-600' : 'text-slate-500'
                                                    }`}
                                            />
                                        </div>
                                        <span className="font-medium text-slate-900">{channel.name}</span>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${channel.connected
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-200 text-slate-600'
                                            }`}
                                    >
                                        {channel.connected ? 'Connected' : 'Not configured'}
                                    </span>
                                </div>

                                {channel.connected ? (
                                    <p className="text-sm text-slate-600">
                                        {channel.channel || channel.recipients || channel.endpoint}
                                    </p>
                                ) : (
                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
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
