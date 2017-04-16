import {Component} from "@angular/core";
import {Credentials} from "../model/credentials";
import {AuthService} from "../service/auth.service";
import {SessionStorageService} from "ng2-webstorage";
import {Router} from "@angular/router";
@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error: string;
  credentials: Credentials;

  constructor(private authService: AuthService, private localSt: SessionStorageService, private router: Router) {
    this.credentials = new Credentials();
  }

  login() {
    this.authService.login(this.credentials)
      .subscribe(jwt => {
          this.localSt.store("TOKEN", jwt.token);
          this.authService.storeProfile();
          this.error = '';
          let redirect = this.authService.redirectUrl && this.authService.redirectUrl != '/app/admin' ? this.authService.redirectUrl : '/app';
          this.router.navigate([redirect]);
        },
        err => {
          this.error = err;
        });
  }
}
