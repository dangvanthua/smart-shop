import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appStickyNavigation]',
    standalone: true,
})
export class StickyNavigationDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const headerContainer = document.querySelector('.header-container') as HTMLElement;
        const navigation = this.el.nativeElement;

        if (window.scrollY > headerContainer.offsetHeight) {
            this.renderer.addClass(navigation, 'fixed-top');
        } else {
            this.renderer.removeClass(navigation, 'fixed-top');
        }
    }
}