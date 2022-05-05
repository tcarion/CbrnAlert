import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
     }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });


    }


    onSubmit() {
        const val = this.loginForm.value;
        if (val.email && val.password) {
            this.authenticationService.login(val.email, val.password)
                .subscribe(
                    (res) => {
                        console.log("User is logged in");
                        console.log(res);
                        this.router.navigateByUrl('/');
                    }
                );
        }
    }
}
