import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/account/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(private _builder: FormBuilder, private _alertCtrl: AlertController,
    private _navCtrl: NavController, private _menuCtrl: MenuController,
    private _service: UserService) {
    this.loginForm = _builder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }

  private async showAlert() {
    const alert = await this._alertCtrl.create({
      subHeader: "Incorrect Email/Password",
      message: "Please try again.",
      buttons: ["Try Again"]
    });

    await alert.present();
  }

  login() {
    let data = this.loginForm.value;

    this._service.login(data).subscribe((result) => {
      localStorage.setItem("currentUser", JSON.stringify(result));
      this._navCtrl.navigateForward("/");
    }, () => {
      this.showAlert();
    });
  }

  toggleVisiblePassword() {
    this.showPassword = !this.showPassword;
  }

  ionViewWillEnter() {
    this._menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    this._menuCtrl.enable(true);
  }

  ngOnInit() {
  }

}
