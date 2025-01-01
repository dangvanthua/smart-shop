import { Component } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { UserService } from '../../../services/user.service';
import { UserResponse } from '../../../dto/response/user-response.model';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { BreadcrumComponent } from "../../../components/breadcrum/breadcrum.component";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  userDetail?: UserResponse;

  constructor(
    private userService: UserService
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
    })
  }
}
