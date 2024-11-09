import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapGoogle, bootstrapFacebook } from '@ng-icons/bootstrap-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ bootstrapGoogle, bootstrapFacebook })],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  onSubmit() { }
}


