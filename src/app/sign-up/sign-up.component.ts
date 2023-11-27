// basic component
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// reactive forms
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';

// services
import { AuthService } from '../auth.service';

// interfaces
import { SignUpRequest } from '../sign-up-request';
import { SignUpResponse } from '../sign-up-response';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup = new FormGroup({
    userId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  });

  signUpResponseBody: SignUpResponse;

  isSignedUp: boolean = false;
  isAlreadyExisting: boolean = false;

  constructor(private authService: AuthService) {}

  signUp() {

    // prepare request
    let signUpRequest: SignUpRequest = {
      userId: String(this.signUpForm.value.userId),
      name: String(this.signUpForm.value.name)
    }

    this.authService.signUp(signUpRequest)
      .subscribe(
        (SignUpResponse) => {
          this.signUpResponseBody = SignUpResponse.body!;

          // print successful sign-up
          this.isSignedUp = true;
          this.isAlreadyExisting = false;
        },
        (error) => {

          // print already existing
          this.isSignedUp = false;
          this.isAlreadyExisting = true;
        }
      );
  }
}
