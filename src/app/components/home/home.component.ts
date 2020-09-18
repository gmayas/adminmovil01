import { Component, OnInit , OnDestroy, OnChanges } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { takeWhile } from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, OnChanges {
  //
  public isAuth: boolean = false;
  public alive: boolean = true;
  public user: any; 
  //   
  constructor(public auth: AuthService) {
    this.auth.isAuthenticated()
      .pipe(takeWhile(() => this.alive))
      .takeUntil(this.auth.isSigningOut())
      .subscribe((isAuth: any) => {
        this.isAuth = isAuth;
      });
  }
  
  ngOnChanges(): void {
    this.user = this.auth.user();
  }

  ngOnInit() {
    this.user = this.auth.user();
   }

  ngOnDestroy() {
    this.alive = false;
  }

}
