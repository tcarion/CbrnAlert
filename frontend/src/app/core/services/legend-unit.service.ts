import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })


export class LegendUnitService {
    private dataSource = new BehaviorSubject<string>('default value'); 
    currentData = this.dataSource.asObservable();
  
    constructor() {}
  
    changeData(data: string) {
        console.log('changing data in Legend Unit Service :' + data)
      this.dataSource.next(data);
    }
  }