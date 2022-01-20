import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// Services
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Para habilitar el icono de carga durante el tiempo de la peticion http
  asyncReq: boolean = false;
  // Para habilitar la activacion de la cuenta
  verifyAccount: boolean = false;
  // Datos del usuario que va a activar cuenta
  idUsuario: any;
  codigoConfirmacion: any;
  formularioLogin: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.crearForm();
    // Para la ruta login/:idUsuario/:codigo
    if (this.activatedRoute.snapshot.params?.['codigo'] != undefined) {
      this.usersService.enableVerifyAccount(this.activatedRoute.snapshot.params?.['idUsuario'], this.activatedRoute.snapshot.params?.['codigo'])
        .subscribe({
          next: (res) => {
            if (res.message == 'OK') {
              this.verifyAccount = true;
            } else {
              this.alertifyService.success(res.message);
              this.router.navigate(['/login']);
            }
          }
        });
    } else {
      this.verifyAccount = false;
    }
  }

  crearForm() {
    this.formularioLogin = this.fb.group({
      userEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Metodo GET
  get f() {
    return this.formularioLogin.controls;
  }

  // Revisar si es login normal o para activar cuenta
  checkLoginType() {
    if (!this.verifyAccount) {
      this.login();
    } else {
      this.loginAndVerify();
    }
  }

  // Login normal
  login() {
    if (this.formularioLogin.valid) {
      this.asyncReq = true;
      const formData = {
        username: this.f['userEmail']?.value,
        password: this.f['password']?.value
      };
      this.authService.loginUser(formData)
        .subscribe({
          next: (res) => {
            if (res.message == 'Login exitoso') {
              this.alertifyService.success(res.message);
              this.router.navigate(['/dashboard']);
            }
          }
        }).add(() => {
          // Deshabilitar el icono de carga una vez finalizada la peticion
          this.asyncReq = false;
        });
    } else {
      this.formularioLogin.markAllAsTouched();
    }
  }

  // Login para activar cuenta
  loginAndVerify() {
    if (this.formularioLogin.valid) {
      this.asyncReq = true;
      const formData = {
        username: this.f['userEmail']?.value,
        password: this.f['password']?.value
      };
      this.authService.loginUserAndVerify(formData)
        .subscribe({
          next: (res) => {
            if (res.message == 'Cuenta activada exitosamente') {
              this.alertifyService.success(res.message);
              this.router.navigate(['/dashboard']);
            }
          }
        }).add(() => {
          // Deshabilitar el icono de carga una vez finalizada la peticion
          this.asyncReq = false;
        });
    } else {
      this.formularioLogin.markAllAsTouched();
    }
  }

  // Funcion para mostrar la contraseña en el input
  mostrarPassword(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

}
