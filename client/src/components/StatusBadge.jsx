import React from 'react';
import { getStatusBadgeStyle } from '../utils/formatters';
import {
  Clock,
  CheckCircle2,
  Package,
  RotateCcw,
  CheckCheck,
  XCircle,
  Ban,
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getIcon = () => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-3.5 h-3.5" />;
      case 'Approved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />;
      case 'Borrowed':
        return <Package className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Return Requested':
        return <RotateCcw className="w-3.5 h-3.5 text-purple-500" />;
      case 'Completed':
        return <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Rejected':
        return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      case 'Cancelled':
        return <Ban className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return null;
    }
  };

  const style = getStatusBadgeStyle(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
    >
      {getIcon()}
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
