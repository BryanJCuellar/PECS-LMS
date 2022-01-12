import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { throttleTime, debounceTime } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
// Custom Validations
import { ConfirmedValidator } from 'src/app/utils/confirmed.validator';
// Services
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  nombreSeccion: any;
  // 2: Docente, 3: Estudiante
  tipoCuenta: Number = 3;
  formCompleto: boolean = true;
  formularioRegistro: FormGroup;
  dataUsuario: any = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private fb: FormBuilder,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit(): void {
    this.crearForm();
    // For signup/:idUsuario
    if (this.activatedRoute.snapshot.params?.['idUsuario'] != undefined) {
      this.nombreSeccion = 'signup-success';
      this.authService.enableLinkEmail(this.activatedRoute.snapshot.params?.['idUsuario'])
        .subscribe(
          response => {
            console.log(response);
            if (response.message == 'Encontrado') {
              this.dataUsuario = response;
            } else {
              this.dataUsuario = null;
              this.alertifyService.success(response.message);
            }
          }
        );
    } else {
      this.nombreSeccion = 'signup';
    }
    this.scrolltoID(this.activatedRoute.snapshot.fragment);
  }

  scrolltoID(id: string | null) {
    if (id != null) {
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor(id);
      }, 50);
    } else {
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor('signup');
      }, 50);
    }
  }

  crearForm() {
    this.formularioRegistro = this.fb.group({
      idCategoriaUsuario: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(45)]],
      apellido: ['', [Validators.required, Validators.maxLength(45)]],
      numeroTelefono: ['', [Validators.required, Validators.pattern("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\.\/0-9]*$")]],
      email: ['', [Validators.required, Validators.pattern("^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}$")]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      samePassword: ['', Validators.required]
    }, {
      // Verificar que passwords coincidan
      validator: ConfirmedValidator('password', 'samePassword')
    });
  }
  // Metodos GET
  get f() {
    return this.formularioRegistro.controls;
  }

  registrarCuenta() {
    this.f['idCategoriaUsuario']?.setValue(this.tipoCuenta);
    const tempData = {
      idUsuario: 1,
      correo: 'bjcz1998@gmail.com',
      nombre: 'Bryan Josué',
      nombreUsuario: 'bryanc798',
      codigoConfirmacion: 'gMYwKCKn8IvQ7KqEihnQCwbom'
    };
    this.authService.sendEmail(tempData)
    .subscribe(
      response => {
        console.log(response);
      }
    );
    /*setTimeout(() => {
      this.router.navigate([`/signup/1/rOOypia8iJWvn5xbqGjwOnoqO`]);
    }, 50);*/
    /*const formData = {
      idCategoriaUsuario: this.f['idCategoriaUsuario']?.value,
      nombre: this.f['nombre']?.value,
      apellido: this.f['apellido']?.value,
      numeroTelefono: this.f['numeroTelefono']?.value,
      correo: this.f['email']?.value,
      nombreUsuario: this.f['username']?.value,
      clave: this.f['password']?.value
    };
    if (this.formularioRegistro.valid) {
      this.formCompleto = true;
      this.authService.registerUser(formData)
        .subscribe(
          response => {
            // console.log(response);
            if (response.resultData?.codigo == 0) {
              setTimeout(() => {
                this.router.navigate([`/signup/${response.resultData.idUsuario}/${response.codigoConfirmacion}`], { fragment: 'signup-success' });
                this.nombreSeccion = 'signup-success';
              }, 50);
            }
          }
        );
    } else {
      this.formCompleto = false;
      this.formularioRegistro.markAllAsTouched();
    }*/
  }

  enlaceCorreo() {

  }

  seleccionarImagen(idImage) {
    if (idImage.id == 'student-img') {
      this.tipoCuenta = 3;
    }
    if (idImage.id == 'teacher-img') {
      this.tipoCuenta = 2;
    }
    this.f['idCategoriaUsuario']?.setValue(this.tipoCuenta);
  }

  mostrarPasswords(input: any, input2: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
    input2.type = input2.type === 'password' ? 'text' : 'password';
  }

}
