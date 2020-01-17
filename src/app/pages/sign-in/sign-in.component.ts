import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-registro',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  user: UserModel;
  rememberMe = false;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.user = new UserModel();
   }
    
   onSubmit(form: NgForm){
     if(form.invalid){
       return;
     }
     Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Wait please...'

    });
    Swal.showLoading();
    
     this.auth.signIn(this.user)
       .subscribe(resp => {
         
        console.log(resp);
         Swal.close();
        
        if(this.rememberMe){
          localStorage.setItem('email', this.user.email);
        }

         this.router.navigateByUrl('/home');
       }, (err) => {
         console.log(err.error.error.message);
         Swal.fire({
          icon: 'error',
          title: 'Auth error',
          text: err.error.error.message
        });
       });
   }

}
