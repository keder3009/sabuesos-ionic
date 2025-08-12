import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-adoptions-form',
  templateUrl: './adoptions-form.page.html',
  styleUrls: ['./adoptions-form.page.scss'],
})
export class AdoptionsFormPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  async ngOnInit() {}

  onSubmit() {}
}
