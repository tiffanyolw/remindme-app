import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { Constants } from 'src/app/data/constants';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/account/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: User;
  updateUserForm: FormGroup;
  minPasswordLen: number = Constants.passwordMinLength;
  showCurrentPassword = false;
  showNewPassword = false;

  constructor(private _toastCtrl: ToastController, private _alertCtrl: AlertController,
    private _builder: FormBuilder, private _userService: UserService) { }

  private async showToast(message: string) {
    const toast = await this._toastCtrl.create({
      message,
      duration: 2000
    });

    toast.present();
  }

  private async showAlert(header?: string, message?: string, buttons?: any[]) {
    const alert = await this._alertCtrl.create({
      header,
      message,
      buttons
    });

    await alert.present();
  }

  private update(body: User) {
    this._userService.updateUser(body).subscribe((result) => {
      this.showToast("Successfully updated");
      localStorage.setItem("currentUser", JSON.stringify(result));
    }, () => {
      this.showAlert("Error", "Could not update user. Please try again.", ["Try again"]);
    });
  }

  onUpdateFirstName() {
    let body = this.user;
    body.firstName = this.firstNameCtrl.value;

    this.update(body);
  }

  onUpdateLastName() {
    let body = this.user;
    body.lastName = this.lastNameCtrl.value;

    this.update(body);
  }

  onUpdateEmail() {
    let body = this.user;
    body.email = this.emailCtrl.value;

    this.update(body);
  }

  onUpdatePassword() {
    let body: any = {};
    body.newPassword = this.newPasswordCtrl.value;
    body.currentPassword = this.currentPasswordCtrl.value;

    this._userService.updateUserPassword(body).subscribe((result) => {
      this.showToast("Password successfully updated");
      localStorage.setItem("currentUser", JSON.stringify(result));
      this.updateUserForm.reset({
        firstName: this.firstNameCtrl.value,
        lastName: this.lastNameCtrl.value,
        email: this.emailCtrl.value
      });
    }, () => {
      this.showAlert("Error", "Could not update password. Please ensure you have the correct password and try again.", ["Try again"]);
    });
  }

  toggleVisibleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleVisibleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  get firstNameCtrl() {
    return this.updateUserForm.get("firstName");
  }

  get lastNameCtrl() {
    return this.updateUserForm.get("lastName");
  }

  get emailCtrl() {
    return this.updateUserForm.get("email");
  }

  get currentPasswordCtrl() {
    return this.updateUserForm.get("currentPassword");
  }

  get newPasswordCtrl() {
    return this.updateUserForm.get("newPassword");
  }

  ionViewWillEnter() {
    this.user = this._userService.getCurrentUser();

    this.updateUserForm = this._builder.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      currentPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required, Validators.minLength(this.minPasswordLen)]]
    });
  }

  ngOnInit() {
  }

}
