import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'month'
})
export class MonthPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!value) { return value };
        if (value === '01') { return 'Janvier' };
        if (value === '02') { return 'Février' };
        if (value === '03') { return 'Mars' };
        if (value === '04') { return 'Avril' };
        if (value === '05') { return 'Mai' };
        if (value === '06') { return 'Juin' };
        if (value === '07') { return 'Juillet' };
        if (value === '08') { return 'Août' };
        if (value === '09') { return 'Septembre' };
        if (value === '10') { return 'Octobre' };
        if (value === '11') { return 'Novembre' };
        if (value === '12') { return 'Decembre' };
    }
}
