import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'around'
})
export class AroundPipe implements PipeTransform {

    transform(input: Array<any>, digits = 2): string {
        const rounded = input.map(x => Math.round(x * Math.pow(10, digits)) / (Math.pow(10, digits)));
        return rounded.join(', ');
    }

}
