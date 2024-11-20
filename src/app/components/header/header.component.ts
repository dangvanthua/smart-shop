import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapPerson, bootstrapCart, bootstrapMenuApp, bootstrapPersonVcard } from '@ng-icons/bootstrap-icons';
import { StickyNavigationDirective } from '../../directives/fix-navigation.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIconComponent,
    StickyNavigationDirective
  ],
  viewProviders: [
    provideIcons({
      bootstrapPerson,
      bootstrapCart,
      bootstrapMenuApp,
      bootstrapPersonVcard
    })],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
