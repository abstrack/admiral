import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Employee} from "../model/employee";
import {Http, URLSearchParams, Headers, RequestOptions} from "@angular/http";
import {SessionStorageService} from "ng2-webstorage";
import {Credentials} from "../model/credentials";
import {Router} from "@angular/router";
import {Url} from "../url";

@Injectable()
export class AuthService {

  public redirectUrl: string;
  private authUrl;
  private profileUrl;

  constructor(private http: Http, private localSt: SessionStorageService, private router: Router) {
    this.profileUrl = Url.getUrl("/profile");
    this.authUrl = Url.getUrl("/auth");
    this.storeProfile();
  }

  public login(credentials: Credentials): Observable<any> {
    return this.http.post(this.authUrl, JSON.stringify(credentials), new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})}))
      .map(res => res.json())
      .catch(e => {
        if (e.status === 401) {
          return Observable.throw('Wrong credentials');
        }
      });
  }

  public storeProfile(): void {
    this.http.get(this.profileUrl, this.getOptions()).map(res => res.json()).catch(e => Observable.throw('Unauthorized'))
      .subscribe(employee => {
        // this.loggedEmployee.next(employee);
        this.localSt.store("employee", JSON.stringify(employee));
      });
  }

  public changeOwnPass(newPass: string): Observable<any> {
    let params = new URLSearchParams();
    params.append('password', newPass);
    let headers = new Headers({'Authorization': this.getToken()});
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.put(this.profileUrl + "/password", params.toString(), {
      headers: headers,
    }).catch(e => {
      let s = e.json().details[0];
      return Observable.throw(s);
    })
  }

  public getOptions(): RequestOptions {
    let headers = new Headers({'Content-Type': 'application/json'});
    headers.append("Authorization", this.getToken());
    headers.append("X-Requested-With", "XMLHttpRequest");
    return new RequestOptions({headers: headers});
  }

  public getToken(): string {
    return this.localSt.retrieve("TOKEN");
  }

  public tokenObserv(): Observable<string> {
    return this.localSt.observe('TOKEN');
  }

  public getProfile(): Employee {
    return JSON.parse(this.localSt.retrieve("employee"));
  }

  public profileObserv(): Observable<string> {
    return this.localSt.observe("employee");
  }

  public logout() {
    this.router.navigate(['/app']);
    this.localSt.clear('TOKEN');
    this.localSt.clear('employee');
  }
}
