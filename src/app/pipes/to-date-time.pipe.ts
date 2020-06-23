import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toDateTime'
})
export class ToDateTimePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return new Date(value).toLocaleString();
  }

}
