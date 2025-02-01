import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../../dto/response/user-response.model';

@Component({
  selector: 'app-info-person',
  standalone: true,
  imports: [],
  templateUrl: './info-person.component.html',
  styleUrl: './info-person.component.scss'
})
export class InfoPersonComponent {
  @Input() userDetail?: UserResponse;
}
