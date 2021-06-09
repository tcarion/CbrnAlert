import { Component, OnInit } from '@angular/core';

const plots = [
    {
        type: "atp45",
        id: "1",
        layer: {}
    },
    {
        type: "atp45",
        id: "2",
        layer: {}
    }
]

@Component({
  selector: 'app-map-plot-list',
  templateUrl: './map-plot-list.component.html',
  styleUrls: ['./map-plot-list.component.scss']
})

export class MapPlotListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
