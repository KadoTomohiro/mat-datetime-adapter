import { Component } from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {MatCalendar, MatDatepicker, MatDatepickerInput} from "@angular/material/datepicker";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE, MatDateFormats,
  NativeDateAdapter,
  provideNativeDateAdapter
} from "@angular/material/core";
import {StringAdapter, StringDateFormatOption} from "./string-adapter";

type StringDateFormats = {
  parse: {
    dateInput: StringDateFormatOption
  },
  display: {
    dateInput: StringDateFormatOption,
    monthYearLabel: StringDateFormatOption,
    dateA11yLabel: StringDateFormatOption,
    monthYearA11yLabel: StringDateFormatOption,
    monthLabel: StringDateFormatOption
  }
}

const DATE_FORMAT: StringDateFormats = {
  parse: {
    dateInput: {
      options: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      },
      partsOptions: {
        literal: ''
      }
    }
  },
  display: {
    dateInput: {
      options: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      },
      partsOptions: {
        literal: ''
      }
    },
    monthYearLabel: {
      options: {
        year: 'numeric',
        month: '2-digit',
      },
      partsOptions: {
        literal: '/'
      }
    },
    dateA11yLabel: {
      options: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      },
      partsOptions: {
        literal: '/'
      }
    },
    monthYearA11yLabel: {
      options: {
        year: 'numeric',
        month: '2-digit',
      },
      partsOptions: {
        literal: '/'
      }
    },
    monthLabel: {
      options: {
        month: '2-digit',
      },
      partsOptions: {}
    },
  }
};

@Component({
  selector: 'app-date',
  standalone: true,
  imports: [
    MatDatepickerInput,
    MatDatepicker,
    MatCalendar,
    FormsModule
  ],
  templateUrl: './date.component.html',
  styleUrl: './date.component.css',
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'ja-JP'
    },
    {
      provide: DateAdapter,
      useClass: StringAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: DATE_FORMAT
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateComponent,
      multi: true
    }
  ]
})
export class DateComponent implements ControlValueAccessor {

  date: string = '';

  onChange: any = (_: any) => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.date = obj;
  }
  onModelChange(event: any) {
    this.onChange(event);
  }

}
