import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserResponse } from '../../../dto/response/user-response.model';
import { ApiResponse } from '../../../dto/response/api-response.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapBagCheck, bootstrapBank, bootstrapBell, bootstrapCartCheck, bootstrapChevronRight, bootstrapPass, bootstrapPerson, bootstrapPersonFillExclamation, bootstrapPersonFillGear, bootstrapPostcard, bootstrapTicket, bootstrapWindowDock } from '@ng-icons/bootstrap-icons';
import { InfoPersonComponent } from "./info-person/info-person.component";
import { TokenService } from '../../../services/token.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    NgIconComponent,
    HeaderComponent,
    FooterComponent,
    RouterModule
],
  viewProviders: provideIcons({
    bootstrapPerson,
    bootstrapWindowDock,
    bootstrapBank,
    bootstrapPostcard,
    bootstrapPass,
    bootstrapBell,
    bootstrapPersonFillGear,
    bootstrapCartCheck,
    bootstrapPersonFillExclamation,
    bootstrapTicket,
    bootstrapChevronRight,
    bootstrapBagCheck    
  }),
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  userDetail?: UserResponse;

  constructor(
    private userService: UserService,
    private tokenService: TokenService
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

  isSeller(): boolean {
    const roles = this.tokenService.getRoleFromToken()?.split(" ");
    return roles?.includes("ROLE_SELLER") || false;
  }
}
