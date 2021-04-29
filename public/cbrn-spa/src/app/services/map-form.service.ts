import { FormService } from './form.service';
import { MapService } from './map.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapFormService {

  constructor(private mapService: MapService, private formService: FormService) { }
}
