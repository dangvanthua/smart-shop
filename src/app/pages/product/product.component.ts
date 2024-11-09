import { Component, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapMenuButton } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgIconComponent, CommonModule],
  viewProviders: [provideIcons({ bootstrapMenuButton })],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnDestroy {
  @ViewChild('menuToggle') menuToggle!: ElementRef;
  @ViewChild('sidebar') sidebar!: ElementRef;

  isSidebarVisible = false;
  private clickListener!: () => void;

  constructor(private renderer: Renderer2) { }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;

    if (this.isSidebarVisible) {
      this.clickListener = this.renderer.listen('document', 'click', (event: Event) => this.onClickOutside(event));
    } else if (this.clickListener) {
      this.clickListener();
    }
  }

  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (
      this.isSidebarVisible &&
      !this.sidebar.nativeElement.contains(target) &&
      !this.menuToggle.nativeElement.contains(target)
    ) {
      this.toggleSidebar();
    }
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.clickListener();
    }
  }
}
