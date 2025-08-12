import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonDatetime, LoadingController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AllValidationErrors, getFormValidationErrors, searchFormError } from 'src/app/shared/types/get-errors-form';
import { IReport, StatusPost, TypePost } from 'src/app/shared/types/report.interface';
import { UserService } from 'src/app/services/user.service';
import { CitiesService, ICities } from 'src/app/services/cities.service';
import { IUser } from 'src/app/shared/types/user.interface';
import { ReportService } from 'src/app/services/report.service';
import { IPet } from 'src/app/shared/types/pet.interface';
import { PetService } from 'src/app/services/pet.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from 'src/app/services/loading.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderPath } from 'src/app/shared/types/folder.interfaces';
import { IEntity } from 'src/app/shared/types/entity.interface';
import { EntityService } from 'src/app/services/entity.service';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { NotificationService } from 'src/app/services/notification.service';
import { INotification } from 'src/app/shared/types/notification.interface';
import { FileData } from "../../shared/types/file-data.interface";
import { CalendarService } from "../../services/calendar.service";
import { IDate } from "../../interfaces/date-array.interfase";

declare var window: any;

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.page.html',
  styleUrls: ['./create-report.page.scss'],
})
export class CreateReportPage implements OnInit {
  public latitude: number = null;
  public longitude: number = null;
  public createReportForm: FormGroup;
  public lostCheckStatus = true;
  public findCheckStatus = false;
  public adpotedCheckStatus = false;
  public cities: ICities[] = [];
  public userInfo: any;
  public temporalFiles: FileData[] = [];
  public temporalFilesUpdate: FileData[] = [];
  public reportCreated: IReport;
  public email: string;
  public showDatePicker = false;
  public reportInfo: IReport;
  public petInfo: IPet;
  public entityInfo: IEntity;
  public isUpdate = false;
  public routePrevious: string = '';
  public nativeGeocoderResult: NativeGeocoderResult;
  public currentId: string = '';
  public petSelectList: any[] = [
    { value: 0, label: 'Perro' },
    { value: 1, label: 'Gato' },
    { value: 2, label: 'Otro' }
  ];
  public optionTypeReport: any[] = [
    { value: 0, label: 'Extraviado' },
    { value: 1, label: 'Encontrado' },
    { value: 2, label: 'Adopción' }
  ];

  public optionTypeReportEntities: any[] = [
    { value: 0, label: 'Extraviado' },
    { value: 1, label: 'Encontrado' },
    { value: 2, label: 'Adopción' }
  ];
  public isEntity: boolean;

  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(
    // private camera: Camera,
    public navCtrl: NavController,
    private fb: FormBuilder,
    private alertService: AlertService,
    private userService: UserService,
    private citiesService: CitiesService,
    private reportService: ReportService,
    private petService: PetService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private loadingService: LoadingService,
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private entityService: EntityService,
    private router: Router,
    private nativeGeocoder: NativeGeocoder,
    private notificationService: NotificationService,
    private calendarService: CalendarService,
  ) {
    this.createReportForm = this.fb.group({
      namePet: ['', [Validators.maxLength(60),]],
      typePet: ['', [Validators.required, Validators.maxLength(60)]],
      race: ['', [Validators.required]],
      birthDatePetDay: ['', [Validators.pattern('[0-3][0-9]'), Validators.minLength(2)]],
      birthDatePetMonth: ['', [Validators.pattern('[0-1][0-9]'), Validators.minLength(2)]],
      birthDatePetYear: ['', [Validators.pattern('[1-2][0-9][0-9][0-9]'), Validators.minLength(4)]],
      description: ['', [Validators.required, Validators.maxLength(250),]],
      checkOption: [''],
      files: ['']
    })
  }

  async ngOnInit() {
    this.userInfo = await this.authService.getUser();
    await this.getSelectorsOptions();
    const idUpdate = this.activatedRoute.snapshot.paramMap.get('id');
    this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
    this.isEntity = await this.authService.getRoleUserActive() !== '2' ? false : true;
    if (idUpdate) {
      this.updateReport(idUpdate)
    } else {
      this.isUpdate = false;
    }
  }

  async ionViewWillEnter() {
    await this.getSelectorsOptions();
    const idUpdate = this.activatedRoute.snapshot.paramMap.get('id');
    this.routePrevious = this.activatedRoute.snapshot.paramMap.get('route');
    this.isEntity = await this.authService.getRoleUserActive() !== '2' ? false : true;
    if (idUpdate) {
      this.updateReport(idUpdate)
    } else {
      this.isUpdate = false;
    }
    this.temporalFiles = [];
    this.temporalFilesUpdate = [];
  }

