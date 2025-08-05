export const formatDateTime = (date: Date): string => {
  const now = new Date();
  const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  // Format the date
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  const dateStr = date.toLocaleDateString('en-US', dateOptions);
  const timeStr = date.toLocaleTimeString('en-US', timeOptions);
  
  // Add relative time indicator
  let relativeTime = '';
  if (diffInHours < 0) {
    // Past due
    const daysOverdue = Math.floor(Math.abs(diffInHours) / 24);
    if (daysOverdue === 0) {
      relativeTime = ' (Overdue)';
    } else if (daysOverdue === 1) {
      relativeTime = ' (1 day overdue)';
    } else {
      relativeTime = ` (${daysOverdue} days overdue)`;
    }
  } else if (diffInHours === 0) {
    relativeTime = ' (Due today)';
  } else if (diffInHours < 24) {
    relativeTime = ' (Due today)';
  } else if (diffInHours < 48) {
    relativeTime = ' (Due tomorrow)';
  } else {
    const daysUntil = Math.ceil(diffInHours / 24);
    relativeTime = ` (Due in ${daysUntil} days)`;
  }
  
  return `${dateStr} at ${timeStr}${relativeTime}`;
};

export const formatDateOnly = (date: Date): string => {
  const now = new Date();
  const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const dateStr = date.toLocaleDateString('en-US', dateOptions);
  
  // Add relative time indicator
  let relativeTime = '';
  if (diffInHours < 0) {
    const daysOverdue = Math.floor(Math.abs(diffInHours) / 24);
    if (daysOverdue === 0) {
      relativeTime = ' (Overdue)';
    } else if (daysOverdue === 1) {
      relativeTime = ' (1 day overdue)';
    } else {
      relativeTime = ` (${daysOverdue} days overdue)`;
    }
  } else if (diffInHours === 0) {
    relativeTime = ' (Due today)';
  } else if (diffInHours < 24) {
    relativeTime = ' (Due today)';
  } else if (diffInHours < 48) {
    relativeTime = ' (Due tomorrow)';
  } else {
    const daysUntil = Math.ceil(diffInHours / 24);
    relativeTime = ` (Due in ${daysUntil} days)`;
  }
  
  return `${dateStr}${relativeTime}`;
};

export const formatTimeOnly = (date: Date): string => {
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleTimeString('en-US', timeOptions);
};

export const isOverdue = (date: Date): boolean => {
  return date < new Date();
};

export const isDueToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isDueTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high':
      return '#f44336'; // Red
    case 'medium':
      return '#ff9800'; // Orange
    case 'low':
      return '#4caf50'; // Green
    default:
      return '#757575'; // Grey
  }
}; 