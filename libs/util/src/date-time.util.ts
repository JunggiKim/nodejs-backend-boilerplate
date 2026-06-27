export class DateTimeUtil {
  static formatToString(date: Date): string {
    return date.toISOString();
  }

  static getNow(): Date {
    return new Date();
  }
}
