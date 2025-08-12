import {
  Component,
  OnInit,
  NgZone,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { LoadingController, NavController } from '@ionic/angular';
import { Feature } from 'src/app/interfaces/map.interface';
import { MapServiceService } from 'src/app/services/map-service.service';
import { Coordinates } from 'src/app/shared/types/coordinates.interface';
import { environment } from 'src/environments/environment';
import { IReport } from 'src/app/shared/types/report.interface';
import { Router } from '@angular/router';

const width = 52;
const height = 52;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() reports: IReport[] = [];
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() hasButton: boolean = true;
  @Input() searchField: boolean = true;
  @Output() selectedCoords: EventEmitter<Coordinates> = new EventEmitter();
  @ViewChild('mapa', { static: true }) mapContainer: ElementRef;
  addresses: string[] = [];
  selectedAddress = null;
  mapbox: mapboxgl.Map;
  currentMarkers = [];

  constructor(
    public zone: NgZone,
    private loadingController: LoadingController,
    private mapBoxService: MapServiceService,
    public navCtrl: NavController,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.buildMap();
  }

  async ionViewWillEnter() {
    this.buildMap();
  }

  buildMap() {
    this.mapbox = new mapboxgl.Map({
      container: 'mapbox',
      accessToken: environment.mapboxgl.accessToken,
      style: `mapbox://styles/mapbox/streets-v11`,
      zoom: 12,
      center: [this.latitude ? this.latitude : -74.297333, this.longitude ? this.longitude : 4.570868],
    });
    this.mapbox.addControl(new mapboxgl.NavigationControl());
    this.mapbox.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    this.resize();
  }

  ngOnChanges(changes) {
    this.currentMarkers.forEach((marker) => marker.remove());
    if (this.reports.length > 0) {
      this.reports.forEach((report) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(/assets/logo-sabuesos.png)`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';
        el.draggable = true;
        const marker = new mapboxgl.Marker(el)
          .setLngLat([report.longitude, report.latitude])
          .addTo(this.mapbox);
        this.currentMarkers.push(marker);
        marker.getElement().addEventListener('click', (e) => {
          this.navCtrl.navigateRoot(['main-tab/view-report', report._id, this.router.url], { replaceUrl: true });
        });
      })
      this.mapbox.flyTo({
        center: [changes.reports.currentValue[0].longitude, changes.reports.currentValue[0].latitude],
        speed: 0.8
      })
      this.resize();
    } else {
      setTimeout(()=> {
        this.resize();
      }, 100)
    }
  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapBoxService
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.addresses = features.map((feat) => feat.place_name);
        });
    } else {
      this.addresses = [];
    }
  }

  onSelect(address?: string) {
    if (address) {
      this.selectedAddress = address;
      this.addresses = [];
    }
  }

  onSubmit() {
    this.selectedCoords.emit();
  }

  resize() {
    var mapDiv = document.getElementById('mapbox');
    mapDiv.style.width = '100%';
    mapDiv.style.height = '950px';
    this.mapbox.resize();
  }
}
