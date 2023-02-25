import { UnauthorizedError } from 'src/app/core/api/models/unauthorized-error';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  errorMessageSubject = new BehaviorSubject('');
  errorMessage$ = this.errorMessageSubject.asObservable();

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });;

  // errorMessage$ = this.authenticationService.login()
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
  }


  onSubmit() {
    const val = this.loginForm.value;
    this.authenticationService.login(val.email, val.password).pipe(
      catchError( (error: UnauthorizedError, _) => {
        this.errorMessageSubject.next("Your email or password seems to be wrong.")
        return of(1)
      })
    )
      .subscribe(
        (res) => {
          if (res == 1) {
            return;
          }
          this.router.navigateByUrl('/');
        }
      );
  }
}
