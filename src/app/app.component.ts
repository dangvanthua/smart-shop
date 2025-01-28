import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessagerComponent } from "./pages/client/messager/messager.component";
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapMessenger } from '@ng-icons/bootstrap-icons';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NgIconComponent,
    CommonModule,
    MessagerComponent
],
viewProviders: [provideIcons({bootstrapMessenger})],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'smart-shop';
  isMessengerOpen: boolean = false;

  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  openMessenger(): void {
    this.isMessengerOpen = true;
  }
  
  closeMessenger(): void {
    this.isMessengerOpen = false;
  }
}
