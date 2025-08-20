export interface formatDate {
  date: string;
  format: string;
}

export const formatDate = (date: string) => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error(error);
    return '';
  }
};

export const formattedPeriod = (
  startDate: string,
  endDate: string,
  isCurrent: boolean = false
): string => {
  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const start = formatDate(startDate);
  const end = isCurrent ? 'Present' : formatDate(endDate);

  return `${start} - ${end}`;
};

export function getMaxDate(dates: string[]): string {
  try {
    const dateObjects = dates.map((dateString: string) => new Date(dateString));
    const latestDate = new Date(
      Math.max(...dateObjects.map((date) => date.getTime()))
    );
    const backendDate = new Date(latestDate);
    return backendDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  } catch (e) {
    return '';
  }
}

export function formatDateString(date: any, time = false) {
  if (date) {
    try {
      let dateObj;
      let parts;

      if (date instanceof Date) {
        // Check if date is a Date object
        dateObj = date;
        parts = [
          dateObj.getFullYear(),
          String(dateObj.getMonth() + 1).padStart(2, '0'),
          String(dateObj.getDate()).padStart(2, '0')
        ];
      } else {
        // Check if the date is a string change it to date object
        parts = date.split('-');
        dateObj = new Date(date);
      }

      if (parts.length === 1) {
        // Only year is provided
        const year = parts[0];
        return `${year}`;
      } else if (parts.length === 2) {
        // Year and month are provided
        const year = parts[0];
        const month = parseInt(parts[1], 10);
        const monthName = new Date(year, month - 1).toLocaleString('default', {
          month: 'short'
        });
        return `${monthName}, ${year}`;
      } else if (parts.length === 3) {
        // Full date is provided
        const year = parts[0];
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const monthName = new Date(year, month - 1).toLocaleString('default', {
          month: 'short'
        });
        if (time) {
          // Return the time with date if datatime requested
          const hours = String(dateObj.getUTCHours()).padStart(2, '0');
          const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
          const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');
          return `${monthName} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
        }
        return `${monthName} ${day}, ${year}`;
      } else {
        return '';
      }
    } catch (e) {
      return '';
    }
  } else {
    return '';
  }
}
