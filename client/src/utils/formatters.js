export const formatCurrency = (amount) => {
  if (amount === 0 || !amount) {
    return 'Free';
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
};

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Approved':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Borrowed':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Return Requested':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Cancelled':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
