import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Database, 
  Search, 
  Brain, 
  ListTodo, 
  PlayCircle, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  BookOpen, 
  Link as LinkIcon, 
  Share2, 
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Zap,
  Languages,
  ChevronDown,
  ChevronLeft,
  X,
  HelpCircle,
  Menu,
  Bell,
  Search as SearchIcon,
  Filter,
  Calendar,
  Layers,
  Shield,
  FileCheck,
  Gavel,
  UserCheck,
  Copy,
  RefreshCw,
  Download,
  AlertTriangle,
  Activity,
  GitCommit,
  MessageSquare,
  History,
  GitPullRequest,
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  RotateCcw,
  BarChart,
  PieChart,
  TrendingUp,
  Target,
  AlertOctagon,
  TrendingDown,
  ArrowRight,
  Compass,
  ShieldAlert,
  GitMerge,
  BookMarked,
  Link2,
  Mail,
  SearchCode,
  XCircle,
  FileText,
  ListChecks,
  Ban,
  Scale,
  Edit3,
  Eye,
  Cookie,
  Key,
  Trash2,
  CalendarDays,
  Send,
  Globe2,
  MenuSquare,
  PanelBottom
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { cn } from './utils/cn';
import { StatusBadge, type StatusType } from './components/StatusBadge';
import { DataTable } from './components/DataTable';
import { ScoreCard } from './components/ScoreCard';
import { TimelineView } from './components/TimelineView';
import { EvidenceChain } from './components/EvidenceChain';
import { FilterBar } from './components/FilterBar';
import { EmptyState } from './components/EmptyState';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ApprovalButton } from './components/ApprovalButton';
import { type ColumnDef } from '@tanstack/react-table';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';

// --- Event Tracking Mock ---
const trackEvent = (eventName: string, properties: any = {}) => {
  console.log(`[Event Tracked] ${eventName}:`, properties);
  // In a real app, this would send data to Mixpanel, GA4, etc.
};

// --- Types ---
export type ProductStatus = 'intake' | 'probing' | 'connected' | 'active' | 'paused' | 'archived';

export interface InputProfile {
  product_url: string;
  target_regions: string[];
  experiment_goal: string;
  primary_conversion_event: string;
  language_override?: string;
  brand_safety_policy?: string;
  production_cap_override?: number;
}

export interface ProbeResult {
  status: 'completed' | 'partial' | 'failed';
  detected_language: string;
  sitemap_found: boolean;
  robots_txt_found: boolean;
  page_types: string[];
  directory_structure: string[];
  completion_rate: number;
}

export interface Product {
  id: string;
  name: string;
  url: string;
  status: ProductStatus;
  current_phase: string;
  created_at: string;
  connection_count: number;
  input_profile?: InputProfile;
  probe_result?: ProbeResult;
}

interface DashboardStats {
  activeProducts: number;
  approvedStrategies: number;
  completedExecutions: number;
  activeStrategies: number;
}

export interface DiscoveryRun {
  id: string;
  product_id: string;
  status: 'completed' | 'partial' | 'running';
  trigger_type: 'manual' | 'scheduled';
  found_count: number;
  error_message?: string;
  created_at: string;
}

export interface OpportunityItem {
  id: string;
  product_id: string;
  run_id: string;
  type: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  intent?: string;
  volume?: string;
  cpc?: string;
  why?: string;
  evidence: { step: string; detail: string }[];
  created_at: string;
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-2.5 transition-all duration-200 group relative ${
      active 
        ? 'bg-blue-50 text-blue-700 font-medium rounded-r-full' 
        : 'text-zinc-600 hover:bg-zinc-100 rounded-r-full'
    }`}
  >
    <Icon size={20} className={active ? 'text-blue-700' : 'text-zinc-500 group-hover:text-zinc-700'} />
    <span className="text-[13px]">{label}</span>
    {active && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-700 rounded-r-full" />
    )}
  </button>
);

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-4">
    <div className="px-6 py-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{title}</div>
    {children}
  </div>
);

const StatCard = ({ label, value, trend, color, active, onClick }: any) => {
  const isUp = trend?.includes('↑');
  const isDown = trend?.includes('↓');
  
  return (
    <button 
      onClick={onClick}
      className={`flex-1 p-4 border-b-4 transition-all text-left group ${
        active ? `border-${color}-500 bg-zinc-50` : 'border-transparent hover:bg-zinc-50'
      }`}
    >
      <div className="text-[11px] font-medium text-zinc-500 mb-1 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
        {label}
      </div>
      <div className="text-2xl font-bold text-zinc-800 group-hover:text-blue-600 transition-colors">{value}</div>
      {trend && (
        <div className={cn(
          "text-[11px] mt-1 flex items-center gap-1",
          isUp ? "text-emerald-600" : isDown ? "text-rose-600" : "text-zinc-400"
        )}>
          {trend}
        </div>
      )}
    </button>
  );
};

const ProductCard = ({ product }: any) => (
  <div className="bg-white border border-zinc-200 p-5 rounded-lg hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
        <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-500 flex items-center gap-1 hover:text-blue-600">
          {product.url} <ExternalLink size={12} />
        </a>
      </div>
      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${
        product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
      }`}>
        {product.status}
      </span>
    </div>
    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-4">
      <Clock size={14} />
      <span>Phase: {product.current_phase}</span>
    </div>
  </div>
);

// --- Auth Guard ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  const { locale } = useParams();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// --- Main Pages ---

