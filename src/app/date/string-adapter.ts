import {DateAdapter, MAT_DATE_LOCALE, MatDateFormats} from "@angular/material/core";
import {inject} from "@angular/core";

type StringDate = string;

export type StringDateFormatOption = {
  options: Intl.DateTimeFormatOptions,
  partsOptions: { [key in Intl.DateTimeFormatPartTypes]?: string }
}

type AdditionalDate = {
  year?: number,
  month?: number,
  day?: number
}

export class StringAdapter extends DateAdapter<StringDate> {

  constructor() {
    super();
    const locale = inject(MAT_DATE_LOCALE);
    super.setLocale(locale)
  }

  addCalendarDays(date: StringDate, days: number): StringDate {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      throw new Error('Invalid date')
    }
    const newDate = this.addDate(dateObject, {day: days});
    return this.parseDateToStringDate(newDate);
  }

  addCalendarMonths(date: StringDate, months: number): StringDate {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      throw new Error('Invalid date')
    }
    const newDate = this.addDate(dateObject, {month: months});
    return this.parseDateToStringDate(newDate);
  }

  addCalendarYears(date: StringDate, years: number): StringDate {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      throw new Error('Invalid date')
    }
    const newDate = this.addDate(dateObject, {year: years});
    return this.parseDateToStringDate(newDate);
  }

  clone(date: StringDate): StringDate {
    return date;
  }

  createDate(year: number, month: number, date: number): StringDate {
    const dateObject = new Date(year, month, date);
    return this.parseDateToStringDate(dateObject);
  }

  format(date: StringDate, displayFormat: StringDateFormatOption): string {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      return date
    }
    const formatter = new Intl.DateTimeFormat(this.locale, displayFormat.options);
    const formatted = formatter.formatToParts(dateObject).map(({type, value}) => {
      return displayFormat.partsOptions[type] ?? value;
    }).join('');
    return formatted;
  }

  getDate(date: StringDate): number {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      const today = this.today();
      return this.getDate(today);
    }
    return dateObject.getDate();
  }

  getDateNames(): string[] {
    const days = range(1, 31);
    return days.map(day => day.toString());
  }

  getDayOfWeek(date: StringDate): number {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      const today = this.today();
      return this.getDayOfWeek(today);
    }
    return dateObject.getDay();
  }

  getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return style === 'long' ? days.map(d => `${d}曜日`) : days;
  }

  getFirstDayOfWeek(): number {
    return 0;
  }

  getMonth(date: StringDate): number {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      const today = this.today();
      return this.getMonth(today);
    }
    return dateObject.getMonth();
  }

  getMonthNames(style: "long" | "short" | "narrow"): string[] {
    const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    return style === 'long' ? months.map(m => `${m}月`) : months;
  }

  getNumDaysInMonth(date: StringDate): number {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      const today = this.today();
      return this.getNumDaysInMonth(today);
    }
    const lastDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1, 0);
    return lastDay.getDate();
  }

  getYear(date: StringDate): number {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      const today = this.today();
      return this.getYear(today);
    }
    return dateObject.getFullYear();
  }

  getYearName(date: StringDate): string {
    const dateObject = this.parseStringDateToDate(date);
    if (!dateObject) {
      throw new Error('Invalid date')
    }
    return dateObject.getFullYear().toString();
  }

  invalid(): StringDate {
    return '00000000';
  }

  isDateInstance(obj: any): boolean {
    return false;
  }

  isValid(date: StringDate): boolean {
    return false;
  }

  parse(value: any, parseFormat: any): StringDate | null {
    const date = this.parseStringDateToDate(value);
    if (!date) {
      return value;
    }
    const formatted = this.format(this.parseDateToStringDate(date), parseFormat);
    if (value === formatted) {
      return value;
    }
    return formatted;
  }

  toIso8601(date: StringDate): string {
    const dateFormat = /^(<?year>\d{4})(<?month>\d{2})(<?date>\d2)$/
    const isoFormatString = date.replace(dateFormat, '$<year>-$<month>-$<date>')
    return isoFormatString;
  }

  today(): StringDate {
    const today = new Date();
    return this.parseDateToStringDate(today);
  }

  /**
   * Given a potential date object, returns that same date object if it is
   * a valid date, or `null` if it's not a valid date.
   * @param obj The object to check.
   * @returns A date or `null`.
   */
  override getValidDateOrNull(obj: unknown): StringDate | null {
    if (typeof obj === 'string') {
      return obj;
    }
    if (obj instanceof Date) {
      return this.parseDateToStringDate(obj);
    }
    return '';
  };

  /**
   * Attempts to deserialize a value to a valid date object. This is different from parsing in that
   * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
   * string). The default implementation does not allow any deserialization, it simply checks that
   * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
   * method on all of its `@Input()` properties that accept dates. It is therefore possible to
   * support passing values from your backend directly to these properties by overriding this method
   * to also deserialize the format used by your backend.
   * @param value The value to be deserialized into a date object.
   * @returns The deserialized date object, either a valid date, null if the value can be
   *     deserialized into a null date (e.g. the empty string), or an invalid date.
   */
  override deserialize(value: any): StringDate | null {
    return this.getValidDateOrNull(value);
  };

  /**
   * Compares two dates.
   * @param first The first date to compare.
   * @param second The second date to compare.
   * @returns 0 if the dates are equal, a number less than 0 if the first date is earlier,
   *     a number greater than 0 if the first date is later.
   */
  override compareDate(first: StringDate, second: StringDate): number {
    const firstDate = this.parseStringDateToDate(first);
    const secondDate = this.parseStringDateToDate(second);
    if (!firstDate || !secondDate) {
      return 0
    }
    return firstDate.getTime() - secondDate.getTime();
  };

  /**
   * Checks if two dates are equal.
   * @param first The first date to check.
   * @param second The second date to check.
   * @returns Whether the two dates are equal.
   *     Null dates are considered equal to other null dates.
   */
  override sameDate(first: StringDate | null, second: StringDate | null): boolean {
    return first === second
  };

  /**
   * Clamp the given date between min and max dates.
   * @param date The date to clamp.
   * @param min The minimum value to allow. If null or omitted no min is enforced.
   * @param max The maximum value to allow. If null or omitted no max is enforced.
   * @returns `min` if `date` is less than `min`, `max` if date is greater than `max`,
   *     otherwise `date`.
   */
  override clampDate(date: StringDate, min?: StringDate | null, max?: StringDate | null): StringDate {
    if (!min) min = date;
    if (!max) max = date;
    return date < min ? min : date > max ? max : date;
  };

  private parseStringDateToDate(stringDate: StringDate): Date | null {
    const dateFormat = /^(?<year>\d{4})(?<month>\d{2})(?<date>\d{2})$/;
    const result = stringDate.replace(dateFormat, '$<year>-$<month>-$<date>T00:00:00');
    if (stringDate === result) {
      return null
    }
    const date = new Date(result)

    if (date.toString() === 'Invalid Date') {
      return null
    }
    return date;
  }

  private parseDateToStringDate(date: Date): StringDate {
    const formatter = new Intl.DateTimeFormat(this.locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const dateString = formatter.formatToParts(date).map(({type, value}) => {
      switch (type) {
        case 'literal':
          return ''
        default:
          return value
      }
    }).join('')

    return dateString;
  }

  private addDate(date: Date, additionalDate: AdditionalDate): Date {
    const newDate = new Date(date);

    const year = additionalDate.year ?? 0;
    const month = additionalDate.month ?? 0;
    const day = additionalDate.day ?? 0;

    newDate.setFullYear(date.getFullYear() + year);
    newDate.setMonth(date.getMonth() + month);
    newDate.setDate(date.getDate() + day);

    return newDate;
  }
}


function range(start: number, end: number): number[] {
  return Array.from({length: end - start + 1}, (_, i) => i + start);
}
