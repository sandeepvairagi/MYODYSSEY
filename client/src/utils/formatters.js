export const formatPrice = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const truncate = (str, len = 100) =>
  str?.length > len ? `${str.substring(0, len)}...` : str;

export const getImageUrl = (destination) =>
  destination?.images?.[0]?.url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600';
