import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.page.html',
  styleUrls: ['./donations.page.scss'],
})
export class DonationsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async openVakiLink() {
    window.open('https://vaki.co/es/vaki/sabuesos', '_blank');
  }

}
