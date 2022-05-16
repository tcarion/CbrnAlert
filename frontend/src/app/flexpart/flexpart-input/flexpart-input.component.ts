import { FlexpartInput } from 'src/app/flexpart/flexpart-input';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-flexpart-input',
  templateUrl: './flexpart-input.component.html',
  styleUrls: ['./flexpart-input.component.scss']
})
export class FlexpartInputComponent implements OnInit {

  @Input() fpInput: FlexpartInput
  
  constructor() { }

  ngOnInit(): void {
  }

}