  async updateReport(id: string) {
    try {
      await this.loadingService.showLoading();
      this.isUpdate = true;
      this.reportInfo = await this.reportService.getReportById(id);
      this.petInfo = await this.petService.getPetById(this.reportInfo.pets._id);
      if (this.reportInfo.filesUrl) {
        this.temporalFiles = [];
        this.temporalFilesUpdate = [];
        this.temporalFiles = this.reportInfo.filesUrl;
      }
      this.setForm();
      await this.loadingService.hideLoading();
    } catch (error) {
      await this.loadingService.hideLoading();
      console.error(error);
      this.alertService.presentToast('Ocurrio un error. Verifique con soporte o intente nuevamente')
    }
  }

  /**
   * set form
   */
  public setForm() {
    let birthDatePet = [];
    if (this.petInfo.birthDate) {
      birthDatePet = this.datePipe.transform(this.petInfo.birthDate, 'dd-MM-yyyy').split('-');
    }
    this.createReportForm.patchValue({
      namePet: this.petInfo.name,
      typePet: this.petInfo.typePet,
      race: this.petInfo.race,
      birthDatePetDay: this.petInfo.birthDate ? birthDatePet[0] : '',
      birthDatePetMonth: this.petInfo.birthDate ? birthDatePet[1] : '',
      birthDatePetYear: this.petInfo.birthDate ? birthDatePet[2] : '',
      description: this.reportInfo.description,
      checkOption: this.reportInfo.typePost,
    })
  }

  /**
   * get selectors
   */
  async getSelectorsOptions() {
    try {
      this.email = await this.authService.getUserActive();
      this.cities = await this.citiesService.getCities();
      if (await this.authService.getRoleUserActive() !== '2') {
        if (!this.userInfo) {
          this.userInfo = await this.userService.getUserByEmail(this.email);
        }
      } else {
        this.entityInfo = await this.entityService.getEntityByEmail(this.email);
      }
      this.loadingService.hideLoading();
    } catch (error) {
      this.loadingService.hideLoading();
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error al obtener los selectores');
    }
  }
  private checkDate(): boolean {
    return this.calendarService.checkIsDateValid(
      this.createReportForm.get('birthDatePetDay').value.toString().concat('/')
        .concat(this.createReportForm.get('birthDatePetMonth').value).concat('/')
        .concat(this.createReportForm.get('birthDatePetYear').value)
    )
  }

  /**
   * On Submit
   */
  async onSubmit() {
    try {
      this.loadingService.showLoading();
      await this.getGeolocation();
      if (this.latitude === null || this.longitude === null) {
        this.loadingService.hideLoading();
        this.alertService.infoAlert('Active el GPS e intente de nuevo.');
        return;
      }
      if (this.createReportForm.valid) {
        let dateBirthdayPet;
        if (this.createReportForm.get('birthDatePetDay')?.value
          && this.createReportForm.get('birthDatePetMonth')?.value
          && this.createReportForm.get('birthDatePetYear')?.value) {
          if (!this.checkDate()) {
            this.loadingService.hideLoading();
            this.alertService.infoAlert('Ingrese una fecha válida e intente de nuevo.');
            return;
          } else {
            const iDate: IDate = {
              year: this.createReportForm.get('birthDatePetYear')?.value,
              month: this.createReportForm.get('birthDatePetMonth')?.value,
              day: this.createReportForm.get('birthDatePetDay')?.value
            }
            dateBirthdayPet = this.calendarService.convertStringToDate(iDate);
          }
        }
        let picture: FileData[] = [];
        if (!this.isUpdate) {
          for (const filePicture of this.temporalFiles) {
            picture.push(
              {
                name: filePicture.name,
                url: await this.firebaseService.uploadImage(FolderPath.REPORTS, filePicture.url)
              })
          }
        } else {
          for (const filePictureUpdate of this.temporalFilesUpdate) {
            picture.push(
              {
                name: filePictureUpdate.name,
                url: await this.firebaseService.uploadImage(FolderPath.REPORTS, filePictureUpdate.url)
              })
          }
          picture.push(...this.temporalFiles);
        }
        const petForm: IPet = {
          name: this.createReportForm.get('namePet')?.value ? this.createReportForm.get('namePet')?.value : 'NOMBRE DESCONOCIDO',
          birthDate: dateBirthdayPet ? dateBirthdayPet : null,
          race: this.createReportForm.get('race')?.value,
          typePet: this.createReportForm.get('typePet')?.value,
        }
        if (!this.isUpdate) {
          const petInfo = await this.petService.createPet(petForm);
          const reportForm: IReport = {
            description: this.createReportForm.get('description')?.value,
            latitude: this.latitude,
            longitude: this.longitude,
            typePost: this.createReportForm.get('checkOption')?.value,
            status: StatusPost.ACTIVE,
            reported: false,
            actorRole: this.userInfo ? this.userInfo.role : this.entityInfo.role,
            petId: petInfo._id,
            filesUrl: picture.length > 0 ? picture : [{ name: 'not found', url: "./assets/img_pets/dont_found.png" }],
            nativeGeocoderResult: this.nativeGeocoderResult,
          }
          if (this.userInfo && this.userInfo._id) {
            reportForm.userId = this.userInfo._id;
            this.currentId = this.userInfo._id;
          } else if (this.entityInfo && this.entityInfo._id) {
            reportForm.entityId = this.entityInfo._id;
            this.currentId = this.entityInfo._id;
          }

          this.reportCreated = await this.reportService.createReport(reportForm);

        } else {
          const petInfo = await this.petService.updatePet(this.petInfo._id, petForm);
          const reportForm: IReport = {
            description: this.createReportForm.get('description')?.value,
            latitude: this.latitude,
            longitude: this.longitude,
            typePost: this.createReportForm.get('checkOption')?.value,
            status: StatusPost.ACTIVE,
            reported: false,
            actorRole: this.userInfo ? this.userInfo.role : this.entityInfo.role,
            petId: petInfo._id,
            filesUrl: picture.length > 0 ? picture : [{ name: 'not found', url: "./assets/img_pets/dont_found.png" }],
            nativeGeocoderResult: this.nativeGeocoderResult,
          }
          if (this.userInfo && this.userInfo._id) {
            reportForm.userId = this.userInfo._id;
          } else if (this.entityInfo && this.entityInfo._id) {
            reportForm.entityId = this.entityInfo._id;
          }
          this.reportCreated = await this.reportService.updateReport(this.reportInfo._id, reportForm);
        }
        this.alertService.presentToast('Se ha creado el reporte exitosamente.');
        this.sendNotificationPush();
        this.cancel();
        this.loadingService.hideLoading()
      } else {
        const errorForm: AllValidationErrors = getFormValidationErrors(
          this.createReportForm.controls
        ).shift() as any;
        this.alertService.infoAlert(searchFormError(errorForm));
      }
      this.loadingService.hideLoading()
    } catch (error) {
      this.loadingService.hideLoading()
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error al crear el reporte. Intentelo de nuevo');
    }
  }

