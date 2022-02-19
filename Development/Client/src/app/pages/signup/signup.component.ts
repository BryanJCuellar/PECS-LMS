import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
// Custom Validations
import { matchValidator } from 'src/app/utils/form-validators';
// Services
import { AlertifyService } from 'src/app/services/alertify.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  // Para habilitar el icono de carga durante el tiempo de la peticion http
  asyncReq: boolean = false;
  // Para habilitar una seccion del componente
  nombreSeccion: any;
  // 2: Docente, 3: Estudiante
  tipoCuenta: Number = 3;
  formularioRegistro: FormGroup;
  // Para mostrar si el formulario es valido
  formCompleto: boolean = true;
  // Validar email, username
  emailDuplicado: boolean = false;
  usernameDuplicado: boolean = false;
  // Variable para debounce en email y username, Source: https://youtu.be/mt0pMPwgHhc
  debounceTimer?: NodeJS.Timeout;
  // Para recopilar datos del usuario una vez registrado
  dataUsuario: any = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private fb: FormBuilder,
    private alertifyService: AlertifyService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.crearForm();
    // Para la ruta signup/:idUsuario/:codigo
    if (this.activatedRoute.snapshot.params?.['codigo'] != undefined) {
      this.nombreSeccion = 'signup-success';
      this.usersService.enableLinkEmail(this.activatedRoute.snapshot.params?.['idUsuario'], this.activatedRoute.snapshot.params?.['codigo'])
        .subscribe({
          next: (res) => {
            if (res.message == 'OK') {
              this.dataUsuario = res;
            } else {
              this.dataUsuario = null;
              this.alertifyService.success(res.message);
            }
          }
        });
    } else {
      this.nombreSeccion = 'signup';
    }
    // Hacer scroll a un ID del componente
    this.scrolltoID(this.activatedRoute.snapshot.fragment);
  }

  scrolltoID(id: string | null) {
    if (id != null) {
      // Uso de setTimeout para no interferir con el Browser Animations Module
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor(id);
      }, 10);
    } else {
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor('signup');
      }, 10);
    }
  }

  crearForm() {
    this.formularioRegistro = this.fb.group({
      idCategoriaUsuario: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(45)]],
      apellido: ['', [Validators.required, Validators.maxLength(45)]],
      numeroTelefono: ['', [Validators.required, Validators.pattern("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\.\/0-9]*$")]],
      email: ['', [Validators.required, Validators.pattern("^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}$")]],
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30), matchValidator('samePassword', true)]],
      samePassword: ['', [Validators.required, matchValidator('password')]]
    });
  }

  // Metodo GET
  get f() {
    return this.formularioRegistro.controls;
  }

  // Validar si email esta registrado o no
  validarEmail() {
    this.f['email']?.valueChanges
      .subscribe(value => {
        const dataEmail = {
          correo: value
        };
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          if (this.f['email']?.valid) {
            this.usersService.validateEmail(dataEmail)
              .subscribe({
                next: (res) => {
                  if (res.message == 'OK') {
                    this.emailDuplicado = false;
                  } else if (res.message == 'Email ya registrado') {
                    this.emailDuplicado = true;
                  }
                }
              });
          } else {
            this.emailDuplicado = false;
          }
        }, 500);
      });
  }

  // Validar si username esta registrado o no
  validarUsername() {
    this.f['username']?.valueChanges
      .subscribe(value => {
        const dataUsername = {
          nombreUsuario: value
        };
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          if (this.f['username']?.valid) {
            this.usersService.validateUsername(dataUsername)
              .subscribe({
                next: (res) => {
                  if (res.message == 'OK') {
                    this.usernameDuplicado = false;
                  } else if (res.message == 'Nombre de usuario ya registrado') {
                    this.usernameDuplicado = true;
                  }
                }
              });
          } else {
            this.usernameDuplicado = false;
          }
        }, 500);
      })
  }

  // Registrar cuenta y redireccionar a signup-success
  registrarCuenta() {
    this.f['idCategoriaUsuario']?.setValue(this.tipoCuenta);
    if (this.formularioRegistro.valid && !(this.emailDuplicado || this.usernameDuplicado)) {
      this.asyncReq = true;
      this.formCompleto = true;
      const formData = {
        idCategoriaUsuario: this.f['idCategoriaUsuario']?.value,
        nombre: this.f['nombre']?.value,
        apellido: this.f['apellido']?.value,
        numeroTelefono: this.f['numeroTelefono']?.value,
        correo: this.f['email']?.value,
        nombreUsuario: this.f['username']?.value,
        clave: this.f['password']?.value
      };
      this.usersService.registerUser(formData)
        .subscribe({
          next: (res) => {
            if (res.data?.codigo == 0) {
              this.router.navigate([`/signup/${res.data.idUsuario}/${res.codigoConfirmacion}`], { fragment: 'signup-success' });
            } else {
              this.alertifyService.error(res.data?.message);
            }
          }
        }).add(() => {
          // Deshabilitar el icono de carga una vez finalizada la peticion
          this.asyncReq = false;
        });
    } else {
      this.formCompleto = false;
      this.formularioRegistro.markAllAsTouched();
    }
  }
  
  // Si la cuenta no esta verificada, enviar el enlace de registro al email
  enviarEnlaceEmail() {
    if (this.dataUsuario != null) {
      this.asyncReq = true;
      this.usersService.sendEmailRegister(this.dataUsuario?.data)
        .subscribe({
          next: (res) => {
            if (res.data?.codigo == 0) {
              this.alertifyService.success("Correo enviado");
            } else {
              this.alertifyService.error("Error al enviar correo");
            }
          }
        }).add(() => {
          // Deshabilitar el icono de carga una vez finalizada la peticion
          this.asyncReq = false;
        });
    }
  }

  // Funcion para seleccionar el tipo de cuenta del usuario
  seleccionarImagen(idImage) {
    if (idImage.id == 'student-img') {
      this.tipoCuenta = 3;
    }
    if (idImage.id == 'teacher-img') {
      this.tipoCuenta = 2;
    }
    this.f['idCategoriaUsuario']?.setValue(this.tipoCuenta);
  }

  // Funcion para mostrar la contraseña en el input
  mostrarPasswords(input: any, input2: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
    input2.type = input2.type === 'password' ? 'text' : 'password';
  }
}
