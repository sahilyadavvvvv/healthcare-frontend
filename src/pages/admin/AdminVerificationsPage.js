import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiEye, 
  FiArrowLeft, 
  FiFileText, 
  FiCalendar, 
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiClock
} from 'react-icons/fi';

const AdminVerificationsPage = () => {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [rejectModalId, setRejectModalId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchVerifications = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getVerifications({ page, size: 10 });
            const data = response.data.data;
            setVerifications(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
        } catch (error) {
            toast.error('Failed to load verification requests');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchVerifications();
    }, [fetchVerifications]);

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this verification request?')) return;
        setActionLoading(id);
        try {
            await adminAPI.approveVerification(id);
            toast.success('Verification approved');
            fetchVerifications();
        } catch (error) {
            toast.error('Failed to approve verification');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        setActionLoading(rejectModalId);
        try {
            await adminAPI.rejectVerification(rejectModalId, rejectReason);
            toast.success('Verification rejected');
            setRejectModalId(null);
            setRejectReason('');
            fetchVerifications();
        } catch (error) {
            toast.error('Failed to reject verification');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-ethereal-surface py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <Link to="/admin" className="p-2 rounded-xl bg-white/50 text-ethereal-on-surface-variant hover:text-ethereal-primary transition-all duration-300">
                                <FiArrowLeft className="w-5 h-5" />
                            </Link>
                            <span className="section-label tracking-[0.2em]">Compliance Protocol</span>
                        </div>
                        <h1 className="text-4xl display-title uppercase tracking-tighter">Verification Queue</h1>
                        <p className="text-ethereal-on-surface-variant font-medium mt-1">
                            Processing <span className="text-ethereal-primary font-bold">{totalElements}</span> pending KYC validations
                        </p>
                    </div>
                    <div className="glass-card px-8 py-4 rounded-[1.5rem] border-none flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ethereal-on-surface-variant opacity-40">Backlog Volume</span>
                        <span className="text-3xl font-black text-orange-500 tracking-tighter">{totalElements}</span>
                    </div>
                </div>

                {/* Queue Matrix */}
                <div className="glass-card rounded-[2.5rem] border-none overflow-hidden animate-fadeIn">
                    {loading ? (
                        <div className="p-32 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ethereal-primary mx-auto"></div>
                            <p className="text-ethereal-on-surface-variant font-black uppercase tracking-[0.3em] mt-8 text-[10px]">Scanning Documentation...</p>
                        </div>
                    ) : verifications.length === 0 ? (
                        <div className="p-32 text-center">
                            <div className="w-24 h-24 bg-ethereal-surface-low rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <FiCheckCircle className="w-10 h-10 text-emerald-400 opacity-40" />
                            </div>
                            <h3 className="text-2xl font-bold text-ethereal-on-surface uppercase tracking-tight">Queue Depleted</h3>
                            <p className="text-ethereal-on-surface-variant font-medium mt-2">All administrative obligations have been fulfilled.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-ethereal-surface-low border-b border-ethereal-surface">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-ethereal-on-surface-variant">Entity Descriptor</th>
                                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-ethereal-on-surface-variant">Credential Type</th>
                                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-ethereal-on-surface-variant">Process State</th>
                                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-ethereal-on-surface-variant">Timestamp</th>
                                        <th className="px-6 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-ethereal-on-surface-variant">Protocol Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-ethereal-surface">
                                    {verifications.map((req, idx) => (
                                        <tr key={req.id} className="hover:bg-ethereal-surface-low/50 group transition-all duration-300 animate-fadeIn" style={{ animationDelay: `${idx * 0.05}s` }}>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-ethereal-primary/10 text-ethereal-primary rounded-[1rem] flex items-center justify-center font-black text-lg shadow-sm border border-ethereal-primary/5">
                                                        <FiUser className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-ethereal-on-surface tracking-tight leading-tight">{req.user?.fullName}</p>
                                                        <p className="text-[11px] font-medium text-ethereal-on-surface-variant opacity-50 lowercase tracking-wide">{req.user?.email}</p>
                                                        <p className="text-[10px] text-ethereal-primary font-bold mt-1 tracking-tighter opacity-80">{req.user?.mobileNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 bg-white border border-ethereal-surface text-ethereal-on-surface-variant rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                        {req.docType}
                                                    </span>
                                                    <a href={req.docUrl} target="_blank" rel="noopener noreferrer" 
                                                       className="p-3 bg-white text-ethereal-primary hover:text-ethereal-on-surface hover:shadow-xl hover:-translate-y-1 rounded-[1.2rem] shadow-sm transition-all"
                                                       title="Validate Archetype">
                                                        <FiEye className="w-5 h-5" />
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200/50 rounded-full text-[9px] font-black tracking-widest uppercase w-fit animate-pulse">
                                                    <FiClock className="w-3 h-3" />
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-ethereal-on-surface-variant font-bold tracking-wider opacity-60">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="w-4 h-4 text-ethereal-on-surface-variant opacity-30" />
                                                    {formatDate(req.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => handleApprove(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-[1.2rem] hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50">
                                                        <FiCheckCircle className="w-4 h-4" />
                                                        Validate
                                                    </button>
                                                    <button onClick={() => { setRejectModalId(req.id); setRejectReason(''); }}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-rose-600 border border-rose-100 rounded-[1.2rem] hover:bg-rose-50 transition-all font-black text-[10px] uppercase tracking-widest">
                                                        <FiXCircle className="w-4 h-4" />
                                                        Invalidate
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Sequential Pagination Layer */}
                    {totalPages > 1 && (
                        <div className="bg-ethereal-surface-low/30 px-10 py-10 border-t border-ethereal-surface flex items-center justify-between">
                            <span className="text-[10px] font-black text-ethereal-on-surface-variant uppercase tracking-[0.3em]">
                                Page {page + 1} <span className="mx-3 opacity-20">/</span> {totalPages}
                            </span>
                            <div className="flex gap-4">
                                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                                        className="p-4 bg-white rounded-[1.2rem] shadow-sm hover:shadow-md disabled:opacity-20 hover:-translate-x-1 transition-all">
                                    <FiChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                                        className="p-4 bg-white rounded-[1.2rem] shadow-sm hover:shadow-md disabled:opacity-20 hover:translate-x-1 transition-all">
                                    <FiChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Rejection Protocol Overlay */}
            {rejectModalId && (
                <div className="fixed inset-0 bg-ethereal-surface/80 backdrop-blur-md flex items-center justify-center z-[60] p-6 animate-fadeIn">
                    <div className="glass-card bg-white p-10 rounded-[2.5rem] border-none shadow-2xl w-full max-w-lg animate-scaleIn">
                        <h3 className="text-2xl font-bold text-ethereal-on-surface uppercase tracking-tight mb-4">Invalidation Protocol</h3>
                        <p className="text-sm font-medium text-ethereal-on-surface-variant mb-8 opacity-60">Specify the discrepancy in the document archetype. This metadata will be transmitted to the entity.</p>
                        <textarea 
                            value={rejectReason} 
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Detailed rationale for non-compliance..."
                            rows={4} 
                            className="w-full px-6 py-5 bg-ethereal-surface border border-transparent rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-rose-100 transition-all outline-none resize-none min-h-[160px] text-sm font-medium" 
                        />
                        <div className="flex justify-end gap-4 mt-10">
                            <button onClick={() => setRejectModalId(null)}
                                    className="btn-ethereal-secondary">
                                Cancel
                            </button>
                            <button onClick={handleReject} 
                                    disabled={actionLoading === rejectModalId}
                                    className="px-8 py-4 bg-rose-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-600/20 disabled:opacity-50 transition-all">
                                {actionLoading === rejectModalId ? 'Processing...' : 'Execute Invalidation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVerificationsPage;
