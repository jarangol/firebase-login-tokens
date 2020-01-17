import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: UserModel = new UserModel();
  rememberMe: boolean = false;
  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('email')){
      this.user.email = localStorage.getItem('email');
      this.rememberMe = true;
    }
  }

  login(form: NgForm){
    if(form.invalid){return;}
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Wait please...'
    });
    Swal.showLoading();
    
    this.auth.login(this.user)
    .subscribe(resp => {
      Swal.close();

      if(this.rememberMe){
        localStorage.setItem('email', this.user.email);
      }
      this.router.navigateByUrl('/home');
    }, (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Auth error',
        text: err.error.error.message
      });

    });
    
  }

}
