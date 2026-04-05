

export class DateTimeUtils {
  /** Get current date in YYYY-MM-DD format */
  static getCurrentDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  /** Get current time in HH:mm:ss format */
  static getCurrentTime(): string {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  /** Get current date and time in YYYY-MM-DD HH:mm:ss format */
  static getCurrentDateTime(): string {
    return `${this.getCurrentDate()} ${this.getCurrentTime()}`;
  }

  /** Format a Date object to a custom format */
  static formatDate(date: Date, format = 'YYYY-MM-DD'): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(yyyy))
      .replace('MM', mm)
      .replace('DD', dd)
      .replace('HH', hh)
      .replace('mm', mi)
      .replace('ss', ss);
  }

  /** Add days to a date */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /** Subtract days from a date */
  static subtractDays(date: Date, days: number): Date {
    return this.addDays(date, -days);
  }

  /** Convert a timestamp to YYYY-MM-DD HH:mm:ss */
  static timestampToDateTime(timestamp: number): string {
    return this.formatDate(new Date(timestamp), 'YYYY-MM-DD HH:mm:ss');
  }
}