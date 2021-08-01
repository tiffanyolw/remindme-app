import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/account/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  showPassword: boolean = false;

  constructor(private _builder: FormBuilder, private _alertCtrl: AlertController,
    private _navCtrl: NavController, private _menuCtrl: MenuController,
    private _service: UserService) {
    this.registerForm = _builder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }

  private async showAlert(subHeader: string, message: string, buttons: any[], backdropDismiss?: boolean) {
    const alert = await this._alertCtrl.create({
      subHeader,
      message,
      buttons
    });

    await alert.present();
  }

  register() {
    let data = this.registerForm.value;
    this._service.register(data).subscribe((result) => {
      this.showAlert("Registered",
        "Successfully created an account.",
        [{
          text: "Log In",
          handler: () => {
            this._navCtrl.navigateForward("login");
          }
        }]);
        this.registerForm.reset();
    }, () => {
      this.showAlert("Could not register a new account", "Please try again.", ["Try Again"]);
    });
  }

  toggleVisiblePassword() {
    this.showPassword = !this.showPassword;
  }

  ionViewWillEnter() {
    this._menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this._menuCtrl.enable(true);
  }

  ngOnInit() {
  }

}
