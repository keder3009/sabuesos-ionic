import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CitiesService, ICities } from 'src/app/services/cities.service';
import { EntityService } from 'src/app/services/entity.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PetService } from 'src/app/services/pet.service';
import { UserService } from 'src/app/services/user.service';
import { IEntity } from 'src/app/shared/types/entity.interface';
import { FolderPath } from 'src/app/shared/types/folder.interfaces';
import { AllValidationErrors, getFormValidationErrors, searchFormError } from 'src/app/shared/types/get-errors-form';
import { IPet } from 'src/app/shared/types/pet.interface';
import { Role } from 'src/app/shared/types/role.interface';
import { IUser } from 'src/app/shared/types/user.interface';
import { FileData } from "../../shared/types/file-data.interface";
import { CalendarService } from "../../services/calendar.service";
import { IDate } from "../../interfaces/date-array.interfase";
import { Router } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  checkData = {
    label: 'Si',
    selected: false,
  };
  public cities: ICities[] = [];
  public userInfo: any;
  public entityInfo: IEntity;
  public petInfo: IPet;
  public userForm: FormGroup;
  public entityForm: FormGroup;
  public emailPattern: any =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public userEmail: string;
  public hasPet: boolean;
  public savePetInfo = false;
  public showDatePickerUser = false;
  public showDatePickerPet = false;
  public temporalImages: FileData[] = [];
  public isRegularUser: boolean;
  public petSelectList: any[] = [
    { value: 0, label: 'Perro' },
    { value: 1, label: 'Gato' },
    { value: 2, label: 'Otro' }
  ]
  constructor(
    // private camera: Camera,
    private fb: FormBuilder, private alertService: AlertService, private userService: UserService,
    public navCtrl: NavController, private authService: AuthService, private citiesService: CitiesService,
    private petService: PetService, private datePipe: DatePipe, private firebaseService: FirebaseService,
    private loadingService: LoadingService, private entityService: EntityService,
    private calendarService: CalendarService,
    private router: Router,
  ) {
  }

  async ionViewWillEnter() {
    this.buildUserForm();
    this.buildEntityForm();
    this.entityForm.reset();
    this.userForm.reset();
    await this.getSelectorsOptions();
  }

  /**
   * get select options
   */
  async getSelectorsOptions() {
    try {
      await this.loadingService.showLoading('profile');
      this.userEmail = null;
      this.petInfo = null;
      this.temporalImages = [];
      this.userEmail = await this.authService.getUserActive();
      this.cities = await this.citiesService.getCities();
      if (await this.authService.getRoleUserActive() !== '2') {
        this.userInfo = await this.userService.getUserByEmail(this.userEmail);
        this.isRegularUser = true;
        if (this.userInfo && this.userInfo.hasPet) {
          this.petInfo = await this.petService.getPetByIdUser(this.userInfo._id);
        }
        this.hasPet = this.userInfo.hasPet;
        this.setInfoForms();
      } else {
        this.isRegularUser = false;
        this.entityInfo = await this.entityService.getEntityByEmail(this.userEmail);
        this.setEntityForms();
      }
      await this.loadingService.hideLoading('profile');
    } catch (error) {
      await this.loadingService.hideLoading();
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error al intentar obtener la información. Intentelo de nuevo');
    }
  }

  /**
   * Buil user form
   */
  public buildUserForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(60),]],
      birthDateUserDay: ['', [Validators.pattern('[0-3][0-9]'), Validators.minLength(2)]],
      birthDateUserMonth: ['', [Validators.pattern('[0-1][0-9]'), Validators.minLength(2)]],
      birthDateUserYear: ['', [Validators.pattern('[1-2][0-9][0-9][0-9]'), Validators.minLength(4)]],
      email: ['', [Validators.pattern(this.emailPattern), Validators.required, Validators.maxLength(60)]],
      city: ['', [Validators.required]],
      namePet: ['', [Validators.required, Validators.maxLength(60),]],
      typePet: ['', [Validators.required, Validators.maxLength(60)]],
      race: ['', [Validators.required]],
      birthDatePetDay: ['', [Validators.pattern('[0-3][0-9]'), Validators.minLength(2)]],
      birthDatePetMonth: ['', [Validators.pattern('[0-1][0-9]'), Validators.minLength(2)]],
      birthDatePetYear: ['', [Validators.pattern('[1-2][0-9][0-9][0-9]'), Validators.minLength(4)]],
      hasPet: [''],
    })
  }
  /**
   * build entity form
   */
  public buildEntityForm() {
    this.entityForm = this.fb.group({
      nameOrganization: ['', [Validators.required, Validators.maxLength(60),]],
      NIT: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      email: ['', [Validators.pattern(this.emailPattern), Validators.required, Validators.maxLength(60)]],
      phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(11)]],
      contactPerson: ['', [Validators.required, Validators.maxLength(60)]],
      city: ['', [Validators.required]],
      picture: [''],
      address: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
      webpage: ['', [Validators.required, Validators.maxLength(120)]],
      socialNetworks: ['', [Validators.maxLength(120)]],
      facebook: ['', [Validators.maxLength(120)]],
      twitter: ['', [Validators.maxLength(120)]],
    });
  }

  /**
   * Set form
   */
  public setInfoForms() {
    let birthDateUser = [];
    let birthDatePet = [];
    if (this.userInfo.birthDate) {
      birthDateUser = this.datePipe.transform(this.userInfo.birthDate, 'dd-MM-yyyy').split('-');
    }
    if (this.userInfo.picture) {
      this.temporalImages = [];
      this.temporalImages.push((this.userInfo.picture));
    }
    if (this.petInfo && this.petInfo.birthDate) {
      birthDatePet = this.datePipe.transform(this.petInfo.birthDate, 'dd-MM-yyyy').split('-');
    }
    if (this.petInfo) {
      this.userForm.get('hasPet').disable();
      this.userForm.patchValue({
        name: this.userInfo.name ? this.userInfo.name : '',
        birthDateUserDay: this.userInfo.birthDate ? birthDateUser[0] : '',
        birthDateUserMonth: this.userInfo.birthDate ? birthDateUser[1] : '',
        birthDateUserYear: this.userInfo.birthDate ? birthDateUser[2] : '',
        email: this.userInfo.email ? this.userInfo.email : '',
        city: this.userInfo.city ? this.userInfo.city : '',
        namePet: this.petInfo.name,
        hasPet: true,
        typePet: this.petInfo.typePet,
        race: this.petInfo.race,
        birthDatePetDay: birthDatePet[0],
        birthDatePetMonth: birthDatePet[1],
        birthDatePetYear: birthDatePet[2],
      })
    } else {
      this.userForm.get('hasPet').enable();
      this.userForm.patchValue({
        name: this.userInfo.name ? this.userInfo.name : '',
        birthDateUserDay: this.userInfo.birthDate ? birthDateUser[0] : '',
        birthDateUserMonth: this.userInfo.birthDate ? birthDateUser[1] : '',
        birthDateUserYear: this.userInfo.birthDate ? birthDateUser[2] : '',
        email: this.userInfo.email ? this.userInfo.email : '',
        city: this.userInfo.city ? this.userInfo.city : '',
        hasPet: false,
        namePet: '',
        typePet: '',
        race: '',
        birthDatePet: '',
      })
    }
  }

  /**
 * Set form
 */
  public setEntityForms() {
    this.entityForm.patchValue({
      nameOrganization: this.entityInfo.name,
      NIT: this.entityInfo.document,
      email: this.entityInfo.email,
      phone: this.entityInfo.phone,
      contactPerson: this.entityInfo.contactPerson,
      city: this.entityInfo.city,
      picture: this.entityInfo.picture ? this.entityInfo.picture : null,
      address: this.entityInfo.address ? this.entityInfo.address : '',
      webpage: this.entityInfo.webpage ? this.entityInfo.webpage : '',
      socialNetworks: this.entityInfo.socialNetworks ? this.entityInfo.socialNetworks : '',
      facebook: this.entityInfo.facebook ? this.entityInfo.facebook : '',
      twitter: this.entityInfo.twitter ? this.entityInfo.twitter : '',
    })
  }

  private checkDateUser(): boolean {
    return this.calendarService.checkIsDateValid(
      this.userForm.get('birthDateUserDay')?.value.toString().concat('/')
        .concat(this.userForm.get('birthDateUserMonth')?.value).concat('/')
        .concat(this.userForm.get('birthDateUserYear')?.value)
    )
  }

  private checkDatePet(): boolean {
    return this.calendarService.checkIsDateValid(
      this.userForm.get('birthDatePetDay')?.value.toString().concat('/')
        .concat(this.userForm.get('birthDatePetMonth')?.value).concat('/')
        .concat(this.userForm.get('birthDatePetYear')?.value)
    )
  }

  /**
   * On submit
   */
  async onSubmit() {
    try {
      this.loadingService.showLoading();
      if (this.isRegularUser) {
        this.checkPetData();
        if (this.userForm.valid) {
          let dateBirthdayUser;
          if (this.userForm.get('birthDateUserDay')?.value
            && this.userForm.get('birthDateUserMonth')?.value
            && this.userForm.get('birthDateUserYear')?.value) {
            if (!this.checkDateUser()) {
              this.loadingService.hideLoading();
              this.alertService.infoAlert('Ingrese una fecha válida para el usuario e intente de nuevo.');
              return;
            } else {
              const iDateUser: IDate = {
                year: this.userForm.get('birthDateUserYear')?.value,
                month: this.userForm.get('birthDateUserMonth')?.value,
                day: this.userForm.get('birthDateUserDay')?.value
              }
              dateBirthdayUser = this.calendarService.convertStringToDate(iDateUser);
            }
          }
          let picture: FileData[] = [];
          for (const filePicture of this.temporalImages) {
            picture.push(
              {
                name: filePicture.name,
                url: await this.firebaseService.uploadImage(FolderPath.PROFILES, filePicture.url)
              })
          }
          let petForm: IPet;
          const userForm: IUser = {
            name: this.userForm.get('name')?.value,
            birthDate: dateBirthdayUser ? dateBirthdayUser : null,
            email: this.userForm.get('email')?.value,
            city: this.userForm.get('city')?.value,
            role: Role.USER,
            password: this.userInfo.password,
            hasPet: this.userForm.get('hasPet')?.value ? this.userForm.get('hasPet')?.value : null,
            picture: picture.length > 0 ? picture[0] : null,
          }
          await this.userService.updateUser(this.userInfo._id, userForm);
          let dateBirthdayPet;
          if (this.userForm.get('birthDatePetDay')?.value
            && this.userForm.get('birthDatePetMonth')?.value
            && this.userForm.get('birthDatePetYear')?.value) {
            if (!this.checkDatePet()) {
              this.loadingService.hideLoading();
              this.alertService.infoAlert('Ingrese una fecha válida para la mascota e intente de nuevo.');
              return;
            } else {
              const iDatePet: IDate = {
                year: this.userForm.get('birthDatePetYear')?.value,
                month: this.userForm.get('birthDatePetMonth')?.value,
                day: this.userForm.get('birthDatePetDay')?.value
              }
              dateBirthdayPet = this.calendarService.convertStringToDate(iDatePet);
            }
          }
          petForm = {
            name: this.userForm.get('namePet')?.value,
            birthDate: dateBirthdayPet ? dateBirthdayPet : null,
            race: this.userForm.get('race')?.value,
            typePet: this.userForm.get('typePet')?.value,
          }
          if (!this.petInfo && this.userForm.get('hasPet').value) {
            const petCreated = await this.petService.createPet(petForm);
            await this.petService.addUser(petCreated._id, this.userInfo.email);
          } else if (this.petInfo) {
            const petUpdated = await this.petService.updatePet(this.petInfo._id, petForm);
            await this.petService.addUser(petUpdated._id, this.userInfo.email);
          }
          this.loadingService.hideLoading();
          this.alertService.presentToast('Se ha actualizado exitosamente la información del usuario.');
          this.userForm.reset();
          this.goToMainPage();
        } else {
          this.loadingService.hideLoading();
          const errorForm: AllValidationErrors = getFormValidationErrors(
            this.userForm.controls
          ).shift() as any;
          this.alertService.infoAlert(searchFormError(errorForm));
        }
        this.loadingService.hideLoading();
      } else {
        if (this.entityForm.valid) {
          const entityForm: IEntity = {
            name: this.entityForm.get('nameOrganization')?.value,
            email: this.entityForm.get('email')?.value,
            city: this.entityForm.get('city')?.value,
            document: this.entityForm.get('NIT')?.value,
            phone: this.entityForm.get('phone')?.value,
            contactPerson: this.entityForm.get('contactPerson')?.value,
            address: this.entityForm.get('address')?.value,
            webpage: this.entityForm.get('webpage')?.value,
            facebook: this.entityForm.get('facebook')?.value,
            twitter: this.entityForm.get('twitter')?.value,
            socialNetworks: this.entityForm.get('socialNetworks')?.value,
            role: Role.ENTITY,
          }
          this.loadingService.hideLoading();
          await this.entityService.updateEntity(this.entityInfo._id, entityForm);
          this.alertService.presentToast('Se ha actualizado exitosamente la información del usuario.').then(() => {
            this.entityForm.reset();
            this.goToMainPage();
          }
          );
        } else {
          this.loadingService.hideLoading();
          const errorForm: AllValidationErrors = getFormValidationErrors(
            this.entityForm.controls
          ).shift() as any;
          this.alertService.infoAlert(searchFormError(errorForm));
        }
      }
    } catch (error) {
      this.loadingService.hideLoading();
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error al intentar actualizar la información. Intentelo de nuevo');
    }
  }

  /**
   * check if pet data it's full
   */
  private checkPetData() {
    if (!this.userForm.get('hasPet').value) {
      this.userForm.controls['namePet']?.setErrors(null);
      this.userForm.controls['birthDatePetDay']?.setErrors(null);
      this.userForm.controls['birthDatePetMonth']?.setErrors(null);
      this.userForm.controls['birthDatePetYear']?.setErrors(null);
      this.userForm.controls['race']?.setErrors(null);
      this.userForm.controls['typePet']?.setErrors(null);
    }
  }

  getPictureToFile(event: any) {
    this.temporalImages.push(
      { name: event.target.files[0].name, url: event.target.files[0] }
    );
  }

  /**
   * Change select option
   */
  checkSelected() {
    this.checkData.selected = !this.checkData.selected;
    this.savePetInfo = !this.savePetInfo;
  }

  /**
   * Go to main page
   */
  goToMainPage() {
    this.navCtrl.navigateForward(['main-tab/list-reports']);
  }

  deleteFile(index: number) {
    if (this.temporalImages.length === 1) {
      this.temporalImages = [];
    } else {
      this.temporalImages.splice(index, 1);
    }
  }
  deleteAccount() {
    this.alertService.infoAlert('Deseas eliminar tu cuenta?', 'Aceptar', () => this.onDeleteUser());
  }

  async onDeleteUser() {
    try {
      await this.loadingService.showLoading('profile');
      this.userEmail = await this.authService.getUserActive();
      if (!this.userInfo) {
        this.userInfo = await this.userService.getUserByEmail(this.userEmail);
      } 
      await this.userService.deleteUser(this.userInfo._id);
      this.router.navigateByUrl('main-tab/log-out');
    } catch (error) {
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error al intentar eliminar la cuenta. Intentelo de nuevo');
    } finally {
      await this.loadingService.hideLoading();
    }
  }
}