const Dashboard = ({ stats, strategies, decisions, alerts, onRefresh }: { stats: DashboardStats, strategies: any[], decisions: any[], alerts: any[], onRefresh: () => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locale } = useParams();
  const [activeMetric, setActiveMetric] = useState('clicks');

  const strategyColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'nameKey',
      header: t('dashboard.columns.strategy_name') || 'Strategy Name',
      cell: (info) => <span className="font-bold text-zinc-900">{t(info.getValue() as string)}</span>,
    },
    {
      accessorKey: 'score',
      header: t('dashboard.columns.score') || 'Score',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-12 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                (info.getValue() as number) >= 80 ? "bg-emerald-500" : 
                (info.getValue() as number) >= 60 ? "bg-amber-500" : "bg-rose-500"
              )}
              style={{ width: `${info.getValue()}%` }}
            />
          </div>
          <span className="text-xs font-bold text-zinc-600">{info.getValue() as number}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: t('dashboard.columns.status') || 'Status',
      cell: (info) => <StatusBadge status={info.getValue() as StatusType} />,
    },
    {
      accessorKey: 'lastDecisionKey',
      header: t('dashboard.columns.last_decision') || 'Last Decision',
      cell: (info) => <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{t(info.getValue() as string)}</span>,
    },
  ];

  // Mock data for ScoreCard
  const scoreMetrics = [
    { subject: 'Growth', A: 85, fullMark: 100 },
    { subject: 'Safety', A: 95, fullMark: 100 },
    { subject: 'Efficiency', A: 70, fullMark: 100 },
    { subject: 'Quality', A: 90, fullMark: 100 },
    { subject: 'Speed', A: 65, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('dashboard.title') || 'Dashboard'}</h1>
          <p className="text-zinc-500 text-xs font-medium mt-1">{t('dashboard.subtitle') || 'Global view of your growth engine'}</p>
        </div>
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-all uppercase tracking-widest shadow-sm"
        >
          <RefreshCw size={14} />
          {t('dashboard.refresh_data') || 'Refresh Data'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label={t('dashboard.active_products') || 'Active Products'} 
          value={stats.activeProducts} 
          trend="↑ 12% vs last month" 
          color="blue" 
          active={activeMetric === 'clicks'}
          onClick={() => navigate(`/${locale}/products`)}
        />
        <StatCard 
          label={t('dashboard.approved_strategies') || 'Approved Strategies'} 
          value={stats.approvedStrategies} 
          trend="↑ 5 new this week" 
          color="purple" 
          active={activeMetric === 'impressions'}
          onClick={() => navigate(`/${locale}/strategy`)}
        />
        <StatCard 
          label={t('dashboard.completed_executions') || 'Completed Executions'} 
          value={stats.completedExecutions} 
          trend="↑ 142 total" 
          color="emerald" 
          active={activeMetric === 'ctr'}
          onClick={() => navigate(`/${locale}/execution`)}
        />
        <StatCard 
          label={t('dashboard.active_strategies') || 'Active Strategies'} 
          value={stats.activeStrategies} 
          trend="↑ 24% potential" 
          color="amber" 
          active={activeMetric === 'position'}
          onClick={() => navigate(`/${locale}/strategy`)}
        />
      </div>

      <div className="space-y-6 mt-6">
        {/* Strategy Status */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">{t('dashboard.active_strategies') || 'Active Strategies'}</h3>
            <button 
              onClick={() => navigate(`/${locale}/strategy`)}
              className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest"
            >
              {t('dashboard.view_all') || 'View All'}
            </button>
          </div>
          <DataTable 
            columns={strategyColumns} 
            data={strategies} 
            searchPlaceholder="Filter strategies..." 
            onRowClick={() => navigate(`/${locale}/strategy`)}
          />
        </div>

        {/* Automated Decisions */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">{t('dashboard.automated_decisions') || 'Automated Decisions'}</h3>
            <button 
              onClick={() => navigate(`/${locale}/optimization`)}
              className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest"
            >
              {t('dashboard.optimization_center') || 'Optimization Center'}
            </button>
          </div>
          <TimelineView 
            items={decisions.map(d => ({
              ...d,
              label: d.labelKey ? t(d.labelKey) : d.label,
              description: d.descriptionKey ? t(d.descriptionKey) : d.description
            }))} 
            onItemClick={() => navigate(`/${locale}/optimization`)}
          />
        </div>

        {/* Risk Alerts */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">{t('dashboard.risk_alerts') || 'Risk Alerts'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "flex gap-3 p-4 border rounded-lg transition-all cursor-pointer hover:shadow-md",
                  alert.type === 'error' ? "bg-rose-50 border-rose-100" : 
                  alert.type === 'warning' ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"
                )}
                onClick={() => navigate(`/${locale}/${alert.target}`)}
              >
                {alert.type === 'error' ? (
                  <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                ) : alert.type === 'warning' ? (
                  <Shield size={20} className="text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <Zap size={20} className="text-blue-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={cn(
                    "text-xs font-bold",
                    alert.type === 'error' ? "text-rose-900" : 
                    alert.type === 'warning' ? "text-amber-900" : "text-blue-900"
                  )}>{t(alert.titleKey)}</h4>
                  <p className={cn(
                    "text-[11px] mt-1 line-clamp-2",
                    alert.type === 'error' ? "text-rose-700" : 
                    alert.type === 'warning' ? "text-amber-700" : "text-blue-700"
                  )}>{t(alert.descriptionKey)}</p>
                  <button 
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest mt-3 hover:underline",
                      alert.type === 'error' ? "text-rose-600" : 
                      alert.type === 'warning' ? "text-amber-600" : "text-blue-600"
                    )}
                  >
                    {t(alert.actionLabelKey)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AddConnectionWizard = ({ isOpen, onClose, productId, onComplete }: { isOpen: boolean, onClose: () => void, productId: string, onComplete: () => void }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSourceSelect = (source: string) => {
    setSelectedSource(source);
    setStep(2);
    setError(null);
  };

  const handleAuthorize = async () => {
    if (!selectedSource) return;
    setIsAuthenticating(true);
    setError(null);
    
    // Step 1: Simulate OAuth Delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 2: Show Verifying Screen
    setStep(3);
    setIsAuthenticating(false);

    try {
      // Step 3: Actual API Call in background
      const res = await fetch(`/api/products/${productId}/connections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: selectedSource })
      });

      // Step 4: Simulated "Verification" Delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (res.ok) {
        setError(null);
        setStep(4); // Success
        onComplete(); // Refresh list in background
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          handleFinalize();
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || 'Verification failed');
        setStep(5); // Failure Screen
      }
    } catch (err) {
      // For demo purposes, if network fails, we can still show success or a clear failure
      console.error('Connection failed');
      setError('Network error occurred during verification');
      setStep(5); // Show Failure Screen
    }
  };

  const handleRetry = () => {
    setStep(2);
    setError(null);
  };

  const handleFinalize = () => {
    onClose();
    // Reset for next time
    setTimeout(() => {
      setStep(1);
      setSelectedSource(null);
      setError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-widest">{t('connections.wizard.title')}</h3>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              {step === 1 ? t('connections.wizard.step_1') : 
               step === 2 ? t('connections.wizard.step_2') : 
               step === 3 ? t('connections.wizard.verifying') : 
               step === 4 ? t('connections.wizard.success') : t('connections.wizard.failure')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'gsc', name: 'Google Search Console', desc: t('connections.wizard.gsc_desc') },
                { id: 'ga4', name: 'Google Analytics 4', desc: t('connections.wizard.ga4_desc') }
              ].map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSourceSelect(source.name)}
                  className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-white border border-zinc-100 rounded-lg flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Database size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900">{source.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{source.desc}</div>
                  </div>
                  <ChevronRight size={18} className="ml-auto text-zinc-300 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-2">{t('connections.wizard.step_2')}</h4>
              <p className="text-sm text-zinc-500 mb-8 px-4">
                {t('connections.wizard.authorize')}
              </p>
              {error && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-xs font-bold">
                  {error}
                </div>
              )}
              <button
                onClick={handleAuthorize}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
              >
                {isAuthenticating ? <RefreshCw size={20} className="animate-spin" /> : <Globe size={20} />}
                {isAuthenticating ? t('connections.authenticating') : t('connections.wizard.authorize')}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <RefreshCw size={48} className="text-blue-600 animate-spin mx-auto mb-6" />
              <h4 className="text-xl font-bold text-zinc-900 mb-2">{t('connections.wizard.verifying')}</h4>
              <p className="text-sm text-zinc-500">{t('connections.wizard.success_desc')}</p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-2">{t('connections.wizard.success')}</h4>
              <p className="text-sm text-zinc-500 mb-8 px-4">
                {t('connections.wizard.success_desc')}
              </p>
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest animate-pulse">
                {t('common.closing_soon') || 'Returning to connections list...'}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-2">{t('connections.wizard.failure')}</h4>
              <p className="text-sm text-zinc-500 mb-8 px-4">
                {error || t('connections.wizard.failure_desc')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                  {t('connections.wizard.retry')}
                </button>
                <button
                  onClick={handleFinalize}
                  className="flex-1 bg-zinc-100 text-zinc-900 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const FixSuggestionsModal = ({ isOpen, onClose, connection, onFix }: { isOpen: boolean, onClose: () => void, connection: any, onFix: () => void }) => {
  const { t } = useTranslation();
  const [isFixing, setIsFixing] = useState(false);

  const handleFix = async () => {
    setIsFixing(true);
    const res = await fetch(`/api/connections/${connection.id}/check`, { method: 'POST' });
    if (res.ok) {
      onFix();
      onClose();
    }
    setIsFixing(false);
  };

  if (!isOpen || !connection) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-widest">{t('connections.fix_suggestions.title')}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-rose-600 shrink-0" />
              <div>
                <div className="text-sm font-bold text-rose-900">{connection.source}: {connection.error_message}</div>
                <div className="text-xs text-rose-700 mt-1">{t('connections.oauth_expired_desc')}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              t('connections.fix_suggestions.step_1'),
              t('connections.fix_suggestions.step_2'),
              t('connections.fix_suggestions.step_3')
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                <div className="text-sm text-zinc-600 font-medium">{step}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleFix}
            disabled={isFixing}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
          >
            {isFixing ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
            {isFixing ? t('connections.running_check') : t('connections.fix_now')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Connections = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState<string | null>(null);
  const [fixingConnId, setFixingConnId] = useState<string | null>(null);
  const [checkingConnId, setCheckingConnId] = useState<string | null>(null);

  const fetchData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    
    try {
      const res = await fetch(`/api/products/${product.id}/connections`);
      if (res.ok) {
        const data = await res.json();
        setConnections(data);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [product.id]);

  const handleRunCheck = async (id: string) => {
    setCheckingConnId(id);
    const res = await fetch(`/api/connections/${id}/check`, { method: 'POST' });
    if (res.ok) {
      await fetchData(true);
    }
    setCheckingConnId(null);
  };

  const handleDisconnect = async () => {
    if (!showDisconnectConfirm) return;
    await fetch(`/api/connections/${showDisconnectConfirm}`, { method: 'DELETE' });
    await fetchData(true);
    setShowDisconnectConfirm(null);
  };

  const handleFixNow = (id: string) => {
    setFixingConnId(id);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <RefreshCw size={40} className="text-zinc-300 animate-spin" />
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {isRefreshing && (
        <div className="absolute top-0 right-0 p-2">
          <RefreshCw size={16} className="text-blue-600 animate-spin" />
        </div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('connections.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('connections.subtitle', { product: product.name })}</p>
        </div>
        <button 
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md"
        >
          <Plus size={16} />
          {t('connections.add_connection')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {connections.length === 0 ? (
          <EmptyState 
            title={t('products.no_products')} 
            description={t('products.subtitle')} 
            actionLabel={t('connections.add_connection')}
            onAction={() => setIsWizardOpen(true)}
          />
        ) : (
          connections.map((conn) => (
            <div key={conn.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-zinc-300 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    conn.source.includes('Google') ? 'bg-blue-50 text-blue-600' : 'bg-zinc-50 text-zinc-600'
                  }`}>
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg">{conn.source}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-bold">{t('connections.last_sync')}: {conn.last_sync}</span>
                      <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        conn.health === 'Healthy' ? 'text-emerald-600' : 
                        conn.health === 'Error' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {conn.health === 'Healthy' ? t('connections.healthy') : t('connections.action_required')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={conn.status as StatusType} />
                  <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-blue-600 transition-colors" title={t('connections.settings')}>
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={() => setShowDisconnectConfirm(conn.id)}
                    className="p-2 hover:bg-rose-50 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors" 
                    title={t('connections.disconnect')}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Health Check Details */}
              <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{t('connections.integrity_check')}</h4>
                  <button 
                    onClick={() => handleRunCheck(conn.id)}
                    disabled={checkingConnId === conn.id}
                    className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={checkingConnId === conn.id ? 'animate-spin' : ''} /> 
                    {checkingConnId === conn.id ? t('connections.running_check') : t('connections.run_check')}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t('connections.api_status')}</div>
                    <div className="flex items-center gap-1.5">
                      {conn.details.apiAlive ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-rose-500" />}
                      <span className="text-sm font-bold text-zinc-900">{conn.details.apiAlive ? t('connections.alive') : t('connections.error')}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t('connections.data_latency')}</div>
                    <div className="flex items-center gap-1.5">
                      {conn.details.dataLatency.includes('m') && parseInt(conn.details.dataLatency) <= 15 ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                      <span className="text-sm font-bold text-zinc-900">{conn.details.dataLatency}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t('connections.integrity_rate')}</div>
                    <div className="flex items-center gap-1.5">
                      {parseInt(conn.details.dataIntegrity) >= 95 ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                      <span className="text-sm font-bold text-zinc-900">{conn.details.dataIntegrity}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{t('connections.attribution')}</div>
                    <div className="flex items-center gap-1.5">
                      {conn.details.attribution === 'available' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-rose-500" />}
                      <span className="text-sm font-bold text-zinc-900 capitalize">{conn.details.attribution === 'available' ? t('connections.available') : t('connections.unavailable')}</span>
                    </div>
                  </div>
                </div>

                {conn.error_message && (
                  <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start justify-between">
                    <div className="flex gap-3">
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-rose-900">{t('connections.connection_error')}: {conn.error_message}</h5>
                        <p className="text-[11px] text-rose-700 mt-1">{t('connections.oauth_expired_desc')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFixNow(conn.id)}
                      className="text-[10px] font-bold text-rose-600 bg-white px-3 py-1.5 rounded border border-rose-200 hover:bg-rose-50 uppercase tracking-widest transition-colors"
                    >
                      {t('connections.fix_now')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <AddConnectionWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        productId={product.id}
        onComplete={() => fetchData(true)}
      />

      <FixSuggestionsModal 
        isOpen={!!fixingConnId}
        onClose={() => setFixingConnId(null)}
        connection={connections.find(c => c.id === fixingConnId)}
        onFix={() => fetchData(true)}
      />

      <ConfirmDialog
        isOpen={!!showDisconnectConfirm}
        onClose={() => setShowDisconnectConfirm(null)}
        onConfirm={handleDisconnect}
        title={t('connections.disconnect_dialog.title')}
        description={t('connections.disconnect_dialog.description', { source: connections.find(c => c.id === showDisconnectConfirm)?.source })}
        confirmLabel={t('connections.disconnect_dialog.confirm')}
        cancelLabel={t('common.cancel')}
        variant="danger"
      />
    </div>
  );
};

const ScoreBar = ({ label, value, reverseColor = false }: { label: string, value: number, reverseColor?: boolean }) => {
  const getColor = () => {
    if (reverseColor) {
      if (value < 30) return 'bg-emerald-500';
      if (value < 70) return 'bg-amber-500';
      return 'bg-rose-500';
    }
    if (value >= 80) return 'bg-emerald-500';
    if (value >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-bold text-zinc-700">{value}</span>
      </div>
      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${getColor()}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const Strategy = ({ product, onTabChange }: { product: Product, onTabChange?: (tab: string) => void }) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [strategies, setStrategies] = useState([
    { 
      id: '1', 
      nameKey: 'strategy.names.strat_1', 
      score: 92, 
      confidence: 88,
      status: 'pending_approval', 
      roi: '$4,500/mo', 
      impactKeys: ['strategy.impacts.imp_1', 'strategy.impacts.imp_4'], 
      costKey: 'strategy.costs.cost_1',
      riskKey: 'strategy.risks.Low',
      recommended: true,
      conflict: false,
      batch: 'Batch-1',
      scoreBreakdown: { roi: 95, successRate: 85, gap: 90, tech: 100, risk: 10 },
      evidence: [
        { stepKey: 'strategy.evidence.discovery', detailKey: 'strategy.evidence.ev_1_1' },
        { stepKey: 'strategy.evidence.competitor_analysis', detailKey: 'strategy.evidence.ev_1_2' },
        { stepKey: 'strategy.evidence.resource_check', detailKey: 'strategy.evidence.ev_1_3' },
        { stepKey: 'strategy.evidence.roi_projection', detailKey: 'strategy.evidence.ev_1_4' }
      ]
    },
    { 
      id: '2', 
      nameKey: 'strategy.names.strat_2', 
      score: 85, 
      confidence: 95,
      status: 'pending_approval', 
      roi: '$2,100/mo', 
      impactKeys: ['strategy.impacts.imp_2'], 
      costKey: 'strategy.costs.cost_2',
      riskKey: 'strategy.risks.Medium',
      recommended: true,
      conflict: false,
      batch: 'Batch-1',
      scoreBreakdown: { roi: 80, successRate: 95, gap: 70, tech: 40, risk: 30 },
      evidence: [
        { stepKey: 'strategy.evidence.audit', detailKey: 'strategy.evidence.ev_2_1' },
        { stepKey: 'strategy.evidence.impact_analysis', detailKey: 'strategy.evidence.ev_2_2' },
        { stepKey: 'strategy.evidence.roi_projection', detailKey: 'strategy.evidence.ev_2_3' }
      ]
    },
    { 
      id: '3', 
      nameKey: 'strategy.names.strat_3', 
      score: 78, 
      confidence: 70,
      status: 'pending_approval', 
      roi: '$1,800/mo', 
      impactKeys: ['strategy.impacts.imp_3', 'strategy.impacts.imp_5'], 
      costKey: 'strategy.costs.cost_3',
      riskKey: 'strategy.risks.Low',
      recommended: true,
      conflict: true,
      conflictReason: 'strategy.conflicts.outreach_budget',
      batch: 'Batch-2',
      scoreBreakdown: { roi: 75, successRate: 60, gap: 85, tech: 100, risk: 20 },
      evidence: [
        { stepKey: 'strategy.evidence.link_intersect', detailKey: 'strategy.evidence.ev_3_1' },
        { stepKey: 'strategy.evidence.prospecting', detailKey: 'strategy.evidence.ev_3_2' },
        { stepKey: 'strategy.evidence.roi_projection', detailKey: 'strategy.evidence.ev_3_3' }
      ]
    },
  ]);

  useEffect(() => {
    // Simulate strategy generation
    console.log('[Event Tracked] strategy_generated', { product: product.id, count: strategies.length });
    if (strategies.length < 3) {
      alert(t('strategy.insufficient_candidates') || 'Less than 3 candidates available. Showing existing candidates.');
    }
  }, [product.id]);

  const trackEvent = (eventName: string, data: any) => {
    console.log(`[Event Tracked] ${eventName}`, data);
  };

  const handleApprove = async (id: string) => {
    const strat = strategies.find(s => s.id === id);
    if (strat?.conflict) {
      alert(t('strategy.conflict_warning') || 'Resource conflict detected. Please select one strategy to proceed.');
      // In a real app, we might block approval or prompt for resolution
    }

    setIsApproving(id);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStrategies(strategies.map(s => s.id === id ? { ...s, status: 'approved' } : s));
      trackEvent('strategy_approved', { strategyId: id });
      alert(`Strategy "${t(strat?.nameKey || '')}" approved. Backlog generation triggered.`);
    } catch (error) {
      console.error('Failed to approve strategy', error);
      alert('Failed to approve strategy. Rolling back status.');
    } finally {
      setIsApproving(null);
    }
  };

  const handleOverride = (id: string) => {
    const reason = window.prompt(t('strategy.override_reason_prompt') || "Please provide a reason for overriding this strategy's priority:");
    if (reason) {
      trackEvent('manual_override_applied', { strategyId: id, reason });
      alert(t('strategy.override_applied') || 'Override applied successfully.');
    }
  };

  const handleOverrideSubmit = () => {
    if (isOverrideModalOpen && overrideReason) {
      trackEvent('manual_override_applied', { strategyId: isOverrideModalOpen, reason: overrideReason });
      setIsOverrideModalOpen(null);
      setOverrideReason('');
      alert(t('strategy.override_applied') || 'Override applied successfully.');
    }
  };

  const handleCompareToggle = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        alert(t('strategy.compare_limit') || 'You can only compare up to 3 strategies.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  const handleCompareAction = () => {
    if (selectedForCompare.length < 2) {
      alert(t('strategy.compare_strategies') || 'Select 2-3 strategies to compare.');
      return;
    }
    setIsCompareModalOpen(true);
  };

  const handleViewHistory = () => {
    alert(t('strategy.view_history') || 'Viewing strategy portfolio history.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('strategy.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('strategy.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsHistoryModalOpen(true)} className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
            <History size={16} /> {t('strategy.history')}
          </button>
          <button onClick={handleCompareAction} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
            <GitPullRequest size={16} /> {t('strategy.compare')} {selectedForCompare.length > 0 && `(${selectedForCompare.length})`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {strategies.map((strat) => (
          <div key={strat.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${strat.conflict ? 'border-amber-200' : 'border-zinc-200 hover:border-zinc-300'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 mt-1"
                      checked={selectedForCompare.includes(strat.id)}
                      onChange={() => handleCompareToggle(strat.id)}
                    />
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <Brain size={24} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-zinc-900 text-lg">{t(strat.nameKey)}</h3>
                      {strat.recommended && (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{t('strategy.top_recommended')}</span>
                      )}
                      {strat.conflict && (
                        <span 
                          title={t(strat.conflictReason)}
                          className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1 cursor-help group relative"
                        >
                          <AlertTriangle size={10} /> {t('strategy.conflict')}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-zinc-900 text-white text-[10px] rounded shadow-xl z-50 normal-case tracking-normal">
                            {t(strat.conflictReason)}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900" />
                          </div>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{t('strategy.score')}: <span className={strat.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}>{strat.score}</span></span>
                      <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{t('strategy.confidence')}: {strat.confidence}%</span>
                      <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                        {t('strategy.target')}: <button onClick={() => onTabChange?.('backlog')} className="text-blue-600 hover:underline">{strat.batch}</button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsOverrideModalOpen(strat.id)} className="px-3 py-1.5 text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-all uppercase tracking-widest">
                    {t('strategy.override')}
                  </button>
                  {strat.status === 'approved' ? (
                    <span className="px-4 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-lg uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 size={14} /> {t('strategy.approved') || 'Approved'}
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleApprove(strat.id)}
                      disabled={isApproving === strat.id}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all uppercase tracking-widest shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {isApproving === strat.id ? <RefreshCw size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
                      {isApproving === strat.id ? t('strategy.approving') : t('strategy.approve')}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('strategy.roi')}</div>
                  <div className="text-sm font-bold text-emerald-600">{strat.roi}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('strategy.impact')}</div>
                  <div className="flex flex-wrap gap-1">
                    {strat.impactKeys.map(key => (
                      <span key={key} className="text-[10px] font-bold text-zinc-700 bg-zinc-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {t(key)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('strategy.cost')}</div>
                  <div className="text-sm font-bold text-zinc-800">{t(strat.costKey)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('strategy.risk')}</div>
                  <div className={`text-sm font-bold ${strat.riskKey.includes('Low') ? 'text-emerald-600' : strat.riskKey.includes('Medium') ? 'text-amber-600' : 'text-rose-600'}`}>{t(strat.riskKey)}</div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{t('strategy.breakdown')}</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                      { subject: `${t('strategy.roi_potential')} (${strat.scoreBreakdown.roi})`, A: strat.scoreBreakdown.roi, fullMark: 100 },
                      { subject: `${t('strategy.hist_success')} (${strat.scoreBreakdown.successRate})`, A: strat.scoreBreakdown.successRate, fullMark: 100 },
                      { subject: `${t('strategy.comp_gap')} (${strat.scoreBreakdown.gap})`, A: strat.scoreBreakdown.gap, fullMark: 100 },
                      { subject: `${t('strategy.tech_health')} (${strat.scoreBreakdown.tech})`, A: strat.scoreBreakdown.tech, fullMark: 100 },
                      { subject: `${t('strategy.risk_inv')} (${100 - strat.scoreBreakdown.risk})`, A: 100 - strat.scoreBreakdown.risk, fullMark: 100 },
                    ]}>
                      <PolarGrid stroke="#e4e4e7" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e4e4e7' }} />
                      <Radar name={t(strat.nameKey)} dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border-t border-zinc-100 pt-4 mt-4">
                <button 
                  onClick={() => setExpandedId(expandedId === strat.id ? null : strat.id)}
                  className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline"
                >
                  <HelpCircle size={14} /> {t('strategy.why')}
                  <ChevronDown size={14} className={`transition-transform ${expandedId === strat.id ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {expandedId === strat.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-4"
                    >
                      <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                        {strat.evidence.map((ev, idx) => (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            </div>
                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-zinc-200 bg-white shadow-sm">
                              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{t(ev.stepKey)}</div>
                              <div className="text-xs text-zinc-600">{t(ev.detailKey)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-zinc-900">{t('strategy.compare_title') || 'Strategy Comparison'}</h3>
              <button onClick={() => setIsCompareModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { subject: t('strategy.roi_potential'), fullMark: 100, ...Object.fromEntries(selectedForCompare.map((id, idx) => [`strat${idx}`, strategies.find(s => s.id === id)?.scoreBreakdown.roi || 0])) },
                  { subject: t('strategy.hist_success'), fullMark: 100, ...Object.fromEntries(selectedForCompare.map((id, idx) => [`strat${idx}`, strategies.find(s => s.id === id)?.scoreBreakdown.successRate || 0])) },
                  { subject: t('strategy.comp_gap'), fullMark: 100, ...Object.fromEntries(selectedForCompare.map((id, idx) => [`strat${idx}`, strategies.find(s => s.id === id)?.scoreBreakdown.gap || 0])) },
                  { subject: t('strategy.tech_health'), fullMark: 100, ...Object.fromEntries(selectedForCompare.map((id, idx) => [`strat${idx}`, strategies.find(s => s.id === id)?.scoreBreakdown.tech || 0])) },
                  { subject: t('strategy.risk_inv'), fullMark: 100, ...Object.fromEntries(selectedForCompare.map((id, idx) => [`strat${idx}`, 100 - (strategies.find(s => s.id === id)?.scoreBreakdown.risk || 0)])) },
                ]}>
                  <PolarGrid stroke="#e4e4e7" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e4e4e7' }} />
                  {selectedForCompare.map((id, idx) => {
                    const colors = ['#3b82f6', '#10b981', '#f59e0b'];
                    const strat = strategies.find(s => s.id === id);
                    return (
                      <Radar key={id} name={t(strat?.nameKey || '')} dataKey={`strat${idx}`} stroke={colors[idx]} fill={colors[idx]} fillOpacity={0.3} />
                    );
                  })}
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {selectedForCompare.map((id, idx) => {
                const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];
                const strat = strategies.find(s => s.id === id);
                return (
                  <div key={id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[idx]}`} />
                    <span className="text-xs font-bold text-zinc-700">{t(strat?.nameKey || '')}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsCompareModalOpen(false)} className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all">
                {t('strategy.close_compare') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('strategy.history')}</h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{product.name}</p>
                </div>
                <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {[1, 2, 3].map(v => (
                  <div key={v} className="flex gap-4 p-4 border border-zinc-100 rounded-xl hover:bg-zinc-50 transition-colors">
                    <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 shrink-0">
                      <History size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-zinc-900">v1.0.{v} - Portfolio Update</h4>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">2026-03-0{v} 10:30</span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">System generated new candidates based on GSC data refresh. 3 new opportunities identified and prioritized.</p>
                      <div className="mt-3 flex gap-2">
                        <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">View Snapshot</button>
                        <button className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:underline">Restore</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end">
                <button onClick={() => setIsHistoryModalOpen(false)} className="bg-zinc-900 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all uppercase tracking-widest">
                  {t('common.close') || 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Override Modal */}
      <AnimatePresence>
        {isOverrideModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('strategy.override')}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Manual Priority Adjustment</p>
                </div>
                <button onClick={() => setIsOverrideModalOpen(null)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t('strategy.override_reason_prompt')}</label>
                <textarea 
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm outline-none focus:border-blue-500 h-32 resize-none transition-all"
                  placeholder="e.g. Strategic priority shift due to market trends..."
                />
              </div>
              
              <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setIsOverrideModalOpen(null)} className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest">
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={handleOverrideSubmit}
                  disabled={!overrideReason}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 active:scale-[0.98] uppercase tracking-widest"
                >
                  {t('strategy.override')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Backlog = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([
    { 
      id: '1', 
      title: 'Reddit Probe: "Astrology vs Astronomy"', 
      type: 'Social', 
      batch: 'Batch-0', 
      priority: 'Highest', 
      status: 'in_progress', 
      dependencies: [], 
      expected: 'Validate CTR > 5%' 
    },
    { 
      id: '2', 
      title: 'Pillar Page: Zodiac Compatibility', 
      type: 'SEO', 
      batch: 'Batch-1', 
      priority: 'High', 
      status: 'pending', 
      dependencies: ['1'], 
      expected: '+15k traffic/mo' 
    },
    { 
      id: '3', 
      title: 'Optimize LCP on Mobile Product Pages', 
      type: 'Tech', 
      batch: 'Batch-1', 
      priority: 'High', 
      status: 'pending', 
      dependencies: [], 
      expected: 'LCP < 2.5s' 
    },
    { 
      id: '4', 
      title: 'Outreach Campaign: Astrology Tools', 
      type: 'Link', 
      batch: 'Batch-2', 
      priority: 'Medium', 
      status: 'pending', 
      dependencies: [], 
      expected: '5 High-DR Links' 
    },
    { 
      id: '5', 
      title: 'Experimental: AI Horoscope Generator', 
      type: 'SEO', 
      batch: 'Batch-3', 
      priority: 'Low', 
      status: 'pending', 
      dependencies: [], 
      expected: 'Test Engagement' 
    },
  ]);

  const batches = ['Batch-0', 'Batch-1', 'Batch-2', 'Batch-3'];

  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState<string | null>(null);

  const handleApproveBatch = (batch: string) => {
    console.log('Approving batch:', batch);
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task =>
        (batch === 'All' || task.batch === batch)
          ? { ...task, status: 'completed' }
          : task
      );
      console.log('New tasks:', newTasks);
      return newTasks;
    });
  };

  const handleOverrideSubmit = () => {
    if (isOverrideModalOpen && overrideReason) {
      console.log('Override applied', { taskId: isOverrideModalOpen, reason: overrideReason });
      setIsOverrideModalOpen(null);
      setOverrideReason('');
      alert(t('strategy.override_applied') || 'Override applied successfully.');
    }
  };

  const handleViewDependencies = (taskId: string) => {
    setIsDependencyModalOpen(taskId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('backlog.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('backlog.subtitle', { product: product.name })}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
            {t('backlog.filter')}
          </button>
          <button 
            onClick={() => handleApproveBatch('All')}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2"
          >
            <CheckCircle2 size={16} /> Approve
          </button>
        </div>
      </div>

      {/* Social-First Status Panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-indigo-900 font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
            <MessageSquare size={16} /> {t('backlog.social_probe.title')}
          </h3>
          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">{t('backlog.social_probe.status')}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-lg p-3 border border-indigo-50">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{t('backlog.social_probe.active_probes')}</div>
            <div className="text-lg font-bold text-indigo-900">3 Topics</div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 border border-indigo-50">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{t('backlog.social_probe.top_signal')}</div>
            <div className="text-lg font-bold text-emerald-600 flex items-center gap-2">
              6.5% CTR <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">2.1x {t('backlog.social_probe.baseline')}</span>
            </div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 border border-indigo-50 flex flex-col justify-center">
            <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <ArrowUpRight size={14} className="text-emerald-500" /> 1 {t('backlog.social_probe.promoted')}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban / Batch View */}
      <div className="space-y-6">
        {batches.map(batch => {
          const batchTasks = tasks.filter(t => t.batch === batch);
          if (batchTasks.length === 0) return null;
          
          return (
            <div key={batch} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{batch}</h3>
                  {batch === 'Batch-0' && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{t('backlog.batch.highest_priority')}</span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{batchTasks.length} {t('backlog.batch.tasks')}</span>
              </div>
              <div className="divide-y divide-zinc-100">
                {batchTasks.map((task) => (
                  <div key={task.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50 transition-all group">
                    <div className="flex items-start md:items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        task.status === 'in_progress' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-50 text-zinc-400'
                      }`}>
                        {task.status === 'completed' ? <CheckCircle2 size={16} /> :
                         task.status === 'in_progress' ? <PlayCircle size={16} /> : <Clock size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                            task.type === 'Social' ? 'bg-indigo-100 text-indigo-700' :
                            task.type === 'SEO' ? 'bg-blue-100 text-blue-700' :
                            task.type === 'Tech' ? 'bg-zinc-100 text-zinc-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>{task.type}</span>
                          <h4 className="text-sm font-bold text-zinc-900">{task.title}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${
                            task.priority === 'Highest' ? 'text-indigo-600' :
                            task.priority === 'High' ? 'text-rose-500' : 
                            task.priority === 'Medium' ? 'text-amber-500' : 'text-zinc-400'
                          }`}>{task.priority} {t('backlog.batch.priority')}</span>
                          
                          {task.dependencies.length > 0 && (
                            <>
                              <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:text-blue-600" onClick={() => handleViewDependencies(task.id)}>
                                <GitCommit size={10} /> {t('backlog.batch.dep')}: #{task.dependencies.join(', ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 ml-12 md:ml-0">
                      <div className="text-left md:text-right">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{t('backlog.batch.expected')}</div>
                        <div className="text-xs font-bold text-zinc-700">{task.expected}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={task.status as StatusType} />
                        <button 
                          onClick={() => setIsOverrideModalOpen(task.id)}
                          className="p-2 hover:bg-zinc-200 rounded-lg text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" 
                          title={t('backlog.batch.override')}
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Override Modal */}
      <AnimatePresence>
        {isOverrideModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('backlog.batch.override')}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Manual Priority/Batch Adjustment</p>
                </div>
                <button onClick={() => setIsOverrideModalOpen(null)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t('strategy.override_reason_prompt')}</label>
                <textarea 
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm outline-none focus:border-blue-500 h-32 resize-none transition-all"
                  placeholder="e.g. Strategic priority shift due to market trends..."
                />
              </div>
              
              <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setIsOverrideModalOpen(null)} className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest">
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={handleOverrideSubmit}
                  disabled={!overrideReason}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 active:scale-[0.98] uppercase tracking-widest"
                >
                  {t('strategy.override')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dependency Modal */}
      <AnimatePresence>
        {isDependencyModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('backlog.batch.dep')}</h3>
                <button onClick={() => setIsDependencyModalOpen(null)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="text-sm text-zinc-600">
                Dependency graph for task #{isDependencyModalOpen} would be displayed here.
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end">
                <button onClick={() => setIsDependencyModalOpen(null)} className="bg-zinc-900 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all uppercase tracking-widest">
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Execution = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'seo' | 'social' | 'exceptions'>('seo');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isViewLogModalOpen, setIsViewLogModalOpen] = useState(false);
  const [isRetryConfirmOpen, setIsRetryConfirmOpen] = useState(false);
  const [isMarkExceptionModalOpen, setIsMarkExceptionModalOpen] = useState(false);

  const handleViewLog = (log: any) => { setSelectedLog(log); setIsViewLogModalOpen(true); };
  const handleRetry = (log: any) => { setSelectedLog(log); setIsRetryConfirmOpen(true); };
  const handleMarkException = (log: any) => { setSelectedLog(log); setIsMarkExceptionModalOpen(true); };

  const seoLogs = [
    { id: 'SEO-1042', title: 'Publish Pillar: Zodiac Compatibility', status: 'completed', startTime: '2026-03-10 10:00', endTime: '2026-03-10 12:15', duration: '2h 15m', output: '/blog/zodiac-compatibility', indexed: true, internalLinks: true, sitemap: true },
    { id: 'SEO-1043', title: 'Optimize Meta: Product Pages', status: 'running', startTime: '2026-03-11 09:00', endTime: '-', duration: '45m', output: 'Multiple URLs', indexed: false, internalLinks: false, sitemap: false },
    { id: 'SEO-1044', title: 'Fix Broken Links: Footer', status: 'failed', startTime: '2026-03-11 10:00', endTime: '2026-03-11 10:05', duration: '5m', output: 'N/A', indexed: false, internalLinks: false, sitemap: false, error: 'Crawler timeout' },
  ];

  const socialLogs = [
    { id: 'SOC-892', platform: 'Reddit', type: 'Probe', status: 'published', impressions: '1.2k', clicks: 85, ctr: '7.1%', utm: 'utm_source=reddit&utm_campaign=probe_zodiac', signal: 'Hit (2.1x)' },
    { id: 'SOC-893', platform: 'X', type: 'Content', status: 'pending_approval', impressions: '-', clicks: '-', ctr: '-', utm: 'utm_source=x&utm_campaign=zodiac_guide', signal: '-' },
    { id: 'SOC-894', platform: 'Reddit', type: 'Probe', status: 'failed', impressions: '-', clicks: '-', ctr: '-', utm: '-', signal: '-', error: 'Subreddit rules violation (Auto-mod)' },
  ];

  const exceptions = [
    { id: 'EX-01', taskId: 'SEO-1044', type: 'Execution Error', message: 'Crawler timeout after 30s', retries: 1, status: 'pending_manual' },
    { id: 'EX-02', taskId: 'SOC-894', type: 'Platform Rejection', message: 'Subreddit rules violation (Auto-mod)', retries: 0, status: 'pending_manual' },
    { id: 'EX-03', taskId: 'SEO-998', type: 'Indexation Failure', message: 'Not indexed after 48h check', retries: 2, status: 'escalated' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('execution.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('execution.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
            <Pause size={16} /> {t('execution.pause_all')}
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
            <Play size={16} /> {t('execution.resume_all')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-200">
        <button 
          onClick={() => setActiveTab('seo')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'seo' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          {t('execution.tabs.seo')}
          {activeTab === 'seo' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('social')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'social' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          {t('execution.tabs.social')}
          {activeTab === 'social' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('exceptions')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'exceptions' ? 'text-rose-600' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          {t('execution.tabs.exceptions')} <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded-full">3</span>
          {activeTab === 'exceptions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-t-full" />}
        </button>
      </div>

      {/* SEO Logs */}
      {activeTab === 'seo' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <tr>
                  <th className="p-4">{t('execution.seo_table.task')}</th>
                  <th className="p-4">{t('execution.seo_table.status')}</th>
                  <th className="p-4">{t('execution.seo_table.time')}</th>
                  <th className="p-4">{t('execution.seo_table.output')}</th>
                  <th className="p-4 text-center">{t('execution.seo_table.indexed')}</th>
                  <th className="p-4 text-center">{t('execution.seo_table.internal_links')}</th>
                  <th className="p-4 text-center">{t('execution.seo_table.sitemap')}</th>
                  <th className="p-4 text-right">{t('execution.seo_table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {seoLogs.map(log => (
                  <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-zinc-900">{log.id}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{log.title}</div>
                    </td>
                    <td className="p-4"><StatusBadge status={log.status as StatusType} /></td>
                    <td className="p-4 text-xs font-medium text-zinc-600">
                      <div>{log.startTime}</div>
                      <div className="text-zinc-400">{log.endTime}</div>
                    </td>
                    <td className="p-4 text-xs font-medium text-blue-600 hover:underline cursor-pointer">{log.output}</td>
                    <td className="p-4 text-center">{log.indexed ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <Clock size={16} className="text-zinc-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{log.internalLinks ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <Clock size={16} className="text-zinc-300 mx-auto" />}</td>
                    <td className="p-4 text-center">{log.sitemap ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <Clock size={16} className="text-zinc-300 mx-auto" />}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 transition-colors" title={t('execution.actions.view_log')} onClick={() => handleViewLog(log)}><Eye size={16} /></button>
                      <button className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 transition-colors" title={t('execution.actions.retry')} onClick={() => handleRetry(log)}><RotateCcw size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Social Logs */}
      {activeTab === 'social' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <tr>
                  <th className="p-4">{t('execution.social_table.task')}</th>
                  <th className="p-4">{t('execution.social_table.type')}</th>
                  <th className="p-4">{t('execution.social_table.status')}</th>
                  <th className="p-4">{t('execution.social_table.impressions')} / {t('execution.social_table.clicks')} / {t('execution.social_table.ctr')}</th>
                  <th className="p-4">{t('execution.social_table.utm')}</th>
                  <th className="p-4">Probe Signal</th>
                  <th className="p-4 text-right">{t('execution.social_table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {socialLogs.map(log => (
                  <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-zinc-900">{log.id}</div>
                      <div className="text-xs font-bold text-indigo-600 mt-0.5">{log.platform}</div>
                    </td>
                    <td className="p-4"><span className="bg-zinc-100 text-zinc-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">{log.type}</span></td>
                    <td className="p-4"><StatusBadge status={log.status as StatusType} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                        <span>{log.impressions}</span> / <span>{log.clicks}</span> / <span className="text-emerald-600">{log.ctr}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[10px] font-mono text-zinc-500 max-w-[150px] truncate" title={log.utm}>{log.utm}</td>
                    <td className="p-4">
                      {log.signal !== '-' ? (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">{log.signal}</span>
                      ) : <span className="text-zinc-300">-</span>}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 transition-colors" title={t('execution.actions.view_log')} onClick={() => handleViewLog(log)}><Eye size={16} /></button>
                      <button className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 transition-colors" title={t('execution.actions.retry')} onClick={() => handleRetry(log)}><RotateCcw size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exceptions Panel */}
      {activeTab === 'exceptions' && (
        <div className="grid grid-cols-1 gap-4">
          {exceptions.map(ex => (
            <div key={ex.id} className="bg-rose-50 border border-rose-100 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0 mt-1 md:mt-0">
                  <AlertOctagon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded uppercase tracking-widest">{ex.type}</span>
                    <span className="text-xs font-bold text-zinc-900">Task: {ex.taskId}</span>
                  </div>
                  <p className="text-sm font-medium text-rose-900">{ex.message}</p>
                  <div className="text-[10px] font-bold text-rose-700 uppercase tracking-widest mt-2">
                    Auto-retries attempted: {ex.retries} | Status: {ex.status.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-1.5 bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-50 transition-all shadow-sm" onClick={() => handleRetry(ex)}>
                  <RotateCcw size={14} /> {t('execution.actions.retry')}
                </button>
                <button className="flex items-center gap-1.5 bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-700 transition-all shadow-sm" onClick={() => handleMarkException(ex)}>
                  <CheckCircle2 size={14} /> {t('execution.actions.resolve')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Log Modal */}
      <AnimatePresence>
        {isViewLogModalOpen && selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('execution.actions.view_log')} - {selectedLog.id}</h3>
                <button onClick={() => setIsViewLogModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="text-sm text-zinc-600">
                <pre className="bg-zinc-100 p-4 rounded-lg overflow-x-auto">{JSON.stringify(selectedLog, null, 2)}</pre>
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end">
                <button onClick={() => setIsViewLogModalOpen(false)} className="bg-zinc-900 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all uppercase tracking-widest">
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Retry Confirm Dialog */}
      <AnimatePresence>
        {isRetryConfirmOpen && selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8"
            >
              <h3 className="text-xl font-bold text-zinc-900 mb-4">{t('execution.actions.retry_confirm')}</h3>
              <p className="text-zinc-600 mb-8">{t('execution.actions.retry_desc', { id: selectedLog.id })}</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsRetryConfirmOpen(false)} className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest">
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={() => { console.log('Retrying:', selectedLog.id); setIsRetryConfirmOpen(false); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 active:scale-[0.98] uppercase tracking-widest"
                >
                  {t('execution.actions.retry')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mark Exception Modal */}
      <AnimatePresence>
        {isMarkExceptionModalOpen && selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('execution.actions.mark_exception')}</h3>
                <button onClick={() => setIsMarkExceptionModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t('execution.actions.exception_reason_prompt')}</label>
                <textarea 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm outline-none focus:border-rose-500 h-32 resize-none transition-all"
                  placeholder="e.g. Manual intervention required due to..."
                />
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end gap-3">
                <button onClick={() => setIsMarkExceptionModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest">
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={() => { console.log('Marking exception:', selectedLog.id); setIsMarkExceptionModalOpen(false); }}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-100 active:scale-[0.98] uppercase tracking-widest"
                >
                  {t('execution.actions.mark_exception')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Measurement = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [activeDimension, setActiveDimension] = useState<'channel' | 'content' | 'page'>('channel');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPostmortemModalOpen, setIsPostmortemModalOpen] = useState(false);

  const handleViewReview = (rev: any) => { setSelectedReview(rev); setIsReviewModalOpen(true); };
  const handleViewPostmortem = (rev: any) => { setSelectedReview(rev); setIsPostmortemModalOpen(true); };

  const reviews = [
    { id: 'REV-01', strategyId: 'STR-92', conclusion: t('measurement.reviews.status.achieved'), confidence: '98%', target: '+15k traffic', actual: '+18.2k traffic', utmMatch: '99.2%' },
    { id: 'REV-02', strategyId: 'STR-85', conclusion: t('measurement.reviews.status.failed'), confidence: '95%', target: 'LCP < 2.5s', actual: 'LCP 3.1s', utmMatch: 'N/A' },
    { id: 'REV-03', strategyId: 'STR-78', conclusion: t('measurement.reviews.status.insufficient'), confidence: '45%', target: '5 Links', actual: '2 Links', utmMatch: 'N/A' },
  ];

  const dimensionData = {
    channel: [
      { name: 'SEO', traffic: 4000, conversion: 240, roi: 3.2 },
      { name: 'Social', traffic: 3000, conversion: 139, roi: 2.1 },
      { name: 'Link', traffic: 2000, conversion: 98, roi: 1.8 },
      { name: 'Direct', traffic: 2780, conversion: 390, roi: 4.5 },
    ],
    content: [
      { name: 'Blog', traffic: 5000, conversion: 300, roi: 3.5 },
      { name: 'Video', traffic: 2000, conversion: 150, roi: 2.8 },
      { name: 'Case Study', traffic: 1000, conversion: 200, roi: 5.0 },
    ],
    page: [
      { name: '/home', traffic: 8000, conversion: 500, roi: 4.0 },
      { name: '/pricing', traffic: 3000, conversion: 600, roi: 6.0 },
      { name: '/blog/post-1', traffic: 1500, conversion: 50, roi: 1.5 },
    ]
  };

  const currentData = dimensionData[activeDimension];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('measurement.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('measurement.subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
          <Download size={16} /> {t('measurement.export')}
        </button>
      </div>

      {/* Channel Isolation Health */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-1 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> {t('measurement.health.title')}
          </h3>
          <p className="text-[11px] text-zinc-500 font-medium">{t('measurement.health.desc')}</p>
        </div>
        <div className="flex gap-8">
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('measurement.health.utm')}</div>
            <div className="text-xl font-bold text-emerald-600">99.2%</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('measurement.health.conflict')}</div>
            <div className="text-xl font-bold text-emerald-600">0.8%</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('measurement.health.valid')}</div>
            <div className="text-xl font-bold text-emerald-600">98.5%</div>
          </div>
        </div>
      </div>

      {/* Attribution Dashboard */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <div className="flex gap-2">
            {(['channel', 'content', 'page'] as const).map((dim) => (
              <button 
                key={dim}
                onClick={() => setActiveDimension(dim)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeDimension === dim ? 'bg-blue-100 text-blue-700' : 'text-zinc-500 hover:bg-zinc-100'}`}
              >
                {t(`measurement.dashboard.${dim}`)}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <Calendar size={12} /> {t('measurement.dashboard.last_30')}
          </div>
        </div>
        <div className="p-8 h-64 bg-zinc-50/30">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="traffic" fill="#3b82f6" name={t('measurement.dashboard.traffic')} />
              <Bar dataKey="conversion" fill="#10b981" name={t('measurement.dashboard.conversion')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Measurement Reviews */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">{t('measurement.reviews.title')}</h3>
        <div className="grid grid-cols-1 gap-4">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-zinc-300 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    rev.conclusion === t('measurement.reviews.status.achieved') ? 'bg-emerald-50 text-emerald-600' :
                    rev.conclusion === t('measurement.reviews.status.failed') ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {rev.conclusion === t('measurement.reviews.status.achieved') ? <Target size={20} /> :
                     rev.conclusion === t('measurement.reviews.status.failed') ? <AlertOctagon size={20} /> : <HelpCircle size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-900">{rev.id}</span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('measurement.reviews.strategy')}: {rev.strategyId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        rev.conclusion === t('measurement.reviews.status.achieved') ? 'bg-emerald-100 text-emerald-700' :
                        rev.conclusion === t('measurement.reviews.status.failed') ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>{rev.conclusion}</span>
                      <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('measurement.reviews.confidence')}: {rev.confidence}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{t('measurement.reviews.target')}</div>
                    <div className="text-xs font-bold text-zinc-700">{rev.target}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{t('measurement.reviews.actual')}</div>
                    <div className={`text-xs font-bold ${rev.conclusion === t('measurement.reviews.status.achieved') ? 'text-emerald-600' : 'text-rose-600'}`}>{rev.actual}</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{t('measurement.reviews.utm_match')}</div>
                    <div className="text-xs font-bold text-zinc-700">{rev.utmMatch}</div>
                  </div>
                </div>

                {rev.conclusion === t('measurement.reviews.status.failed') && (
                  <button className="flex items-center justify-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-rose-100 transition-all" onClick={() => handleViewPostmortem(rev)}>
                    <Search size={14} /> {t('measurement.reviews.postmortem')}
                  </button>
                )}
                {rev.conclusion !== t('measurement.reviews.status.failed') && (
                  <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors" onClick={() => handleViewReview(rev)}>
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && selectedReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('measurement.reviews.details')} - {selectedReview.id}</h3>
                <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('measurement.reviews.strategy')}</div>
                    <div className="text-sm font-bold text-zinc-900">{selectedReview.strategyId}</div>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('measurement.reviews.confidence')}</div>
                    <div className="text-sm font-bold text-zinc-900">{selectedReview.confidence}</div>
                  </div>
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">{t('measurement.reviews.metrics')}</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-600">{t('measurement.reviews.target')}</span>
                      <span className="text-sm font-bold text-zinc-900">{selectedReview.target}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-zinc-600">{t('measurement.reviews.actual')}</span>
                      <span className="text-sm font-bold text-emerald-600">{selectedReview.actual}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('measurement.reviews.utm_match')}</div>
                  <div className="text-sm font-bold text-zinc-900">{selectedReview.utmMatch}</div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end">
                <button onClick={() => setIsReviewModalOpen(false)} className="bg-zinc-900 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all uppercase tracking-widest">
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Postmortem Modal */}
      <AnimatePresence>
        {isPostmortemModalOpen && selectedReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('measurement.reviews.postmortem')} - {selectedReview.id}</h3>
                <button onClick={() => setIsPostmortemModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('measurement.postmortem.exposure')}</div>
                    <div className="text-xl font-bold text-zinc-900">72%</div>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('measurement.postmortem.intent')}</div>
                    <div className="text-xl font-bold text-zinc-900">45%</div>
                  </div>
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('measurement.postmortem.conversion')}</div>
                    <div className="text-xl font-bold text-zinc-900">12%</div>
                  </div>
                </div>
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{t('measurement.postmortem.analysis')}</div>
                  <p className="text-sm text-zinc-700 leading-relaxed">{t('measurement.postmortem.analysis_desc')}</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end">
                <button onClick={() => setIsPostmortemModalOpen(false)} className="bg-zinc-900 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all uppercase tracking-widest">
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Optimization = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [isGuidedOps, setIsGuidedOps] = useState(false);

  const decisions = [
    { 
      id: 'DEC-01', 
      strategyId: 'STR-92 (Zodiac Pillar)', 
      type: 'expand', 
      currentScore: 92, 
      threshold: '> 85 (Scale Up)', 
      window: '3 consecutive weeks',
      reason: 'Traffic exceeded target by 20%. High conversion rate on internal links.',
      reallocation: 'Shift 1 writer from STR-78 to accelerate production.'
    },
    { 
      id: 'DEC-02', 
      strategyId: 'STR-85 (CWV Fixes)', 
      type: 'iterate', 
      currentScore: 65, 
      threshold: '50-85 (Iterate)', 
      window: '2 consecutive weeks',
      reason: 'LCP improved but still missing 2.5s target. Need to optimize third-party scripts.',
      reallocation: 'Maintain current dev resource allocation.'
    },
    { 
      id: 'DEC-03', 
      strategyId: 'STR-78 (Outreach)', 
      type: 'pause', 
      currentScore: 42, 
      threshold: '< 50 (Pause)', 
      window: '2 consecutive weeks',
      reason: 'Response rate below 2%. High effort with low yield. Requires new prospecting angle.',
      reallocation: 'Pause outreach. Reallocate budget to content production (STR-92).'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('optimization.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('optimization.subtitle', { product: product.name })}</p>
        </div>
        <button 
          onClick={() => setIsGuidedOps(!isGuidedOps)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
            isGuidedOps ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
          }`}
        >
          <Compass size={16} /> {isGuidedOps ? t('optimization.guided_ops.exit') : t('optimization.guided_ops.enter')}
        </button>
      </div>

      {isGuidedOps && (
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Compass className="text-indigo-300" size={24} />
            <h3 className="text-lg font-bold uppercase tracking-widest">{t('optimization.guided_ops.mode')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">{t('optimization.guided_ops.goal')}</div>
              <div className="text-sm font-bold mb-1">{t('optimization.guided_ops.goal_value')}</div>
              <div className="text-xs text-indigo-200">{t('optimization.guided_ops.trajectory')}</div>
            </div>
            
            <div className="md:col-span-2 bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">{t('optimization.guided_ops.actions')}</div>
              <ul className="space-y-2">
                <li className="text-sm flex items-start gap-2">
                  <ArrowUpRight size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-emerald-300">STR-92 {t('optimization.guided_ops.expand')}:</strong> {t('optimization.guided_ops.expand_desc')}</span>
                </li>
                <li className="text-sm flex items-start gap-2">
                  <Pause size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span><strong className="text-amber-300">STR-78 {t('optimization.guided_ops.pause')}:</strong> {t('optimization.guided_ops.pause_desc')}</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-1 flex flex-col justify-center gap-3">
              <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest text-center">{t('optimization.guided_ops.execute')}</div>
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors shadow-sm flex items-center justify-center gap-2">
                <Play size={14} /> {t('optimization.guided_ops.one_click')}
              </button>
              <div className="text-[10px] text-indigo-200 text-center">{t('optimization.guided_ops.auto_postmortem')}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {decisions.map(dec => (
          <div key={dec.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm hover:border-zinc-300 transition-all">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    dec.type === 'expand' ? 'bg-emerald-50 text-emerald-600' :
                    dec.type === 'iterate' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {dec.type === 'expand' ? <TrendingUp size={20} /> :
                     dec.type === 'iterate' ? <RotateCcw size={20} /> : <Pause size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        dec.type === 'expand' ? 'bg-emerald-100 text-emerald-700' :
                        dec.type === 'iterate' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>{t(`optimization.types.${dec.type}`)}</span>
                      <span className="text-xs font-bold text-zinc-500">{dec.id}</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 text-sm">{dec.strategyId}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-all uppercase tracking-widest">
                    {t('optimization.decision.override')}
                  </button>
                  <button className="px-4 py-1.5 text-xs font-bold text-white bg-zinc-900 hover:bg-black rounded-lg transition-all uppercase tracking-widest shadow-sm flex items-center gap-2">
                    <CheckCircle2 size={14} /> {t('optimization.decision.confirm')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('optimization.decision.current_score')}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${dec.currentScore >= 80 ? 'text-emerald-600' : dec.currentScore >= 50 ? 'text-blue-600' : 'text-amber-600'}`}>
                      {dec.currentScore}
                    </span>
                    <button className="text-zinc-400 hover:text-blue-600 transition-colors" title={t('optimization.decision.view_trend')}><BarChart size={14} /></button>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('optimization.decision.threshold')}</div>
                  <div className="text-xs font-bold text-zinc-700">{dec.threshold}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('optimization.decision.window')}</div>
                  <div className="text-xs font-bold text-zinc-700">{dec.window}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('optimization.decision.reallocation')}</div>
                  <div className="text-xs font-bold text-zinc-700 line-clamp-2" title={dec.reallocation}>{dec.reallocation}</div>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                <HelpCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-0.5">{t('optimization.decision.reasoning')}</div>
                  <div className="text-xs text-blue-900">{dec.reason}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Governance = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const overrides = [
    { id: 'OVR-102', who: 'Admin (Sarah J.)', when: '2 hours ago', why: 'Client requested immediate pause due to budget freeze.', what: 'Changed STR-78 decision from Iterate to Pause', scope: 'Strategy STR-78', scoreBefore: 65, scoreAfter: 42, effect7d: '-12% Traffic', effect14d: 'Pending' },
    { id: 'OVR-101', who: 'SEO Lead (Mike T.)', when: '3 days ago', why: 'Pushing high-priority seasonal content.', what: 'Promoted Task SEO-1042 to Batch-0', scope: 'Task SEO-1042', scoreBefore: 88, scoreAfter: 95, effect7d: '+5% Impressions', effect14d: '+12% Impressions' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('governance.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('governance.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
            <GitMerge size={16} /> {t('governance.compare')}
          </button>
        </div>
      </div>

      {/* Negative Intervention Warning */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldAlert size={20} className="text-rose-600" />
          <div>
            <h3 className="text-sm font-bold text-rose-900">{t('governance.alert.title')}</h3>
            <p className="text-xs text-rose-700 mt-0.5">{t('governance.alert.desc')}</p>
          </div>
        </div>
        <button className="bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all uppercase tracking-widest">
          {t('governance.alert.trigger')}
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{t('governance.log.title')}</h3>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('governance.log.last_30')}</span>
        </div>
        <div className="divide-y divide-zinc-100">
          {overrides.map(log => (
            <div key={log.id} className="p-6 hover:bg-zinc-50 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
                    <UserCheck size={14} className="text-zinc-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-zinc-900">{log.who}</span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{log.when}</span>
                    </div>
                    <div className="text-xs font-bold text-zinc-700 bg-zinc-100 inline-block px-2 py-1 rounded mb-2">
                      {log.what}
                    </div>
                    <p className="text-xs text-zinc-600"><strong className="text-zinc-900">{t('governance.log.reason')}:</strong> {log.why}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('governance.log.scope')}</div>
                  <div className="text-xs font-bold text-zinc-700">{log.scope}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <div className="flex items-center justify-between md:justify-start md:gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('governance.log.score_before')}</div>
                    <div className="text-sm font-bold text-zinc-500">{log.scoreBefore}</div>
                  </div>
                  <ArrowRight size={14} className="text-zinc-300" />
                  <div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('governance.log.score_after')}</div>
                    <div className="text-sm font-bold text-zinc-900">{log.scoreAfter}</div>
                  </div>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-zinc-200 pt-3 md:pt-0 md:pl-4">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('governance.log.effect_7d')}</div>
                  <div className={`text-sm font-bold ${log.effect7d.includes('-') ? 'text-rose-600' : 'text-emerald-600'}`}>{log.effect7d}</div>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-zinc-200 pt-3 md:pt-0 md:pl-4">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('governance.log.effect_14d')}</div>
                  <div className={`text-sm font-bold ${log.effect14d.includes('-') ? 'text-rose-600' : log.effect14d === 'Pending' ? 'text-zinc-400' : 'text-emerald-600'}`}>{log.effect14d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Playbook = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  const entries = [
    {
      id: 'PB-01',
      title: 'Social-First Topic Validation',
      type: 'success_pattern',
      conditions: { productType: 'B2C / Content', region: 'Global', goal: 'Traffic Growth' },
      steps: [
        'Generate 5 variations of a topic angle.',
        'Post as text/polls on relevant Reddit/X communities.',
        'Measure CTR and Engagement after 24h.',
        'If CTR > 2x baseline, promote to Batch-0 SEO production.'
      ],
      effect: '+45% higher organic ranking success rate compared to unvalidated topics.',
      sourceStrategy: 'STR-42',
      scope: 'Applicable to any high-volume informational keyword cluster.'
    },
    {
      id: 'PB-02',
      title: 'Mass Directory Submissions',
      type: 'failure_pattern',
      conditions: { productType: 'Any', region: 'Any', goal: 'Domain Authority' },
      steps: [
        'Scrape list of 500+ general web directories.',
        'Automate profile creation and link dropping.',
        'Wait for indexation.'
      ],
      effect: 'Triggered algorithmic penalty. 0 measurable impact on target keyword rankings.',
      sourceStrategy: 'STR-15',
      scope: 'Do not use. High risk of manual action.'
    },
    {
      id: 'PB-03',
      title: 'Competitor "Alternative To" Pages',
      type: 'success_pattern',
      conditions: { productType: 'SaaS', region: 'US/UK', goal: 'High-Intent Conversions' },
      steps: [
        'Identify top 3 competitors via Ahrefs.',
        'Create dedicated "Product vs Competitor" landing pages.',
        'Highlight specific feature gaps and pricing advantages.',
        'Implement structured data (FAQ, Product).'
      ],
      effect: 'Captured 15% of competitor brand search volume. 4.2% conversion rate.',
      sourceStrategy: 'STR-88',
      scope: 'Best for established markets with clear market leaders.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('playbook.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('playbook.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
            <Filter size={16} /> {t('playbook.filter')}
          </button>
        </div>
      </div>

      {/* Search and Filter Panel */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder={t('playbook.search')} 
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['all', 'success_pattern', 'failure_pattern'].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg whitespace-nowrap transition-all ${
                activeFilter === filter 
                  ? 'bg-zinc-900 text-white' 
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {filter === 'all' ? t('playbook.tabs.all') : filter === 'success_pattern' ? t('playbook.tabs.success') : t('playbook.tabs.failure')}
            </button>
          ))}
        </div>
      </div>

      {/* Playbook Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.filter(e => activeFilter === 'all' || e.type === activeFilter).map(entry => (
          <div key={entry.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col ${
            entry.type === 'success_pattern' ? 'border-emerald-200 hover:border-emerald-300' : 'border-rose-200 hover:border-rose-300'
          }`}>
            <div className={`p-4 border-b flex justify-between items-start ${
              entry.type === 'success_pattern' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  entry.type === 'success_pattern' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {entry.type === 'success_pattern' ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      entry.type === 'success_pattern' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {t(`playbook.types.${entry.type}`)}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{entry.id}</span>
                  </div>
                  <h3 className="font-bold text-zinc-900">{entry.title}</h3>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1">
                  <Package size={10} /> {entry.conditions.productType}
                </span>
                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1">
                  <Globe size={10} /> {entry.conditions.region}
                </span>
                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1">
                  <Target size={10} /> {entry.conditions.goal}
                </span>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">{t('playbook.steps')}</h4>
                <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-700 font-medium">
                  {entry.steps.map((step, idx) => (
                    <li key={idx} className="pl-1">{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('playbook.effect')}</h4>
                <p className={`text-sm font-bold ${entry.type === 'success_pattern' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {entry.effect}
                </p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-zinc-100">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('playbook.scope')}</h4>
                <p className="text-xs text-zinc-600">{entry.scope}</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {t('playbook.source')}: {entry.sourceStrategy}
              </div>
              {entry.type === 'success_pattern' ? (
                <button className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm uppercase tracking-widest">
                  <Copy size={14} /> {t('playbook.reuse')}
                </button>
              ) : (
                <button className="flex items-center gap-1.5 bg-white border border-zinc-200 text-zinc-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-zinc-50 transition-all shadow-sm uppercase tracking-widest">
                  <AlertTriangle size={14} /> {t('playbook.mark_anti')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LinkOutreach = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'candidates' | 'tasks' | 'monitoring' | 'lost_alerts'>('candidates');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDraftModalOpen, setIsTaskDraftModalOpen] = useState(false);

  const [candidates, setCandidates] = useState([
    { id: 'CAND-01', domain: 'astrology-zone.com', type: 'Resource Page', relevance: 95, quality: 88, spamRisk: 12, positionScore: 90, stability: 85, action: 'Outreach', targetUrl: '/guide/compatibility' },
    { id: 'CAND-02', domain: 'daily-horoscope-hub.net', type: 'Directory', relevance: 60, quality: 40, spamRisk: 75, positionScore: 30, stability: 45, action: 'Block', targetUrl: 'N/A' },
    { id: 'CAND-03', domain: 'mindbodygreen.com', type: 'Brand Mention', relevance: 98, quality: 92, spamRisk: 5, positionScore: 95, stability: 98, action: 'Outreach', targetUrl: '/' },
  ]);

  const [tasks, setTasks] = useState([
    { id: 'OUT-01', candidateId: 'CAND-03', domain: 'mindbodygreen.com', status: 'draft', method: 'Manual', exchange: 'Content Update Suggestion', draftContent: 'Hi there, I loved your article...' },
    { id: 'OUT-02', candidateId: 'CAND-01', domain: 'astrology-zone.com', status: 'sent', method: 'Manual', exchange: 'Broken Link Replacement', draftContent: 'Hello, I noticed a broken link...' },
  ]);

  const [monitoring, setMonitoring] = useState([
    { id: 'LNK-01', domain: 'yoga-journal.com', targetUrl: '/blog/meditation', alive: true, crawlable: true, rel: 'dofollow', targetIndexable: true, anchor: 'astrology basics', lastChecked: '2 hours ago' },
    { id: 'LNK-02', domain: 'spiritual-awakening.org', targetUrl: '/guide/compatibility', alive: false, crawlable: false, rel: 'N/A', targetIndexable: true, anchor: 'N/A', lastChecked: '1 day ago', error: 'Page Not Found (404)' },
  ]);

  const [lostAlerts, setLostAlerts] = useState([
    { id: 'ALT-01', linkId: 'LNK-02', domain: 'spiritual-awakening.org', targetUrl: '/guide/compatibility', reason: 'Page Not Found (404)', detectedAt: '1 day ago', suggestedAction: 'Contact Webmaster' }
  ]);

  const trackEvent = (eventName: string, data: any) => {
    console.log(`[Event Tracked] ${eventName}`, data);
  };

  const handleViewDetails = (id: string) => {
    setSelectedCandidateId(id);
    setIsDetailsModalOpen(true);
  };

  const handleGenerateDraft = (id: string) => {
    setSelectedCandidateId(id);
    setIsDraftModalOpen(true);
  };

  const handleMarkSent = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'sent' } : t));
    trackEvent('outreach_sent', { taskId: id });
  };

  const handleViewDraft = (id: string) => {
    setSelectedTaskId(id);
    setIsTaskDraftModalOpen(true);
  };

  const handleManualCheck = async (id?: string, isBatch: boolean = false) => {
    try {
      let targetId = id;
      if (!targetId && !isBatch) {
        targetId = window.prompt('Enter Opportunity ID to check:') || undefined;
        if (!targetId) return;
      }
      const payload = isBatch ? { batch: true } : { opportunity_id: targetId };
      console.log('POST /api/link-outreach/check', payload);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isBatch) {
        trackEvent('backlink_verified', { batch: true });
        alert(`Batch link check triggered: ${JSON.stringify(payload)}`);
      } else {
        const mon = monitoring.find(m => m.id === targetId);
        if (mon) {
          if (mon.alive) {
            trackEvent('backlink_verified', { linkId: targetId });
          } else {
            trackEvent('backlink_lost', { linkId: targetId, reason: mon.error });
          }
        }
        alert(`Link check triggered: ${JSON.stringify(payload)}`);
      }
    } catch (error) {
      console.error('Failed to check links', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('outreach.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('outreach.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleManualCheck(undefined, false)} className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
            <SearchCode size={16} /> {t('outreach.manual_check')}
          </button>
          <button onClick={() => handleManualCheck(undefined, true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
            <RefreshCw size={16} /> {t('outreach.batch_verify')}
          </button>
        </div>
      </div>

      {/* Compliance Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
        <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-amber-900">{t('compliance.warning.title')}</h3>
          <p className="text-xs text-amber-700 mt-1">
            {t('outreach.warning')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-200">
        <button 
          onClick={() => setActiveTab('candidates')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'candidates' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          {t('outreach.tabs.candidates')}
          {activeTab === 'candidates' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'tasks' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          {t('outreach.tabs.tasks')}
          {activeTab === 'tasks' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('monitoring')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'monitoring' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          {t('outreach.tabs.monitoring')}
          {activeTab === 'monitoring' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('lost_alerts')}
          className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'lost_alerts' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          {t('outreach.tabs.lost_alerts')} <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded-full">1</span>
          {activeTab === 'lost_alerts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {/* Candidate Pool */}
      {activeTab === 'candidates' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <tr>
                  <th className="p-4">{t('outreach.table.domain_type')}</th>
                  <th className="p-4 text-center">{t('outreach.table.relevance')}</th>
                  <th className="p-4 text-center">{t('outreach.table.quality')}</th>
                  <th className="p-4 text-center">{t('outreach.table.spam_risk')}</th>
                  <th className="p-4 text-center">{t('outreach.table.pos_score')}</th>
                  <th className="p-4 text-center">{t('outreach.table.stability')}</th>
                  <th className="p-4">{t('outreach.table.target_url')}</th>
                  <th className="p-4">{t('outreach.table.suggested_action')}</th>
                  <th className="p-4 text-right">{t('outreach.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {candidates.map(cand => (
                  <tr key={cand.id} className={`transition-colors ${cand.action === 'Block' ? 'bg-rose-50/30' : 'hover:bg-zinc-50'}`}>
                    <td className="p-4">
                      <div className="font-bold text-zinc-900 flex items-center gap-2">
                        {cand.domain} 
                        <a href={`https://${cand.domain}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-blue-600 transition-colors">
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{cand.type}</div>
                    </td>
                    <td className="p-4 text-center font-bold text-zinc-700">{cand.relevance}</td>
                    <td className="p-4 text-center font-bold text-zinc-700">{cand.quality}</td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${cand.spamRisk > 60 ? 'text-rose-600' : cand.spamRisk > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {cand.spamRisk}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-zinc-700">{cand.positionScore}</td>
                    <td className="p-4 text-center font-bold text-zinc-700">{cand.stability}</td>
                    <td className="p-4 text-xs font-mono text-zinc-500 truncate max-w-[150px]" title={cand.targetUrl}>{cand.targetUrl}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                        cand.action === 'Outreach' ? 'bg-blue-100 text-blue-700' :
                        cand.action === 'Block' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {cand.action === 'Outreach' ? t('outreach.actions.outreach') : t('outreach.actions.block')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleViewDetails(cand.id)} className="text-zinc-400 hover:text-blue-600 transition-colors" title={t('outreach.table.view_details')}>
                          <Eye size={16} />
                        </button>
                        {cand.action === 'Outreach' && (
                          <button onClick={() => handleGenerateDraft(cand.id)} className="flex items-center gap-1.5 bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-black transition-all shadow-sm uppercase tracking-widest">
                            <Mail size={12} /> {t('outreach.table.draft')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Outreach Tasks */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-zinc-300 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-900">{task.id}</span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('outreach.table.candidate')}: {task.candidateId}</span>
                    </div>
                    <h3 className="font-bold text-zinc-900">{task.domain}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('outreach.table.method')}: {task.method}</span>
                      <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('outreach.table.exchange')}: {task.exchange}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button onClick={() => handleViewDraft(task.id)} className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
                    {t('outreach.table.draft_content')}
                  </button>
                  <StatusBadge status={task.status as StatusType} />
                  {task.status === 'draft' && (
                    <button onClick={() => handleMarkSent(task.id)} className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm uppercase tracking-widest">
                      <CheckCircle2 size={14} /> {t('outreach.table.mark_sent')}
                    </button>
                  )}
                  <button onClick={() => handleViewDetails(task.candidateId)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link Monitoring */}
      {activeTab === 'monitoring' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <tr>
                  <th className="p-4">{t('outreach.table.domain_target')}</th>
                  <th className="p-4 text-center">{t('outreach.table.status')}</th>
                  <th className="p-4 text-center">{t('outreach.table.crawlable')}</th>
                  <th className="p-4 text-center">{t('outreach.table.target_indexable')}</th>
                  <th className="p-4 text-center">{t('outreach.table.rel_attr')}</th>
                  <th className="p-4">{t('outreach.table.anchor_text')}</th>
                  <th className="p-4 text-right">{t('outreach.table.last_checked')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {monitoring.map(mon => (
                  <tr key={mon.id} className={`transition-colors ${!mon.alive ? 'bg-rose-50/30' : 'hover:bg-zinc-50'}`}>
                    <td className="p-4">
                      <div className="font-bold text-zinc-900">{mon.domain}</div>
                      <div className="text-[10px] text-zinc-500 mt-1 truncate max-w-[200px]" title={mon.targetUrl}>{mon.targetUrl}</div>
                    </td>
                    <td className="p-4 text-center">
                      {mon.alive ? (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">{t('outreach.table.live')}</span>
                      ) : (
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest" title={mon.error}>{t('outreach.table.lost')}</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {mon.crawlable ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <AlertOctagon size={16} className="text-rose-500 mx-auto" />}
                    </td>
                    <td className="p-4 text-center">
                      {mon.targetIndexable ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" /> : <AlertOctagon size={16} className="text-rose-500 mx-auto" />}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${mon.rel === 'dofollow' ? 'text-emerald-600' : 'text-zinc-500'}`}>
                        {mon.rel}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-medium text-zinc-700">
                      {mon.anchor}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{mon.lastChecked}</div>
                        <button onClick={() => handleManualCheck(mon.id, false)} className="text-zinc-400 hover:text-blue-600 transition-colors" title={t('outreach.table.verify')}>
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lost Alerts */}
      {activeTab === 'lost_alerts' && (
        <div className="grid grid-cols-1 gap-4">
          {lostAlerts.map(alert => (
            <div key={alert.id} className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
                <AlertOctagon size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-zinc-900">{alert.domain}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{alert.detectedAt}</span>
                </div>
                <p className="font-medium text-zinc-900 text-sm mb-2">{t('outreach.table.domain_target')}: {alert.targetUrl}</p>
                <div className="text-xs text-rose-700 font-bold bg-rose-100/50 inline-block px-2 py-1 rounded">{t('outreach.table.reason')}: {alert.reason}</div>
              </div>
              <button onClick={() => handleViewDetails(alert.linkId)} className="bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all uppercase tracking-widest shadow-sm">
                {t('outreach.table.view_details')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {isDetailsModalOpen && selectedCandidateId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-zinc-900">{t('outreach.table.view_details')} - {candidates.find(c => c.id === selectedCandidateId)?.domain || selectedCandidateId}</h3>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            {(() => {
              const cand = candidates.find(c => c.id === selectedCandidateId);
              if (!cand) return <div className="text-sm text-zinc-500">{t('outreach.modal.candidate_not_found')}</div>;
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t('outreach.table.relevance')}</div>
                      <div className="text-lg font-bold text-zinc-900">{cand.relevance}/100</div>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t('outreach.table.quality')}</div>
                      <div className="text-lg font-bold text-zinc-900">{cand.quality}/100</div>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t('outreach.table.spam_risk')}</div>
                      <div className={`text-lg font-bold ${cand.spamRisk > 60 ? 'text-rose-600' : cand.spamRisk > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>{cand.spamRisk}/100</div>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t('outreach.table.pos_score')}</div>
                      <div className="text-lg font-bold text-zinc-900">{cand.positionScore}/100</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t('outreach.table.target_url')}</div>
                    <div className="text-sm font-mono text-zinc-700 bg-zinc-50 p-2 rounded border border-zinc-200 break-all">{cand.targetUrl}</div>
                  </div>
                </div>
              );
            })()}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsDetailsModalOpen(false)} className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all">
                {t('outreach.modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDraftModalOpen && selectedCandidateId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-zinc-900">{t('outreach.table.draft')} - {candidates.find(c => c.id === selectedCandidateId)?.domain}</h3>
              <button onClick={() => setIsDraftModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            {(() => {
              const cand = candidates.find(c => c.id === selectedCandidateId);
              if (!cand) return null;
              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t('outreach.modal.subject')}</label>
                    <input type="text" className="w-full border border-zinc-200 rounded-lg p-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" value={`${t('outreach.modal.collab_inquiry')}: ${cand.domain} & ${product.name}`} readOnly />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t('outreach.modal.message_body')}</label>
                    <textarea className="w-full border border-zinc-200 rounded-lg p-3 text-sm font-medium h-48 focus:outline-none focus:ring-2 focus:ring-blue-500" readOnly value={t('outreach.modal.draft_template', { domain: cand.domain, targetUrl: cand.targetUrl, productName: product.name })}></textarea>
                  </div>
                </div>
              );
            })()}
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsDraftModalOpen(false)} className="bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all">
                {t('outreach.modal.cancel')}
              </button>
              <button onClick={() => { 
                const cand = candidates.find(c => c.id === selectedCandidateId);
                if (cand) {
                  const newTask = {
                    id: `OUT-0${tasks.length + 1}`,
                    candidateId: cand.id,
                    domain: cand.domain,
                    status: 'draft',
                    method: 'Manual',
                    exchange: 'Content Update Suggestion',
                    draftContent: t('outreach.modal.draft_template', { domain: cand.domain, targetUrl: cand.targetUrl, productName: product.name })
                  };
                  setTasks([...tasks, newTask]);
                  trackEvent('outreach_task_created', { taskId: newTask.id, candidateId: cand.id });
                }
                setIsDraftModalOpen(false); 
                alert(t('outreach.modal.draft_saved')); 
              }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
                {t('outreach.modal.save_to_tasks')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isTaskDraftModalOpen && selectedTaskId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-zinc-900">{t('outreach.table.draft_content')} - {tasks.find(t => t.id === selectedTaskId)?.domain}</h3>
              <button onClick={() => setIsTaskDraftModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X size={20} />
              </button>
            </div>
            {(() => {
              const task = tasks.find(t => t.id === selectedTaskId);
              if (!task) return null;
              return (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{t('outreach.modal.message_body')}</label>
                    <textarea className="w-full border border-zinc-200 rounded-lg p-3 text-sm font-medium h-48 focus:outline-none focus:ring-2 focus:ring-blue-500" readOnly value={task.draftContent}></textarea>
                  </div>
                </div>
              );
            })()}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setIsTaskDraftModalOpen(false)} className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all">
                {t('outreach.modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Compliance = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'checklists' | 'blocked'>('overview');

  const checklists = [
    { id: 'CHK-01', target: 'Execution SEO-1042', type: 'Policy Compliance', risk: 'Low', status: 'Passed' },
    { id: 'CHK-02', target: 'Strategy STR-85', type: 'Brand Consistency', risk: 'Medium', status: 'Alert', action: 'PM Approval Required' },
    { id: 'CHK-03', target: 'Execution SOC-894', type: 'Sensitive Content', risk: 'High', status: 'Blocked', action: 'Owner Approval Required' },
  ];

  const blocked = [
    { id: 'BLK-01', target: 'Execution SOC-894', reason: 'Contains flagged sensitive keywords.', timestamp: '2 hours ago', level: 'High' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('compliance.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('compliance.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
            <RefreshCw size={16} /> {t('compliance.batch_check')}
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-zinc-200">
        <button onClick={() => setActiveTab('overview')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'overview' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('compliance.tabs.overview')}
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('checklists')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'checklists' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('compliance.tabs.checklists')}
          {activeTab === 'checklists' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('blocked')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'blocked' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('compliance.tabs.blocked')}
          {activeTab === 'blocked' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-rose-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Ban className="text-rose-500" size={20} />
              <h3 className="font-bold text-rose-900 uppercase tracking-widest text-sm">{t('compliance.overview.high_risk')}</h3>
            </div>
            <div className="text-3xl font-bold text-rose-600">1</div>
            <p className="text-xs text-rose-700 mt-2">{t('compliance.overview.high_risk_desc')}</p>
          </div>
          <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="text-amber-500" size={20} />
              <h3 className="font-bold text-amber-900 uppercase tracking-widest text-sm">{t('compliance.overview.medium_risk')}</h3>
            </div>
            <div className="text-3xl font-bold text-amber-600">3</div>
            <p className="text-xs text-amber-700 mt-2">{t('compliance.overview.medium_risk_desc')}</p>
          </div>
          <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <h3 className="font-bold text-emerald-900 uppercase tracking-widest text-sm">{t('compliance.overview.low_risk')}</h3>
            </div>
            <div className="text-3xl font-bold text-emerald-600">142</div>
            <p className="text-xs text-emerald-700 mt-2">{t('compliance.overview.low_risk_desc')}</p>
          </div>
        </div>
      )}

      {activeTab === 'checklists' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="p-4">{t('compliance.table.id_target')}</th>
                <th className="p-4">{t('compliance.table.check_type')}</th>
                <th className="p-4">{t('compliance.table.risk_level')}</th>
                <th className="p-4">{t('compliance.table.status')}</th>
                <th className="p-4 text-right">{t('compliance.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {checklists.map(chk => (
                <tr key={chk.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-zinc-900">{chk.id}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{chk.target}</div>
                  </td>
                  <td className="p-4 font-medium text-zinc-700">{chk.type}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                      chk.risk === 'High' ? 'bg-rose-100 text-rose-700' :
                      chk.risk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>{chk.risk}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-zinc-900">{chk.status}</div>
                    {chk.action && <div className="text-[10px] text-zinc-500 mt-0.5">{chk.action}</div>}
                  </td>
                  <td className="p-4 text-right">
                    {chk.risk === 'High' && (
                      <button className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-700 transition-all shadow-sm">
                        {t('compliance.actions.approve')}
                      </button>
                    )}
                    {chk.risk === 'Medium' && (
                      <button className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-sm">
                        {t('compliance.actions.confirm')}
                      </button>
                    )}
                    {chk.risk === 'Low' && (
                      <button className="text-zinc-400 hover:text-zinc-600 transition-colors"><ChevronRight size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'blocked' && (
        <div className="grid grid-cols-1 gap-4">
          {blocked.map(blk => (
            <div key={blk.id} className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
                <Ban size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-zinc-900">{blk.id}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{blk.timestamp}</span>
                </div>
                <h3 className="font-bold text-rose-900 text-sm mb-1">{blk.target}</h3>
                <p className="text-xs text-rose-700">{blk.reason}</p>
              </div>
              <button className="bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all uppercase tracking-widest shadow-sm">
                {t('compliance.actions.view_details')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DataIntegrity = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'auto' | 'manual' | 'reports'>('overview');

  const dimensions = [
    { name: 'Schema', status: 'accept', detail: 'Event parameter completeness ≥ 95%' },
    { name: 'Coverage', status: 'accept', detail: 'Key event coverage ≥ 100%' },
    { name: 'Pipeline', status: 'review', detail: 'End-to-end delivery rate 98.5% (Target: 99%)' },
    { name: 'Reconciliation', status: 'accept', detail: 'Deviation ≤ 5%' },
    { name: 'Attribution', status: 'accept', detail: 'UTM integrity verified' },
    { name: 'Consent', status: 'accept', detail: 'Consent state matches policy' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('data_integrity.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('data_integrity.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
            <RefreshCw size={16} /> {t('data_integrity.trigger')}
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-zinc-200">
        <button onClick={() => setActiveTab('overview')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'overview' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('data_integrity.tabs.overview')}
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('auto')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'auto' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('data_integrity.tabs.auto')}
          {activeTab === 'auto' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('manual')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'manual' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('data_integrity.tabs.manual')} <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full">1</span>
          {activeTab === 'manual' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900">{t('data_integrity.overview.status_review')}</h3>
              <p className="text-sm text-zinc-500">{t('data_integrity.overview.status_desc')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {dimensions.map(dim => (
              <div key={dim.name} className={`p-4 rounded-lg border ${
                dim.status === 'accept' ? 'bg-emerald-50 border-emerald-100' :
                dim.status === 'review' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-zinc-500">{t(`data_integrity.overview.dimensions.${dim.name.toLowerCase()}`)}</div>
                {dim.status === 'accept' ? <CheckCircle2 className="text-emerald-500" size={20} /> :
                 dim.status === 'review' ? <AlertTriangle className="text-amber-500" size={20} /> :
                 <XCircle className="text-rose-500" size={20} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'auto' && (
        <div className="grid grid-cols-1 gap-4">
          {dimensions.map(dim => (
            <div key={dim.name} className="bg-white border border-zinc-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  dim.status === 'accept' ? 'bg-emerald-50 text-emerald-600' :
                  dim.status === 'review' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {dim.status === 'accept' ? <CheckCircle2 size={20} /> :
                   dim.status === 'review' ? <AlertTriangle size={20} /> : <XCircle size={20} />}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">{t('data_integrity.auto.validation', { name: t(`data_integrity.overview.dimensions.${dim.name.toLowerCase()}`) })}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{dim.detail}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                dim.status === 'accept' ? 'bg-emerald-100 text-emerald-700' :
                dim.status === 'review' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {t(`data_integrity.status.${dim.status}`)}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
              <UserCheck size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded uppercase tracking-widest">{t('data_integrity.manual.fallback')}</span>
                <span className="text-xs font-bold text-zinc-900">{t('data_integrity.manual.task')}: REV-992</span>
              </div>
              <h3 className="font-bold text-amber-900 text-sm mb-2">{t('data_integrity.manual.issue')}</h3>
              <p className="text-xs text-amber-800 mb-4">{t('data_integrity.manual.desc')}</p>
              
              <div className="flex gap-2">
                <button className="bg-white border border-amber-200 text-amber-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-100 transition-all uppercase tracking-widest shadow-sm">
                  {t('data_integrity.manual.claim')}
                </button>
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-700 transition-all uppercase tracking-widest shadow-sm">
                  {t('data_integrity.manual.conditional')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LegalCenter = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'documents' | 'editor' | 'history'>('documents');

  const docs = [
    { id: 'DOC-1', type: 'Privacy Policy', version: 'v2.1', effectiveDate: '2026-04-01', status: 'Published' },
    { id: 'DOC-2', type: 'Terms of Service', version: 'v1.5', effectiveDate: '2025-11-15', status: 'Published' },
    { id: 'DOC-3', type: 'Cookie Policy', version: 'v3.0', effectiveDate: '2026-05-01', status: 'Draft' },
  ];

  const history = [
    { id: 'H-1', version: 'v2.1', date: '2026-04-01', summary: 'Updated data retention clauses for GDPR compliance.' },
    { id: 'H-2', version: 'v2.0', date: '2025-01-10', summary: 'Major rewrite for new product launch.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('legal.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('legal.subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
          <Plus size={16} /> {t('legal.new_doc')}
        </button>
      </div>

      <div className="flex gap-4 border-b border-zinc-200">
        <button onClick={() => setActiveTab('documents')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'documents' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('legal.tabs.documents')}
          {activeTab === 'documents' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('editor')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'editor' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('legal.tabs.editor')}
          {activeTab === 'editor' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('history')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'history' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('legal.tabs.history')}
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'documents' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="p-4">{t('legal.table.type')}</th>
                <th className="p-4">{t('legal.table.version')}</th>
                <th className="p-4">{t('legal.table.effective_date')}</th>
                <th className="p-4">{t('legal.table.status')}</th>
                <th className="p-4 text-right">{t('legal.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {docs.map(doc => (
                <tr key={doc.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4 font-bold text-zinc-900 flex items-center gap-2">
                    <FileText size={16} className="text-zinc-400" /> {doc.type}
                  </td>
                  <td className="p-4 font-mono text-xs text-zinc-600">{doc.version}</td>
                  <td className="p-4 text-xs text-zinc-600">{doc.effectiveDate}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                      doc.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>{doc.status}</span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => setActiveTab('editor')} className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit"><Edit3 size={16} /></button>
                    <button onClick={() => setActiveTab('history')} className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="History"><History size={16} /></button>
                    <button className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Preview"><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'editor' && (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col h-[500px]">
          <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <select className="bg-white border border-zinc-200 text-sm font-bold text-zinc-700 px-3 py-1.5 rounded-lg">
                <option>Privacy Policy</option>
                <option>Terms of Service</option>
                <option>Cookie Policy</option>
              </select>
              <span className="text-xs text-zinc-500 font-mono">{t('legal.editor.editing')} v2.2</span>
            </div>
            <div className="flex gap-2">
              <button className="bg-white border border-zinc-200 text-zinc-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-zinc-50 transition-all uppercase tracking-widest">
                {t('legal.editor.preview')}
              </button>
              <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all uppercase tracking-widest">
                {t('legal.editor.publish')}
              </button>
            </div>
          </div>
          <div className="flex-1 flex">
            <div className="w-1/2 border-r border-zinc-200 p-4">
              <textarea 
                className="w-full h-full resize-none outline-none font-mono text-sm text-zinc-700" 
                defaultValue="# Privacy Policy&#10;&#10;Last updated: April 1, 2026&#10;&#10;## 1. Information We Collect&#10;We collect information to provide better services to our users..."
              />
            </div>
            <div className="w-1/2 p-4 bg-zinc-50 overflow-y-auto">
              <div className="prose prose-sm prose-zinc">
                <h1>Privacy Policy</h1>
                <p className="text-zinc-500">Last updated: April 1, 2026</p>
                <h2>1. Information We Collect</h2>
                <p>We collect information to provide better services to our users...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-sm mb-6">Privacy Policy - {t('legal.history.title')}</h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
            {history.map((item, index) => (
              <div key={item.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-zinc-100 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <History size={16} />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-zinc-900 font-mono text-sm">{item.version}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.date}</div>
                  </div>
                  <div className="text-xs text-zinc-600">{item.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ConsentCenter = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('consent.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('consent.subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
          <Download size={16} /> {t('consent.export')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Cookie className="text-amber-600" size={20} />
            <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-sm">{t('consent.rules.title')}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <div>
                <div className="font-bold text-zinc-900 text-sm">{t('consent.rules.necessary')}</div>
                <div className="text-xs text-zinc-500">{t('consent.rules.necessary_desc')}</div>
              </div>
              <span className="text-[10px] font-bold bg-zinc-200 text-zinc-700 px-2 py-1 rounded uppercase tracking-widest">{t('consent.rules.always_on')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <div>
                <div className="font-bold text-zinc-900 text-sm">{t('consent.rules.analytics')}</div>
                <div className="text-xs text-zinc-500">{t('consent.rules.analytics_desc')}</div>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <div>
                <div className="font-bold text-zinc-900 text-sm">{t('consent.rules.marketing')}</div>
                <div className="text-xs text-zinc-500">{t('consent.rules.marketing_desc')}</div>
              </div>
              <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="text-blue-600" size={20} />
            <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-sm">{t('consent.regional.title')}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <div className="font-bold text-zinc-900 text-sm">{t('consent.regional.eu')}</div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase tracking-widest">{t('consent.regional.opt_in')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <div className="font-bold text-zinc-900 text-sm">{t('consent.regional.ca')}</div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded uppercase tracking-widest">{t('consent.regional.opt_out')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <div className="font-bold text-zinc-900 text-sm">{t('consent.regional.row')}</div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded uppercase tracking-widest">{t('consent.regional.implied')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Integrations = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const connections = [
    { id: 'INT-1', platform: 'X (Twitter)', status: 'connected', scope: 'tweet.read, tweet.write', lastUsed: '10 mins ago' },
    { id: 'INT-2', platform: 'Reddit', status: 'token_expiring', scope: 'read, submit', lastUsed: '1 hour ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('integrations.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('integrations.subtitle')}</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
          <Plus size={16} /> {t('integrations.new_connection')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connections.map(conn => (
          <div key={conn.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                  <Link2 size={20} className="text-zinc-600" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{conn.platform}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${conn.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{conn.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Refresh Token"><RefreshCw size={16} /></button>
                <button className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="Revoke"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-100 mb-4">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t('integrations.granted_scopes')}</div>
              <div className="text-xs font-mono text-zinc-700">{conn.scope}</div>
            </div>

            <div className="flex justify-between items-center text-xs text-zinc-500">
              <div className="flex items-center gap-1"><Key size={12} /> {t('integrations.encrypted')}</div>
              <div className="flex items-center gap-1"><Clock size={12} /> {t('integrations.last_used')}: {conn.lastUsed}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PublishQueue = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'queue' | 'blocked' | 'logs'>('queue');

  const queue = [
    { id: 'PUB-101', content: 'Just launched our new feature! Check it out...', platform: 'X (Twitter)', account: '@gengrowth', level: 'L1', risk: 'passed', schedule: 'Today, 14:00', status: 'pending_review' },
    { id: 'PUB-102', content: 'How to optimize your SEO in 2026. A thread 🧵', platform: 'X (Twitter)', account: '@gengrowth', level: 'L0', risk: 'passed', schedule: 'Today, 16:30', status: 'scheduled' },
    { id: 'PUB-103', content: 'Discussion: What are your thoughts on AI in marketing?', platform: 'Reddit', account: 'u/gengrowth_official', level: 'L2', risk: 'pending_review', schedule: 'Tomorrow, 09:00', status: 'pending_review' },
  ];

  const blocked = [
    { id: 'PUB-098', content: 'Get rich quick with this one weird trick...', platform: 'X (Twitter)', account: '@gengrowth', reason: 'Spam/Clickbait pattern detected', timestamp: 'Yesterday, 11:20' },
  ];

  const logs = [
    { id: 'PUB-097', content: 'New blog post is live!', platform: 'X (Twitter)', account: '@gengrowth', who: 'System (Auto)', when: 'Yesterday, 10:00', hash: 'a1b2c3d4e5', decision: 'auto', response: 'Success (ID: 123456789)' },
    { id: 'PUB-096', content: 'Join our webinar next week.', platform: 'Reddit', account: 'u/gengrowth_official', who: 'Sarah J. (PM)', when: 'Yesterday, 09:00', hash: 'f6g7h8i9j0', decision: 'approved', response: 'Success (ID: 987654321)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('publish_queue.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('publish_queue.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
            <Settings size={16} /> {t('publish_queue.settings')}
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-zinc-200">
        <button onClick={() => setActiveTab('queue')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'queue' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('publish_queue.tabs.queue')} <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">3</span>
          {activeTab === 'queue' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('blocked')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'blocked' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('publish_queue.tabs.blocked')} <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded-full">1</span>
          {activeTab === 'blocked' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('logs')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === 'logs' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          {t('publish_queue.tabs.logs')}
          {activeTab === 'logs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'queue' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="p-4">{t('publish_queue.table.content')}</th>
                <th className="p-4">{t('publish_queue.table.target')}</th>
                <th className="p-4">{t('publish_queue.table.level_risk')}</th>
                <th className="p-4">{t('publish_queue.table.schedule')}</th>
                <th className="p-4 text-right">{t('publish_queue.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {queue.map(item => (
                <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-zinc-900 line-clamp-2">{item.content}</div>
                    <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">{item.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-zinc-900">{item.platform}</div>
                    <div className="text-xs text-zinc-500">{item.account}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        item.level === 'L0' ? 'bg-emerald-100 text-emerald-700' :
                        item.level === 'L1' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>{item.level}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                      {item.risk === 'passed' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <AlertTriangle size={12} className="text-amber-500" />}
                      <span className={item.risk === 'passed' ? 'text-emerald-600' : 'text-amber-600'}>{item.risk.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-700">
                      <CalendarDays size={14} className="text-zinc-400" />
                      {item.schedule}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {item.status === 'pending_review' ? (
                      <div className="flex justify-end gap-2">
                        <button className="bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-50 transition-all shadow-sm">
                          {t('publish_queue.actions.reject')}
                        </button>
                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm">
                          {t('publish_queue.actions.approve')}
                        </button>
                      </div>
                    ) : (
                      <button className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Reschedule"><CalendarDays size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'blocked' && (
        <div className="grid grid-cols-1 gap-4">
          {blocked.map(blk => (
            <div key={blk.id} className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
                <Ban size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-zinc-900">{blk.id}</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{blk.timestamp}</span>
                </div>
                <p className="font-medium text-zinc-900 text-sm mb-2">"{blk.content}"</p>
                <div className="text-xs text-rose-700 font-bold bg-rose-100/50 inline-block px-2 py-1 rounded">{t('publish_queue.reason')}: {blk.reason}</div>
              </div>
              <button className="bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all uppercase tracking-widest shadow-sm">
                {t('publish_queue.actions.view_fix')}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="p-4">{t('publish_queue.table.content')}</th>
                <th className="p-4">{t('publish_queue.table.platform')}</th>
                <th className="p-4">{t('publish_queue.table.approval')}</th>
                <th className="p-4">{t('publish_queue.table.time_hash')}</th>
                <th className="p-4">{t('publish_queue.table.response')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-zinc-900 line-clamp-1" title={log.content}>{log.content}</div>
                    <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">{log.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-zinc-900">{log.platform}</div>
                    <div className="text-xs text-zinc-500">{log.account}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-zinc-900">{log.who}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${log.decision === 'auto' ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {log.decision}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-zinc-700">{log.when}</div>
                    <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{log.hash}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 inline-block px-2 py-1 rounded uppercase tracking-widest">
                      {log.response}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Website = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'pages' | 'navigation' | 'footer'>('pages');

  const pages = [
    { id: 'PG-1', title: 'Home', path: '/', type: 'Static', status: 'Published', lastUpdated: '2 days ago' },
    { id: 'PG-2', title: 'About Us', path: '/about', type: 'Static', status: 'Published', lastUpdated: '1 week ago' },
    { id: 'PG-3', title: '10 SEO Tips for 2026', path: '/blog/seo-tips', type: 'Blog', status: 'Draft', lastUpdated: '2 hours ago' },
  ];

  const navItems = [
    { id: 'NAV-1', label: 'Home', path: '/', visible: true },
    { id: 'NAV-2', label: 'Features', path: '/features', visible: true },
    { id: 'NAV-3', label: 'Pricing', path: '/pricing', visible: true },
    { id: 'NAV-4', label: 'Blog', path: '/blog', visible: true },
    { id: 'NAV-5', label: 'Secret Page', path: '/secret', visible: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('website.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('website.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm">
            <Eye size={16} /> {t('website.preview')}
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-zinc-200">
        <button onClick={() => setActiveTab('pages')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'pages' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          <FileText size={16} /> {t('website.tabs.pages')}
          {activeTab === 'pages' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('navigation')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'navigation' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          <MenuSquare size={16} /> {t('website.tabs.navigation')}
          {activeTab === 'navigation' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
        <button onClick={() => setActiveTab('footer')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors relative flex items-center gap-2 ${activeTab === 'footer' ? 'text-blue-600' : 'text-zinc-500 hover:text-zinc-700'}`}>
          <PanelBottom size={16} /> {t('website.tabs.footer')}
          {activeTab === 'footer' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'pages' && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="p-4">Page Title</th>
                <th className="p-4">Path</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {pages.map(page => (
                <tr key={page.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="p-4 font-bold text-zinc-900">{page.title}</td>
                  <td className="p-4 font-mono text-xs text-zinc-500">{page.path}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded uppercase tracking-widest">{page.type}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                      page.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>{page.status}</span>
                  </td>
                  <td className="p-4 text-right text-xs text-zinc-500">{page.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'navigation' && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm max-w-2xl">
          <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-sm mb-4">Header Navigation</h3>
          <div className="space-y-3">
            {navItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <div className="flex items-center gap-4">
                  <div className="text-zinc-400 cursor-grab hover:text-zinc-600">
                    <Menu size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 text-sm">{item.label}</div>
                    <div className="font-mono text-xs text-zinc-500">{item.path}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.visible ? 'bg-blue-600' : 'bg-zinc-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${item.visible ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                  <button className="text-zinc-400 hover:text-blue-600 transition-colors"><Edit3 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <Plus size={16} /> Add Link
          </button>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-sm mb-4">Legal Links</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-zinc-700">Privacy Policy</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-zinc-700">Terms of Service</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-zinc-700">Cookie Policy</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-zinc-900 uppercase tracking-widest text-sm mb-4">Contact & Social</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Contact Email</label>
                <input type="email" defaultValue="hello@gengrowth.com" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">X (Twitter) URL</label>
                <input type="url" defaultValue="https://x.com/gengrowth" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">LinkedIn URL</label>
                <input type="url" defaultValue="https://linkedin.com/company/gengrowth" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Discovery = ({ product, onTabChange }: { product: Product, onTabChange?: (tab: string) => void }) => {
  const { t } = useTranslation();
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [runs, setRuns] = useState<DiscoveryRun[]>([]);
  const [filterType, setFilterType] = useState('All Types');
  const [filterPriority, setFilterPriority] = useState('All Priorities');

  const fetchDiscoveryData = async () => {
    try {
      const [oppsRes, runsRes] = await Promise.all([
        fetch(`/api/products/${product.id}/discovery/opportunities`),
        fetch(`/api/products/${product.id}/discovery/runs`)
      ]);
      if (oppsRes.ok && runsRes.ok) {
        setOpportunities(await oppsRes.json());
        setRuns(await runsRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch discovery data:', error);
    }
  };

  useEffect(() => {
    fetchDiscoveryData();
  }, [product.id]);

  const handleRunDiscovery = async () => {
    setIsDiscovering(true);
    try {
      const res = await fetch(`/api/products/${product.id}/discovery/runs`, {
        method: 'POST'
      });
      if (res.ok) {
        // Poll for completion
        const poll = setInterval(async () => {
          const runsRes = await fetch(`/api/products/${product.id}/discovery/runs`);
          if (runsRes.ok) {
            const latestRuns = await runsRes.json();
            setRuns(latestRuns);
            if (latestRuns[0]?.status !== 'running') {
              clearInterval(poll);
              setIsDiscovering(false);
              fetchDiscoveryData();
              trackEvent('discovery_run_completed', { product_id: product.id, run_id: latestRuns[0]?.id });
            }
          }
        }, 2000);
      } else {
        setIsDiscovering(false);
      }
    } catch (error) {
      console.error('Failed to trigger discovery:', error);
      setIsDiscovering(false);
    }
  };

  const filteredOpps = opportunities.filter(opp => {
    const typeMatch = filterType === 'All Types' || opp.type === filterType;
    const priorityMatch = filterPriority === 'All Priorities' || opp.priority === filterPriority;
    return typeMatch && priorityMatch;
  });

  const stats = [
    { label: t('discovery.types.keyword'), count: opportunities.filter(o => o.type.includes('Keyword')).length, color: 'blue' },
    { label: t('discovery.types.competitor'), count: opportunities.filter(o => o.type.includes('Competitor')).length, color: 'purple' },
    { label: t('discovery.types.content'), count: opportunities.filter(o => o.type.includes('Content')).length, color: 'emerald' },
    { label: t('discovery.types.backlink'), count: opportunities.filter(o => o.type.includes('Backlink')).length, color: 'amber' }
  ];

  const handleExport = () => {
    const headers = ['Title', 'Type', 'Priority', 'Intent', 'Volume', 'CPC', 'Why'];
    const rows = filteredOpps.map(o => [o.title, o.type, o.priority, o.intent || '', o.volume || '', o.cpc || '', o.why || '']);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `discovery_opportunities_${product.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">{t('discovery.title')}</h2>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{t('discovery.subtitle', { product: product.name })}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-50 transition-all shadow-sm"
          >
            <Download size={16} /> {t('discovery.export_csv')}
          </button>
          <button 
            onClick={handleRunDiscovery}
            disabled={isDiscovering}
            className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-all shadow-sm disabled:opacity-50"
          >
            {isDiscovering ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
            {isDiscovering ? t('discovery.running_discovery') : t('discovery.run_discovery')}
          </button>
        </div>
      </div>

      {/* Opportunity Map Overview */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('discovery.map_overview')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-zinc-300 transition-all cursor-pointer">
              <div className={`absolute top-0 right-0 w-16 h-16 bg-${stat.color}-500 opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-zinc-900">{stat.count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">{t('discovery.list_title')}</h3>
          <div className="flex gap-2">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border border-zinc-200 text-xs font-bold text-zinc-600 rounded px-2 py-1 outline-none"
            >
              <option value="All Types">{t('discovery.types.all')}</option>
              <option value="Keyword Cluster">{t('discovery.types.keyword')}</option>
              <option value="Competitor Gap">{t('discovery.types.competitor')}</option>
              <option value="Content Gap">{t('discovery.types.content')}</option>
              <option value="Backlink Opportunity">{t('discovery.types.backlink')}</option>
            </select>
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-white border border-zinc-200 text-xs font-bold text-zinc-600 rounded px-2 py-1 outline-none"
            >
              <option value="All Priorities">{t('discovery.priorities.all')}</option>
              <option value="High">{t('discovery.priorities.high')}</option>
              <option value="Medium">{t('discovery.priorities.medium')}</option>
              <option value="Low">{t('discovery.priorities.low')}</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-zinc-100">
          {filteredOpps.length === 0 ? (
            <div className="p-12 text-center">
              <Search size={48} className="mx-auto text-zinc-200 mb-4" />
              <p className="text-sm text-zinc-500 font-medium">No opportunities found. Try running a discovery.</p>
            </div>
          ) : (
            filteredOpps.map((opp) => (
              <div key={opp.id} className="hover:bg-zinc-50 transition-all">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer group"
                  onClick={() => setExpandedId(expandedId === opp.id ? null : opp.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      opp.type.includes('Keyword') ? 'bg-blue-50 text-blue-600' : 
                      opp.type.includes('Competitor') ? 'bg-purple-50 text-purple-600' : 
                      opp.type.includes('Content') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {opp.type.includes('Keyword') ? <Search size={20} /> : 
                       opp.type.includes('Competitor') ? <Globe size={20} /> : 
                       opp.type.includes('Content') ? <BookOpen size={20} /> : <LinkIcon size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 px-1.5 py-0.5 rounded">
                          {opp.type === 'Keyword Cluster' ? t('discovery.types.keyword') :
                           opp.type === 'Competitor Gap' ? t('discovery.types.competitor') :
                           opp.type === 'Content Gap' ? t('discovery.types.content') : t('discovery.types.backlink')}
                        </span>
                        {opp.intent && (
                          <>
                            <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                              {t(`discovery.intents.${opp.intent.toLowerCase()}`)}
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className="font-bold text-zinc-900 mt-1 text-sm">{t(opp.title) || opp.title}</h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden md:block">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('discovery.fields.volume')}</div>
                      <div className="text-xs font-bold text-zinc-700">{opp.volume}</div>
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('discovery.fields.cpc')}</div>
                      <div className="text-xs font-bold text-emerald-600">{opp.cpc}</div>
                    </div>
                    <div className="text-right w-20">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('discovery.fields.priority')}</div>
                      <div className={`text-xs font-bold ${
                        opp.priority === 'High' ? 'text-rose-600' : 
                        opp.priority === 'Medium' ? 'text-amber-600' : 'text-blue-600'
                      }`}>{t(`discovery.priorities.${opp.priority.toLowerCase()}`)}</div>
                    </div>
                    <button className={`p-2 rounded-lg text-zinc-400 transition-transform ${expandedId === opp.id ? 'rotate-90 bg-zinc-200' : 'hover:bg-zinc-200'}`}>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {expandedId === opp.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-zinc-50 border-t border-zinc-100"
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <HelpCircle size={12} /> {t('discovery.fields.why')}
                          </h5>
                          <p className="text-sm text-zinc-700 leading-relaxed">{t(opp.why)}</p>
                          
                          <button 
                            onClick={() => onTabChange?.('strategy')}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
                          >
                            {t('discovery.actions.create_strategy')}
                          </button>
                        </div>
                        
                        <div>
                          <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                            <Database size={12} /> {t('discovery.fields.evidence')}
                          </h5>
                          <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                            {opp.evidence.map((ev, idx) => (
                              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-zinc-300 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-zinc-200 bg-white shadow-sm">
                                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">
                                    {t(`discovery.evidence_steps.${ev.step.toLowerCase().replace(/\s+/g, '_')}`) || ev.step}
                                  </div>
                                  <div className="text-xs text-zinc-600">{t(ev.detail)}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Discovery History */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">{t('discovery.history_title')}</h3>
        <div className="space-y-3">
          {runs.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No discovery runs yet.</p>
          ) : (
            runs.map((run) => (
              <div key={run.id} className="flex items-center justify-between p-3 border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-zinc-400" />
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      {new Date(run.created_at).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
                      {t('discovery.history.trigger')}: {run.trigger_type === 'manual' ? t('discovery.history.manual') : t('discovery.history.scheduled')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {run.error_message && <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded">{run.error_message}</span>}
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('discovery.history.opps_found')}</div>
                    <div className="text-xs font-bold text-zinc-700">{run.found_count}</div>
                  </div>
                  <StatusBadge status={run.status as StatusType} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Products = ({ products, onAddProduct, fetchData, onTabChange }: { products: Product[], onAddProduct: () => void, fetchData: () => void, onTabChange?: (tab: string) => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locale } = useParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const handleDelete = async () => {
    if (!productToDelete) return;
    await fetch(`/api/products/${productToDelete}`, { method: 'DELETE' });
    fetchData();
    trackEvent('product_deleted', { product_id: productToDelete });
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleCopy = async (id: string) => {
    const res = await fetch(`/api/products/${id}/copy`, { method: 'POST' });
    if (res.ok) {
      fetchData();
      trackEvent('product_cloned', { product_id: id });
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: t('products.columns.product_name') || 'Product Name',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-bold text-zinc-900">{info.getValue() as string}</span>
          <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[150px]">
            {info.row.original.url}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: t('products.columns.status') || 'Status',
      cell: (info) => <StatusBadge status={info.getValue() as StatusType} />,
    },
    {
      accessorKey: 'connection_count',
      header: t('products.columns.connections') || 'Connections',
      cell: (info) => (
        <div className="flex items-center gap-1.5">
          <LinkIcon size={12} className="text-zinc-400" />
          <span className="text-xs font-bold text-zinc-600">{info.getValue() as number}</span>
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: t('products.columns.created') || 'Created',
      cell: (info) => <span className="text-xs text-zinc-500">{new Date(info.getValue() as string).toLocaleDateString()}</span>,
    },
    {
      id: 'actions',
      header: t('products.columns.actions') || 'Actions',
      cell: (info) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setSelectedProduct(info.row.original)}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-blue-600 transition-colors"
            title={t('products.actions.view_details') || "View Details"}
          >
            <ExternalLink size={16} />
          </button>
          <button 
            onClick={() => handleCopy(info.row.original.id)}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-emerald-600 transition-colors"
            title={t('products.actions.copy_template') || "Copy Template"}
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={() => {
              setProductToDelete(info.row.original.id);
              setIsDeleteDialogOpen(true);
            }}
            className="p-1.5 hover:bg-rose-50 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors"
            title={t('products.actions.delete_product') || "Delete Product"}
          >
            <X size={16} />
          </button>
        </div>
      ),
    }
  ];

  if (selectedProduct) {
    return <ProductDetails product={selectedProduct} onBack={() => setSelectedProduct(null)} fetchData={fetchData} onTabChange={onTabChange} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight uppercase tracking-widest">{t('products.title')}</h1>
          <p className="text-zinc-500 text-xs font-medium mt-1">{t('products.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-zinc-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('table')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'table' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Menu size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Layers size={16} />
            </button>
          </div>
          <button 
            onClick={onAddProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
          >
            <Plus size={18} />
            <span>{t('common.new_product')}</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <DataTable 
            columns={columns} 
            data={products} 
            searchPlaceholder={t('products.search_placeholder') || 'Search products by name or URL...'} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-blue-200 transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                  {product.name[0]}
                </div>
                <StatusBadge status={product.status as StatusType} />
              </div>
              <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
              <p className="text-xs text-zinc-500 mt-1 truncate">{product.url}</p>
              
              <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <LinkIcon size={12} className="text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-600">{product.connection_count} {t('products.connections') || 'Connections'}</span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button 
                    onClick={() => handleCopy(product.id)}
                    className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-emerald-600 transition-colors"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={onAddProduct}
            className="border-2 border-dashed border-zinc-200 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-400 hover:border-blue-400 hover:text-blue-600 transition-all group"
          >
            <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-50">
              <Plus size={24} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">{t('products.actions.add_product') || 'Add Product'}</span>
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={t('products.delete_dialog.title') || "Delete Product"}
        description={t('products.delete_dialog.description') || "Are you sure you want to delete this product? This action will archive the product and stop all active strategies. This cannot be undone."}
        confirmLabel={t('products.delete_dialog.confirm') || "Delete Product"}
        cancelLabel={t('common.cancel') || "Cancel"}
        variant="danger"
      />
    </div>
  );
};

const ProductDetails = ({ product, onBack, fetchData, onTabChange }: { product: Product, onBack: () => void, fetchData: () => void, onTabChange?: (tab: string) => void }) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleClone = async () => {
    const res = await fetch(`/api/products/${product.id}/copy`, { method: 'POST' });
    if (res.ok) {
      fetchData();
      trackEvent('product_cloned', { source_product_id: product.id });
      onBack();
    }
  };

  const handleConnect = (service: string) => {
    trackEvent('connection_initiated', { service, product_id: product.id });
    if (onTabChange) {
      onTabChange('connections');
    }
  };

  const probeSteps = [
    { id: '1', type: 'source' as const, label: t('products.details.probe_steps.sitemap_label') || 'Sitemap Discovery', value: product.probe_result?.sitemap_found ? (t('products.details.probe_steps.sitemap_found') || 'Found') : (t('products.details.probe_steps.sitemap_not_found') || 'Not Found'), description: t('products.details.probe_steps.sitemap_desc') || 'Checking for /sitemap.xml and robots.txt references.' },
    { id: '2', type: 'calculation' as const, label: t('products.details.probe_steps.page_type_label') || 'Page Type Identification', value: product.probe_result?.page_types.length || 0, description: t('products.details.probe_steps.page_type_desc') || 'Analyzing DOM structure to identify product, category, and blog pages.' },
    { id: '3', type: 'link' as const, label: t('products.details.probe_steps.language_label') || 'Language Detection', value: product.probe_result?.detected_language || (t('products.details.probe_steps.language_unknown') || 'Unknown'), description: t('products.details.probe_steps.language_desc') || 'Detected primary content language via meta tags and NLP.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-zinc-900">{product.name}</h1>
            <StatusBadge status={product.status as StatusType} />
          </div>
          <p className="text-xs text-zinc-500 font-medium mt-1">{product.url}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button 
            onClick={handleClone}
            className="px-4 py-2 text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-all uppercase tracking-widest flex items-center gap-2"
          >
            <Copy size={14} />
            {t('products.clone_template') || 'Clone Template'}
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all uppercase tracking-widest shadow-lg shadow-blue-100"
          >
            {t('products.edit_config') || 'Edit Config'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Input Profile */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4">{t('products.input_profile') || 'Input Profile'}</h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">{t('products.target_regions') || 'Target Regions'}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.input_profile?.target_regions.map(r => (
                    <span key={r} className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold uppercase">{r}</span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">{t('products.experiment_goal') || 'Experiment Goal'}</label>
                <p className="text-sm font-bold text-zinc-800 mt-1 capitalize">{product.input_profile?.experiment_goal.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">{t('products.conversion_event') || 'Conversion Event'}</label>
                <p className="text-sm font-bold text-zinc-800 mt-1 capitalize">{product.input_profile?.primary_conversion_event.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">{t('products.language_override') || 'Language Override'}</label>
                <p className="text-sm font-bold text-zinc-800 mt-1">{product.input_profile?.language_override || t('products.auto_detect')}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">{t('products.production_cap') || 'Production Cap'}</label>
                <p className="text-sm font-bold text-zinc-800 mt-1">{product.input_profile?.production_cap_override || t('products.auto')} {t('products.pages_week')}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">{t('products.brand_safety') || 'Brand Safety'}</label>
                <p className="text-sm font-bold text-zinc-800 mt-1 truncate max-w-[200px]">{product.input_profile?.brand_safety_policy || t('products.default_policy')}</p>
              </div>
            </div>
          </div>

          {/* Probe Results */}
          <EvidenceChain 
            title={t('products.site_probe_results') || "Site Auto-Probe Results"} 
            steps={probeSteps} 
          />
        </div>

        <div className="space-y-6">
          {/* Connection Status */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">{t('products.connection_status') || 'Connection Status'}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">Google Search Console</span>
                </div>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 rounded-lg opacity-60">
                <div className="flex items-center gap-3">
                  <BarChart3 size={16} className="text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-600">Google Analytics 4</span>
                </div>
                <Plus 
                  size={16} 
                  className="text-zinc-400 cursor-pointer hover:text-blue-600 transition-colors" 
                  onClick={() => handleConnect('ga4')}
                />
              </div>
            </div>
          </div>

          {/* Probe Summary */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">{t('products.probe_summary') || 'Probe Summary'}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-500">{t('products.completion_rate') || 'Completion Rate'}</span>
                <span className="text-xs font-bold text-zinc-900">{product.probe_result?.completion_rate || 0}%</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${product.probe_result?.completion_rate || 0}%` }}
                />
              </div>
              <div className="pt-4 border-t border-zinc-100">
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  {t('products.probe_desc', { count: product.probe_result?.page_types.length || 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProductModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
        onSuccess={fetchData}
      />
    </div>
  );
};

const EditProductModal = ({ isOpen, onClose, product, onSuccess }: { isOpen: boolean, onClose: () => void, product: Product, onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    language_override: product.input_profile?.language_override || '',
    brand_safety_policy: product.input_profile?.brand_safety_policy || '',
    production_cap_override: product.input_profile?.production_cap_override || 10
  });

  useEffect(() => {
    if (product) {
      setFormData({
        language_override: product.input_profile?.language_override || '',
        brand_safety_policy: product.input_profile?.brand_safety_policy || '',
        production_cap_override: product.input_profile?.production_cap_override || 10
      });
    }
  }, [product]);

  const handleSubmit = async () => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input_profile: {
          ...product.input_profile,
          ...formData
        }
      })
    });
    if (res.ok) {
      trackEvent('product_config_updated', { product_id: product.id });
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-zinc-200 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{t('products.edit_config')}</h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">{product.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{t('products.modal.language')}</label>
              <select 
                value={formData.language_override}
                onChange={e => setFormData({...formData, language_override: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">{t('products.modal.auto_detect_en')}</option>
                <option value="en">{t('products.modal.english')}</option>
                <option value="zh">{t('products.modal.chinese')}</option>
                <option value="es">{t('products.modal.spanish')}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{t('products.modal.production_cap')}</label>
              <input 
                type="number" 
                value={formData.production_cap_override}
                onChange={e => setFormData({...formData, production_cap_override: parseInt(e.target.value)})}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{t('products.modal.brand_safety_policy')}</label>
              <textarea 
                value={formData.brand_safety_policy}
                onChange={e => setFormData({...formData, brand_safety_policy: e.target.value})}
                placeholder={t('products.modal.brand_safety_placeholder')}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 h-32 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-8 border-t border-zinc-100">
            <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest">
              {t('common.cancel')}
            </button>
            <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 active:scale-[0.98] uppercase tracking-widest">
              {t('common.continue')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CreateProductModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isProbing, setIsProbing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    target_regions: [] as string[],
    experiment_goal: '',
    primary_conversion_event: '',
    language_override: '',
    brand_safety_policy: '',
    production_cap_override: 10
  });

  const regions = ["US", "UK", "CA", "AU", "DE", "FR", "JP", "CN", "IN", "BR"];
  const goals = ["organic_signup_growth", "revenue_growth", "user_retention", "brand_awareness"];
  const events = ["signup_completed", "purchase_completed", "trial_started", "page_view_depth"];

  const handleStartProbe = () => {
    // Simulate URL error
    if (formData.url.toLowerCase().includes('error')) {
      trackEvent('site_probe_failed', { url: formData.url, reason: 'URL inaccessible' });
      alert('URL inaccessible. Please check the URL and try again.');
      return;
    }

    setIsProbing(true);
    setStep(5);
    trackEvent('site_probe_started', { url: formData.url });
    setTimeout(() => {
      setIsProbing(false);
      setStep(6);
      trackEvent('site_probe_completed', { url: formData.url });
    }, 4000);
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      const data = await res.json();
      trackEvent('product_created', { product_id: data.id, name: formData.name });
      onSuccess();
      onClose();
      setStep(1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-zinc-200 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                {step === 5 ? t('products.modal.title_step_5') : step === 6 ? t('products.modal.title_step_6') : t('products.modal.title_step_1_4')}
              </h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                {step === 5 ? t('products.modal.subtitle_step_5') : step === 6 ? t('products.modal.subtitle_step_6') : t('products.modal.subtitle_step_1_4', { step })}
              </p>
            </div>
            {step < 5 && (
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${i <= step ? 'bg-blue-600' : 'bg-zinc-100'}`} />
                ))}
              </div>
            )}
          </div>

          <div className="min-h-[320px]">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t('products.modal.name_label')}</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder={t('products.modal.name_placeholder')}
                    className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-0 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t('products.modal.url_label')}</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      type="url" 
                      value={formData.url}
                      onChange={e => setFormData({...formData, url: e.target.value})}
                      placeholder={t('products.modal.url_placeholder')}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-blue-500 focus:ring-0 rounded-xl pl-12 pr-4 py-3 text-sm outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t('products.modal.regions_label')}</label>
                <div className="grid grid-cols-5 gap-2">
                  {regions.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        const next = formData.target_regions.includes(r)
                          ? formData.target_regions.filter(x => x !== r)
                          : [...formData.target_regions, r];
                        setFormData({...formData, target_regions: next});
                      }}
                      className={cn(
                        "py-2 rounded-lg text-xs font-bold border transition-all",
                        formData.target_regions.includes(r)
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-zinc-50 border-zinc-100 text-zinc-400 hover:border-zinc-300"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t('products.modal.goal_label')}</label>
                {goals.map(g => (
                  <button
                    key={g}
                    onClick={() => setFormData({...formData, experiment_goal: g})}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                      formData.experiment_goal === g
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-zinc-50 border-zinc-100 text-zinc-600 hover:border-zinc-300"
                    )}
                  >
                    <span className="text-xs font-bold capitalize">{g.replace(/_/g, ' ')}</span>
                    {formData.experiment_goal === g && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">{t('products.modal.event_label')}</label>
                {events.map(e => (
                  <button
                    key={e}
                    onClick={() => setFormData({...formData, primary_conversion_event: e})}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                      formData.primary_conversion_event === e
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-zinc-50 border-zinc-100 text-zinc-600 hover:border-zinc-300"
                    )}
                  >
                    <span className="text-xs font-bold capitalize">{e.replace(/_/g, ' ')}</span>
                    {formData.primary_conversion_event === e && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Zap size={32} className="animate-pulse" />
                  </div>
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">{t('products.modal.probing_title')}</h3>
                <p className="text-xs text-zinc-500 mt-2 max-w-xs leading-relaxed">
                  {t('products.modal.probing_desc')}
                </p>
                <div className="mt-8 w-full max-w-xs space-y-4">
                   <div className="flex items-center gap-3 text-left">
                     <CheckCircle2 size={14} className="text-emerald-500" />
                     <span className="text-[11px] font-medium text-zinc-600">{t('products.modal.reading_robots')}</span>
                   </div>
                   <div className="flex items-center gap-3 text-left">
                     <CheckCircle2 size={14} className="text-emerald-500" />
                     <span className="text-[11px] font-medium text-zinc-600">{t('products.modal.sitemap_found')}</span>
                   </div>
                   <div className="flex items-center gap-3 text-left">
                     <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                     <span className="text-[11px] font-medium text-zinc-900">{t('products.modal.identifying_pages')}</span>
                   </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <h3 className="text-sm font-bold text-emerald-900">{t('products.modal.probe_success')}</h3>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    {t('products.modal.probe_success_desc')}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('products.modal.optional_overrides')}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{t('products.modal.language')}</label>
                      <select 
                        value={formData.language_override}
                        onChange={e => setFormData({...formData, language_override: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                      >
                        <option value="">{t('products.modal.auto_detect_en')}</option>
                        <option value="en">{t('products.modal.english')}</option>
                        <option value="zh">{t('products.modal.chinese')}</option>
                        <option value="es">{t('products.modal.spanish')}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{t('products.modal.production_cap')}</label>
                      <input 
                        type="number" 
                        value={formData.production_cap_override}
                        onChange={e => setFormData({...formData, production_cap_override: parseInt(e.target.value)})}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">{t('products.modal.brand_safety_policy')}</label>
                    <textarea 
                      value={formData.brand_safety_policy}
                      onChange={e => setFormData({...formData, brand_safety_policy: e.target.value})}
                      placeholder={t('products.modal.brand_safety_placeholder')}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 h-20 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {step !== 5 && (
            <div className="flex justify-end gap-3 mt-8 pt-8 border-t border-zinc-100">
              <button 
                onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
                className="px-6 py-2.5 text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest"
              >
                {step === 1 ? t('products.modal.cancel') : t('products.modal.back')}
              </button>
              <button 
                disabled={
                  (step === 1 && (!formData.name || !formData.url)) ||
                  (step === 2 && formData.target_regions.length === 0) ||
                  (step === 3 && !formData.experiment_goal) ||
                  (step === 4 && !formData.primary_conversion_event)
                }
                onClick={step === 4 ? handleStartProbe : step === 6 ? handleSubmit : () => setStep(s => s + 1)}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 active:scale-[0.98] uppercase tracking-widest"
              >
                {step === 4 ? t('products.modal.start_probe') : step === 6 ? t('products.modal.confirm_connect') : t('products.modal.continue')}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- App Shell ---

const AppContent = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { locale, tab } = useParams();
  const location = useLocation();

  const activeTab = tab || 'dashboard';
  const [products, setProducts] = useState<Product[]>([]);
  const [strategies, setStrategies] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    activeProducts: 0,
    pendingStrategies: 0,
    completedExecutions: 0,
    totalOpportunities: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPropertyMenuOpen, setIsPropertyMenuOpen] = useState(false);

  // Sync i18n with URL locale
  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  const fetchData = async () => {
    const [pRes, sRes, stRes, dRes, aRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/dashboard/stats'),
      fetch('/api/strategies'),
      fetch('/api/decisions'),
      fetch('/api/alerts')
    ]);
    if (pRes.ok) setProducts(await pRes.json());
    if (sRes.ok) setStats(await sRes.json());
    if (stRes.ok) setStrategies(await stRes.json());
    if (dRes.ok) setDecisions(await dRes.json());
    if (aRes.ok) setAlerts(await aRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (id: string) => {
    navigate(`/${i18n.language}/${id}`);
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'zh' : 'en';
    navigate(`/${nextLang}/${activeTab}`);
  };

  const selectedProduct = products[0] || { name: 'Select Property', url: 'No property selected' };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 flex flex-col fixed h-full bg-white z-20">
        {/* Property Selector */}
        <div className="p-3 border-b border-zinc-200">
          <button 
            onClick={() => setIsPropertyMenuOpen(!isPropertyMenuOpen)}
            className="w-full flex items-center justify-between p-2 hover:bg-zinc-100 rounded-lg transition-all text-left group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold shrink-0">
                {selectedProduct.name[0]}
              </div>
              <div className="overflow-hidden">
                <div className="text-[13px] font-medium text-zinc-900 truncate">{selectedProduct.name}</div>
                <div className="text-[11px] text-zinc-500 truncate">{selectedProduct.url}</div>
              </div>
            </div>
            <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isPropertyMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar pt-2 pr-2">
          <SidebarSection title={t('common.groups.overview')}>
            <SidebarItem 
              icon={LayoutDashboard} 
              label={t('common.dashboard')} 
              active={activeTab === 'dashboard'}
              onClick={() => handleTabChange('dashboard')}
            />
          </SidebarSection>
          
          <SidebarSection title={t('common.groups.product')}>
            <SidebarItem icon={Package} label={t('common.products')} active={activeTab === 'products'} onClick={() => handleTabChange('products')} />
            <SidebarItem icon={Database} label={t('common.connections')} active={activeTab === 'connections'} onClick={() => handleTabChange('connections')} />
          </SidebarSection>

          <SidebarSection title={t('common.groups.growth_engine')}>
            <SidebarItem icon={Search} label={t('common.discovery')} active={activeTab === 'discovery'} onClick={() => handleTabChange('discovery')} />
            <SidebarItem icon={Brain} label={t('common.strategy')} active={activeTab === 'strategy'} onClick={() => handleTabChange('strategy')} />
            <SidebarItem icon={ListTodo} label={t('common.backlog')} active={activeTab === 'backlog'} onClick={() => handleTabChange('backlog')} />
            <SidebarItem icon={PlayCircle} label={t('common.execution')} active={activeTab === 'execution'} onClick={() => handleTabChange('execution')} />
          </SidebarSection>

          <SidebarSection title={t('common.groups.measurement')}>
            <SidebarItem icon={BarChart3} label={t('common.measurement')} active={activeTab === 'measurement'} onClick={() => handleTabChange('measurement')} />
            <SidebarItem icon={Zap} label={t('common.optimization')} active={activeTab === 'optimization'} onClick={() => handleTabChange('optimization')} />
          </SidebarSection>

          <SidebarSection title={t('common.groups.governance')}>
            <SidebarItem icon={ShieldCheck} label={t('common.governance')} active={activeTab === 'governance'} onClick={() => handleTabChange('governance')} />
            <SidebarItem icon={BookOpen} label={t('common.playbook')} active={activeTab === 'playbook'} onClick={() => handleTabChange('playbook')} />
          </SidebarSection>

          <SidebarSection title={t('common.groups.channels')}>
            <SidebarItem icon={LinkIcon} label={t('common.outreach')} active={activeTab === 'outreach'} onClick={() => handleTabChange('outreach')} />
            <SidebarItem icon={Share2} label={t('common.integrations')} active={activeTab === 'integrations'} onClick={() => handleTabChange('integrations')} />
            <SidebarItem icon={Layers} label={t('common.publish_queue')} active={activeTab === 'publish-queue'} onClick={() => handleTabChange('publish-queue')} />
            <SidebarItem icon={Globe2} label="Website" active={activeTab === 'website'} onClick={() => handleTabChange('website')} />
          </SidebarSection>

          <SidebarSection title={t('common.groups.compliance')}>
            <SidebarItem icon={Shield} label={t('common.compliance')} active={activeTab === 'compliance'} onClick={() => handleTabChange('compliance')} />
            <SidebarItem icon={FileCheck} label={t('common.data_integrity')} active={activeTab === 'data-integrity'} onClick={() => handleTabChange('data-integrity')} />
          </SidebarSection>

          <SidebarSection title={t('common.groups.legal')}>
            <SidebarItem icon={Gavel} label={t('common.legal_center')} active={activeTab === 'legal-center'} onClick={() => handleTabChange('legal-center')} />
            <SidebarItem icon={UserCheck} label={t('common.consent_center')} active={activeTab === 'consent-center'} onClick={() => handleTabChange('consent-center')} />
          </SidebarSection>

          <div className="mt-4 border-t border-zinc-100 pt-2">
            <SidebarItem icon={Settings} label={t('common.settings')} active={activeTab === 'settings'} onClick={() => handleTabChange('settings')} />
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-200 bg-zinc-50/50">
          <button 
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-200 transition-all mb-2"
          >
            <Languages size={18} />
            <span className="text-xs font-medium">{i18n.language === 'en' ? '中文' : 'English'}</span>
          </button>
          <div className="flex items-center gap-3 px-3 py-1">
            <div className="w-8 h-8 rounded-full bg-zinc-300 flex items-center justify-center text-xs font-bold text-zinc-600">JD</div>
            <div className="overflow-hidden">
              <div className="text-xs font-medium text-zinc-900 truncate">John Doe</div>
              <div className="text-[10px] text-zinc-500">Owner</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Top Bar & Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen bg-white">
        {/* Top Bar */}
        <header className="h-14 border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 lg:hidden"><Menu size={20} /></button>
            <div className="relative flex-1 group">
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search properties or help..."
                className="w-full bg-zinc-100 border-transparent focus:bg-white focus:border-zinc-300 focus:ring-0 rounded-lg pl-10 pr-4 py-1.5 text-sm outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500"><HelpCircle size={20} /></button>
            <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500 relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-500"><Settings size={20} /></button>
            <div className="w-8 h-8 rounded-full bg-zinc-200 ml-2 cursor-pointer hover:ring-4 hover:ring-zinc-100 transition-all" />
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 max-w-6xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'dashboard' && <Dashboard stats={stats} strategies={strategies} decisions={decisions} alerts={alerts} onRefresh={fetchData} />}
              {activeTab === 'products' && <Products products={products} onAddProduct={() => setIsModalOpen(true)} fetchData={fetchData} onTabChange={handleTabChange} />}
              {activeTab === 'connections' && <Connections product={selectedProduct as Product} />}
              {activeTab === 'discovery' && <Discovery product={selectedProduct as Product} onTabChange={handleTabChange} />}
              {activeTab === 'strategy' && <Strategy product={selectedProduct as Product} onTabChange={handleTabChange} />}
              {activeTab === 'backlog' && <Backlog product={selectedProduct as Product} />}
              {activeTab === 'execution' && <Execution product={selectedProduct as Product} />}
              {activeTab === 'measurement' && <Measurement product={selectedProduct as Product} />}
              {activeTab === 'optimization' && <Optimization product={selectedProduct as Product} />}
              {activeTab === 'governance' && <Governance product={selectedProduct as Product} />}
              {activeTab === 'playbook' && <Playbook product={selectedProduct as Product} />}
              {activeTab === 'outreach' && <LinkOutreach product={selectedProduct as Product} />}
              {activeTab === 'compliance' && <Compliance product={selectedProduct as Product} />}
              {activeTab === 'data-integrity' && <DataIntegrity product={selectedProduct as Product} />}
              {activeTab === 'legal-center' && <LegalCenter product={selectedProduct as Product} />}
              {activeTab === 'consent-center' && <ConsentCenter product={selectedProduct as Product} />}
              {activeTab === 'integrations' && <Integrations product={selectedProduct as Product} />}
              {activeTab === 'publish-queue' && <PublishQueue product={selectedProduct as Product} />}
              {activeTab === 'website' && <Website product={selectedProduct as Product} />}
              
              {!['dashboard', 'products', 'connections', 'discovery', 'strategy', 'backlog', 'execution', 'measurement', 'optimization', 'governance', 'playbook', 'link-outreach', 'outreach', 'compliance', 'data-integrity', 'legal-center', 'consent-center', 'integrations', 'publish-queue', 'website', 'settings'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-40 text-zinc-400">
                  <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                    <Settings size={40} className="opacity-20 animate-spin-slow" />
                  </div>
                  <h2 className="text-lg font-medium text-zinc-800">{t('common.under_construction')}</h2>
                  <p className="text-sm mt-1">{t('common.coming_soon', { tab: activeTab })}</p>
                  <button 
                    onClick={() => handleTabChange('dashboard')}
                    className="mt-6 text-blue-600 text-sm font-medium hover:underline"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CreateProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
      />

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/:locale/:tab" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
          <Route path="/:locale" element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/en/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
