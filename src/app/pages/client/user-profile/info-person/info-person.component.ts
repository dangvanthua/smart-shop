import { Component, Input } from '@angular/core';
import { UserResponse } from '../../../../dto/response/user-response.model';
import { UserService } from '../../../../services/user.service';
import { ApiResponse } from '../../../../dto/response/api-response.model';

@Component({
  selector: 'app-info-person',
  standalone: true,
  imports: [],
  templateUrl: './info-person.component.html',
  styleUrl: './info-person.component.scss'
})
export class InfoPersonComponent {
  userDetail?: UserResponse;

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getUserDetail().subscribe({
      next: (response: ApiResponse<UserResponse>) => {
        if(response.code === 1000 && response.result) {
          this.userDetail = response.result;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
