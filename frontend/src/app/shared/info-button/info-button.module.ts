import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonDirectivesModule } from './../../directives/common-directives.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoButtonComponent } from './info-button.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
    declarations: [
        InfoButtonComponent
    ],
    imports: [
        CommonModule,
        CommonDirectivesModule,
        MatIconModule,
        // BrowserAnimationsModule,
    ],
    exports: [
        InfoButtonComponent
    ]
})
export class InfoButtonModule { }
