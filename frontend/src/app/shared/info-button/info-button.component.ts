import { animate, state, style, transition, trigger } from '@angular/animations';
import { Input } from '@angular/core';
import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-info-button',
    templateUrl: './info-button.component.html',
    styleUrls: ['./info-button.component.scss'],
    animations: [
        trigger('openClose', [
            transition(
                ':enter',
                [
                    style({ opacity : 0}),
                    animate('0.3s ease-out', style({ opacity : 1}))
                ]
            ),
            transition(
                ':leave',
                [
                    style({ opacity : 1}),
                    animate('0.3s ease-out', style({ opacity : 0}))
                ]
            )
        ]),
    ],
})
export class InfoButtonComponent implements OnInit {
    isOpen = false;

    @Input() content: {[k: string]: string}
    @ViewChild('infoIcon') infoIcon: ElementRef;
    @ViewChild('infoContainer') infoContainer: ElementRef;

    constructor(private renderer: Renderer2) {
        this.renderer.listen('window', 'click', (e: Event) => {
            if (this.infoContainer && e.target !== this.infoIcon.nativeElement && e.target !== this.infoContainer.nativeElement) {
                this.isOpen = false;
            }
        });
    }

    ngOnInit(): void {

    }

    toggleInfo() {
        this.isOpen = !this.isOpen;
    }
}