  public async sendNotificationPush() {
    try {
      const name = this.userInfo ? this.userInfo.name : this.entityInfo.name;
      const notification: INotification = {
        title: 'SabueSOS',
        bodyMessage: `Ayuda a ${name} a ${this.createReportForm.get('checkOption')?.value === 0 ? 'encontrar a' : this.createReportForm.get('checkOption')?.value === 1 ? 'hallar el dueño de' : 'encontrar un hogar para'} ${this.createReportForm.get('namePet')?.value ? this.createReportForm.get('namePet')?.value : 'NOMBRE DESCONOCIDO'}`,
        nativeGeocoderResult: this.nativeGeocoderResult,
        userSend: this.currentId
      }
      await this.notificationService.createNotification(notification);
      this.loadingService.hideLoading()
    } catch (error) {
      this.loadingService.hideLoading()
      console.error(error);
      this.alertService.infoAlert('Ocurrio un error en el envío de la notificación push.')
    }
  }

  /**
   * Get geolocation
   */
  async getGeolocation() {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        const coordinates = await Geolocation.getCurrentPosition();
        this.latitude = coordinates.coords.latitude;
        this.longitude = coordinates.coords.longitude;

        await this.nativeGeocoder.reverseGeocode(this.latitude, this.longitude, this.options)
          .then((result: NativeGeocoderResult[]) => {
            this.nativeGeocoderResult = result[0];
          })
          .catch((error: any) => {
            console.error(error);
          });
      } else {
        console.error('Location permission not granted');
      }
    } catch (error) {
      console.error('Error getting location', error);
      this.alertService.infoAlert('Ocurrio un error al obtener la ubicación.');
    }
  }

  /**
     * UploadPhoto by device
     * @param event
     */
  async uploadPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        source: CameraSource.Photos,
        resultType: CameraResultType.Uri,
      });
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      const fileData: any = {
        name: "photo.jpg",
        url: new File([blob], "photo.jpg", { type: "image/jpeg" }),
      };
      console.log(fileData);
      if (this.isUpdate) {
        this.temporalFilesUpdate.push(fileData);
      } else {
        this.temporalFiles.push(fileData);
      }
    } catch (error) {
      console.error('Error al subir la foto', error);
      this.alertService.presentToast('Ocurrió un error al cargar la foto');
    }
  }

  /**
   * Open the map
   */
  openMap() {
    if (this.reportCreated) {
      this.navCtrl.navigateForward(['main-tab/map-report', this.reportCreated._id]);
    } else {
      this.alertService.infoAlert('Debe registrar primero un reporte antes de cambiar la ubicación.')
    }
  }

  /**
   * cancel => forward to main page
   */
  cancel() {
    this.createReportForm.reset();
    this.navCtrl.navigateForward(['main-tab/list-reports']);
  }

  /**
   * Change date
   * @param date
   */
  dateChanged(date: IonDatetime) {
    this.createReportForm.get('birthDate').setValue(this.datePipe.transform(date.value.toString(), 'dd-MM-yyyy'));
    this.showDatePicker = false;
  }

  deleteFile(index: number) {
    if (this.temporalFiles.length === 1) {
      this.temporalFiles = [];
    } else {
      this.temporalFiles.splice(index, 1);
    }
  }
}
