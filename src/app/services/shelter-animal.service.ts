import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IShelterAnimal, IShelterAnimalsResponse } from '../shared/types/shelter-animal.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShelterAnimalService {
  private _baseUrl = 'https://api.sabuesos.com.co/public/animals';

  constructor(private http: HttpClient) {}
  getShelterAnimals(page: number = 1, pageSize: number = 20, sort: string = 'createdAt', dir: string = 'desc'): Observable<IShelterAnimalsResponse> {
//   getShelterAnimals(page: number = 1, pageSize: number = 20, sort: string = 'createdAt', dir: string = 'desc'): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS']);
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('q', '')
      .set('sort', sort)
      .set('dir', dir)
      .set('includeInAdoption', 'false');
    //   const data:any = {
//     "data": [
//         {
//             "id": 49,
//             "speciesId": 1,
//             "name": "Uva",
//             "sexId": 2,
//             "approxAgeMonths": 24,
//             "birthDate": "2024-03-09T00:00:00.000Z",
//             "sizeId": 4,
//             "temperamentId": 1,
//             "colorId": 1,
//             "breedId": "1",
//             "microchip": "991003003382019",
//             "behavior": "Ingresa como rescate en estado de gestacion. Actualmente es una canina muy alegre y juguetona, disfruta el contacto fisico con personas y otros animales.",
//             "animalNeeds": "Requiere un hogar responsable y afectuoso que le brinde compañía, juego y actividad física acorde a su nivel de energía. Necesita un ambiente estable con interacción positiva para fortalecer su vínculo con personas y otros animales, además de paseos diarios, estimulación y enriquecimiento ambiental.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-03-09T20:11:23.199Z",
//             "updatedAt": "2026-03-12T16:49:46.739Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 4,
//                 "code": "large",
//                 "label": "Grande"
//             },
//             "temperament": {
//                 "id": 1,
//                 "code": "active",
//                 "label": "Activo"
//             },
//             "color": {
//                 "id": 1,
//                 "code": "black",
//                 "label": "Negro",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 233,
//                     "animalId": "49",
//                     "url": "/uploads/animals/49/1773087084303_f83aux.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-03-09T20:11:24.569Z"
//                 },
//                 {
//                     "id": 234,
//                     "animalId": "49",
//                     "url": "/uploads/animals/49/1773087235094_8fjupk.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:13:55.309Z"
//                 },
//                 {
//                     "id": 235,
//                     "animalId": "49",
//                     "url": "/uploads/animals/49/1773087235314_ah3v1v.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:13:55.588Z"
//                 },
//                 {
//                     "id": 236,
//                     "animalId": "49",
//                     "url": "/uploads/animals/49/1773087235589_avig4r.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:13:55.999Z"
//                 },
//                 {
//                     "id": 237,
//                     "animalId": "49",
//                     "url": "/uploads/animals/49/1773087235999_wxsiag.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:13:56.411Z"
//                 },
//                 {
//                     "id": 238,
//                     "animalId": "49",
//                     "url": "/uploads/animals/49/1773087236411_4l7c6t.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:13:56.634Z"
//                 }
//             ]
//         },
//         {
//             "id": 48,
//             "speciesId": 1,
//             "name": "Mono",
//             "sexId": 1,
//             "approxAgeMonths": 36,
//             "birthDate": "2023-03-09T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 4,
//             "colorId": 11,
//             "breedId": "1",
//             "microchip": "991003003511780",
//             "behavior": "Ingresa por medio de Policía Ambiental, ya que la persona que lo había rescatado no podía suplir sus necesidades básicas. Llegó en estado caquéctico y muy nervioso ante la manipulación, con signos marcados de miedo.",
//             "animalNeeds": "Requiere un hogar tranquilo, con tutores amorosos y pacientes que respeten sus tiempos de adaptación. Necesita un ambiente seguro y estable, con manejo respetuoso y predecible que fortalezca su confianza. Es importante brindarle acompañamiento, rutinas claras e interacciones positivas.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-03-09T19:41:49.232Z",
//             "updatedAt": "2026-03-09T20:05:09.500Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 4,
//                 "code": "anxious",
//                 "label": "Ansioso"
//             },
//             "color": {
//                 "id": 11,
//                 "code": "golden",
//                 "label": "Dorado",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 226,
//                     "animalId": "48",
//                     "url": "/uploads/animals/48/1773085314668_kr5wp2.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-03-09T19:41:55.654Z"
//                 },
//                 {
//                     "id": 227,
//                     "animalId": "48",
//                     "url": "/uploads/animals/48/1773086661654_w9la91.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:04:22.577Z"
//                 },
//                 {
//                     "id": 228,
//                     "animalId": "48",
//                     "url": "/uploads/animals/48/1773086696842_8kp5ow.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:04:57.296Z"
//                 },
//                 {
//                     "id": 229,
//                     "animalId": "48",
//                     "url": "/uploads/animals/48/1773086697297_dzev76.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:04:57.737Z"
//                 },
//                 {
//                     "id": 230,
//                     "animalId": "48",
//                     "url": "/uploads/animals/48/1773086697738_lodngg.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:04:58.121Z"
//                 },
//                 {
//                     "id": 231,
//                     "animalId": "48",
//                     "url": "/uploads/animals/48/1773086698121_9v11wm.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:04:58.597Z"
//                 },
//                 {
//                     "id": 232,
//                     "animalId": "48",
//                     "url": "/uploads/animals/48/1773086698598_c98yal.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T20:04:59.062Z"
//                 }
//             ]
//         },
//         {
//             "id": 47,
//             "speciesId": 1,
//             "name": "Darla",
//             "sexId": 2,
//             "approxAgeMonths": 60,
//             "birthDate": "2021-03-09T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 4,
//             "colorId": 17,
//             "breedId": "1",
//             "microchip": "941000027284011",
//             "behavior": "Ingresa por medio de Policía Ambiental, ya que la persona que la rescató no podía seguir teniéndola. Llegó con muy baja condición corporal, lesiones dermatológicas en base de la cola y flanco derecho, y nerviosismo ante la manipulación. Actualmente es tranquila y está recuperando la confianza en las personas.",
//             "animalNeeds": "Esta canina necesita un hogar tranquilo, amoroso y paciente que respete sus tiempos de adaptación y fortalezca su confianza en las personas. Requiere un ambiente estable, manejo respetuoso y rutinas claras, además de acompañamiento e interacciones positivas que favorezcan su bienestar emocional.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-03-09T18:31:45.606Z",
//             "updatedAt": "2026-03-09T18:32:55.258Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 4,
//                 "code": "anxious",
//                 "label": "Ansioso"
//             },
//             "color": {
//                 "id": 17,
//                 "code": "bicolor",
//                 "label": "Bicolor",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 221,
//                     "animalId": "47",
//                     "url": "/uploads/animals/47/1773081106810_p4isrs.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-03-09T18:31:47.064Z"
//                 },
//                 {
//                     "id": 222,
//                     "animalId": "47",
//                     "url": "/uploads/animals/47/1773081127636_ljab98.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:32:07.867Z"
//                 },
//                 {
//                     "id": 223,
//                     "animalId": "47",
//                     "url": "/uploads/animals/47/1773081127867_hh6s65.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:32:08.073Z"
//                 },
//                 {
//                     "id": 224,
//                     "animalId": "47",
//                     "url": "/uploads/animals/47/1773081128074_rz0xmj.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:32:08.288Z"
//                 },
//                 {
//                     "id": 225,
//                     "animalId": "47",
//                     "url": "/uploads/animals/47/1773081128289_xmmih0.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:32:08.499Z"
//                 }
//             ]
//         },
//         {
//             "id": 46,
//             "speciesId": 1,
//             "name": "Tobías",
//             "sexId": 1,
//             "approxAgeMonths": 36,
//             "birthDate": "2023-03-09T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 1,
//             "colorId": 11,
//             "breedId": "1",
//             "microchip": "991003003511778",
//             "behavior": "Ingresa a través de la Policía Ambiental, ya que sus tutores no contaban con los recursos para suplir sus necesidades básicas. Llegó en estado caquéctico. Actualmente es un canino muy alegre y juguetón; ha mejorado su condición corporal y disfruta del juego y las caricias.",
//             "animalNeeds": "Requiere un hogar responsable que garantice sus necesidades básicas: alimentación balanceada, atención veterinaria y cuidados generales. Una familia afectuosa que le brinde juego, interacción y actividad física (paseos diarios), en un ambiente estable y enriquecido que favorezca su bienestar.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-03-09T18:22:16.442Z",
//             "updatedAt": "2026-03-09T18:23:52.366Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 1,
//                 "code": "active",
//                 "label": "Activo"
//             },
//             "color": {
//                 "id": 11,
//                 "code": "golden",
//                 "label": "Dorado",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 214,
//                     "animalId": "46",
//                     "url": "/uploads/animals/46/1773080547081_stwbcp.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-03-09T18:22:27.353Z"
//                 },
//                 {
//                     "id": 215,
//                     "animalId": "46",
//                     "url": "/uploads/animals/46/1773080622751_1tqtsh.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:23:42.979Z"
//                 },
//                 {
//                     "id": 216,
//                     "animalId": "46",
//                     "url": "/uploads/animals/46/1773080622981_kmdwfj.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:23:43.384Z"
//                 },
//                 {
//                     "id": 217,
//                     "animalId": "46",
//                     "url": "/uploads/animals/46/1773080623385_6fgwop.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:23:43.777Z"
//                 },
//                 {
//                     "id": 218,
//                     "animalId": "46",
//                     "url": "/uploads/animals/46/1773080623778_i100wu.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:23:43.975Z"
//                 },
//                 {
//                     "id": 219,
//                     "animalId": "46",
//                     "url": "/uploads/animals/46/1773080623975_fn4jou.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:23:44.203Z"
//                 },
//                 {
//                     "id": 220,
//                     "animalId": "46",
//                     "url": "/uploads/animals/46/1773080624203_u0zf5f.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:23:44.439Z"
//                 }
//             ]
//         },
//         {
//             "id": 45,
//             "speciesId": 1,
//             "name": "Juangy",
//             "sexId": 1,
//             "approxAgeMonths": 24,
//             "birthDate": "2024-03-09T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 2,
//             "colorId": 17,
//             "breedId": "1",
//             "microchip": "991003003381271",
//             "behavior": "Ingresó como rescate en septiembre de 2025, tras ser encontrado en condición de calle, con graves lesiones dermatológicas y bajo peso. A pesar de su corta edad, es un canino muy tranquilo. Hoy ha recuperado la confianza en las personas, es amoroso, disfruta el contacto humano y continúa su proceso de adaptación.",
//             "animalNeeds": "Juangy se beneficiará de un hogar tranquilo, con tutores pacientes y afectuosos que continúen fortaleciendo su vínculo y confianza en las personas. Requiere un ambiente estable, rutinas claras y manejo respetuoso con refuerzo positivo, además de compañía, interacción y enriquecimiento",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-03-09T18:12:32.096Z",
//             "updatedAt": "2026-03-09T18:13:52.700Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 2,
//                 "code": "calm",
//                 "label": "Tranquilo"
//             },
//             "color": {
//                 "id": 17,
//                 "code": "bicolor",
//                 "label": "Bicolor",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 208,
//                     "animalId": "45",
//                     "url": "/uploads/animals/45/1773079958458_cevpjc.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-03-09T18:12:38.701Z"
//                 },
//                 {
//                     "id": 209,
//                     "animalId": "45",
//                     "url": "/uploads/animals/45/1773080024547_mocy5f.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:13:44.968Z"
//                 },
//                 {
//                     "id": 210,
//                     "animalId": "45",
//                     "url": "/uploads/animals/45/1773080024970_zw4a4q.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:13:45.222Z"
//                 },
//                 {
//                     "id": 211,
//                     "animalId": "45",
//                     "url": "/uploads/animals/45/1773080025223_quilk6.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:13:45.457Z"
//                 },
//                 {
//                     "id": 212,
//                     "animalId": "45",
//                     "url": "/uploads/animals/45/1773080025458_comnou.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:13:45.689Z"
//                 },
//                 {
//                     "id": 213,
//                     "animalId": "45",
//                     "url": "/uploads/animals/45/1773080025690_p6ily7.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-09T18:13:45.901Z"
//                 }
//             ]
//         },
//         {
//             "id": 42,
//             "speciesId": 1,
//             "name": "Bruk",
//             "sexId": 1,
//             "approxAgeMonths": 24,
//             "birthDate": "2024-02-20T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 1,
//             "colorId": 1,
//             "breedId": "1",
//             "microchip": "3382546",
//             "behavior": "Canino que ingresa en octubre de 2025, presentando problemas dermatológicos y pulicosis severa. Es un perro joven, con altos niveles de energía, juguetón y afectuoso, que disfruta del contacto humano y el juego.",
//             "animalNeeds": "Busca un hogar activo y comprometido, capaz de brindarle paseos diarios prolongados, estimulación física y mental acorde a su nivel de energía, y espacios seguros donde pueda explorar y jugar.\nRequiere rutinas estables, educación basada en el refuerzo positivo y un acompañamiento paciente que le permita continuar fortaleciendo su confianza y bienestar emocional.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-20T17:12:06.720Z",
//             "updatedAt": "2026-02-26T20:31:09.824Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 1,
//                 "code": "active",
//                 "label": "Activo"
//             },
//             "color": {
//                 "id": 1,
//                 "code": "black",
//                 "label": "Negro",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 179,
//                     "animalId": "42",
//                     "url": "/uploads/animals/42/1771607528444_6x0mt7.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-20T17:12:09.011Z"
//                 },
//                 {
//                     "id": 180,
//                     "animalId": "42",
//                     "url": "/uploads/animals/42/1771607550307_3jmw1t.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T17:12:30.887Z"
//                 },
//                 {
//                     "id": 181,
//                     "animalId": "42",
//                     "url": "/uploads/animals/42/1771607550887_g7n0sk.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T17:12:31.410Z"
//                 },
//                 {
//                     "id": 182,
//                     "animalId": "42",
//                     "url": "/uploads/animals/42/1771607551410_ojpppc.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T17:12:31.933Z"
//                 },
//                 {
//                     "id": 183,
//                     "animalId": "42",
//                     "url": "/uploads/animals/42/1771607551933_nn1o39.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T17:12:32.457Z"
//                 },
//                 {
//                     "id": 184,
//                     "animalId": "42",
//                     "url": "/uploads/animals/42/1771607552457_nucflr.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T17:12:32.984Z"
//                 },
//                 {
//                     "id": 185,
//                     "animalId": "42",
//                     "url": "/uploads/animals/42/1771607552984_knzjtm.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T17:12:33.612Z"
//                 },
//                 {
//                     "id": 186,
//                     "animalId": "42",
//                     "url": "/uploads/animals/42/1771607553612_pr2esd.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T17:12:34.267Z"
//                 },
//                 {
//                     "id": 187,
//                     "animalId": "42",
//                     "url": "/uploads/animals/42/1771607554297_bt5xsl.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T17:12:34.940Z"
//                 }
//             ]
//         },
//         {
//             "id": 39,
//             "speciesId": 1,
//             "name": "Danko",
//             "sexId": 1,
//             "approxAgeMonths": 36,
//             "birthDate": "2023-02-20T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 1,
//             "colorId": 17,
//             "breedId": "1",
//             "microchip": "01077723",
//             "behavior": "Canino adulto que ingresa en enero de 2024 en estado de abandono y con baja condición corporal. Al momento del ingreso presentaba altos niveles de energía y una marcada necesidad de contacto y atención humana.\nActualmente es un perro activo y alegre, con una condición corporal recuperada. Disfruta del contacto con las personas y se beneficia de paseos largos, donde puede liberar su energía y explorar el entorno con mayor seguridad y confianza.",
//             "animalNeeds": "Busca un hogar activo y comprometido, que pueda brindarle paseos diarios prolongados, estimulación física y mental acorde a su nivel de energía, y espacios seguros donde pueda explorar y jugar.\nRequiere rutinas estables, educación basada en el refuerzo positivo y un acompañamiento paciente que le permita continuar fortaleciendo su confianza y bienestar.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-20T16:49:59.476Z",
//             "updatedAt": "2026-02-20T16:50:55.844Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 1,
//                 "code": "active",
//                 "label": "Activo"
//             },
//             "color": {
//                 "id": 17,
//                 "code": "bicolor",
//                 "label": "Bicolor",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 158,
//                     "animalId": "39",
//                     "url": "/uploads/animals/39/1771606201012_3buj0l.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-20T16:50:01.581Z"
//                 },
//                 {
//                     "id": 159,
//                     "animalId": "39",
//                     "url": "/uploads/animals/39/1771606233531_qyf6zi.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T16:50:34.132Z"
//                 },
//                 {
//                     "id": 160,
//                     "animalId": "39",
//                     "url": "/uploads/animals/39/1771606234133_0ssz8n.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T16:50:34.708Z"
//                 },
//                 {
//                     "id": 161,
//                     "animalId": "39",
//                     "url": "/uploads/animals/39/1771606234708_0mkbbx.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T16:50:35.285Z"
//                 },
//                 {
//                     "id": 162,
//                     "animalId": "39",
//                     "url": "/uploads/animals/39/1771606235286_m9ho34.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T16:50:35.836Z"
//                 },
//                 {
//                     "id": 163,
//                     "animalId": "39",
//                     "url": "/uploads/animals/39/1771606235837_okctj2.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T16:50:36.390Z"
//                 },
//                 {
//                     "id": 164,
//                     "animalId": "39",
//                     "url": "/uploads/animals/39/1771606236391_xc4g10.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T16:50:36.955Z"
//                 }
//             ]
//         },
//         {
//             "id": 35,
//             "speciesId": 1,
//             "name": "Capella",
//             "sexId": 2,
//             "approxAgeMonths": 24,
//             "birthDate": "2024-02-19T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 1,
//             "colorId": 19,
//             "breedId": "1",
//             "microchip": "29611671",
//             "behavior": "Canina joven que fue rescatada siendo cachorra tras estar en situación de riesgo por agresiones de la comunidad. Durante su recuperación fue diagnosticada con distemper (moquillo), por lo que requirió atención y manejo en clínica veterinaria, además de presentar un querión dermatológico en la trufa. Actualmente es muy activa y juguetona, con abundante energía y una gran disposición para interactuar y disfrutar del juego.",
//             "animalNeeds": "Hogar activo, comprometido y paciente, que le ofrezca paseos diarios, espacios para jugar y estimulación física y mental acorde a su energía. Requiere educación con refuerzo positivo, límites claros y rutinas estables. Por su antecedente de distemper, es importante mantener controles veterinarios periódicos y seguimiento de su salud, así como el manejo adecuado de cualquier condición dermatológica.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-20T02:15:28.765Z",
//             "updatedAt": "2026-02-20T02:16:25.536Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 1,
//                 "code": "active",
//                 "label": "Activo"
//             },
//             "color": {
//                 "id": 19,
//                 "code": "black_white",
//                 "label": "Negro y blanco",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 139,
//                     "animalId": "35",
//                     "url": "/uploads/animals/35/1771553730022_lnlskk.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-20T02:15:30.544Z"
//                 },
//                 {
//                     "id": 140,
//                     "animalId": "35",
//                     "url": "/uploads/animals/35/1771553779654_eafzob.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:16:20.316Z"
//                 },
//                 {
//                     "id": 141,
//                     "animalId": "35",
//                     "url": "/uploads/animals/35/1771553780317_rsyl6e.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:16:20.871Z"
//                 },
//                 {
//                     "id": 142,
//                     "animalId": "35",
//                     "url": "/uploads/animals/35/1771553780872_tr61na.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:16:21.401Z"
//                 }
//             ]
//         },
//         {
//             "id": 34,
//             "speciesId": 1,
//             "name": "Debinha",
//             "sexId": 2,
//             "approxAgeMonths": 108,
//             "birthDate": "2017-02-19T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 2,
//             "colorId": 17,
//             "breedId": "1",
//             "microchip": "025234197",
//             "behavior": "Canina geriátrica que ingresa al encontrarse en condición de calle, presentando evidente dolor al momento de su rescate.Actualmente es una perrita tranquila y dócil a la manipulación; disfruta el contacto con las personas, convive adecuadamente con otros caninos y se relaciona de manera muy positiva con niños. Es una viejita noble y amorosa que merece un hogar donde pueda vivir esta etapa con comodidad, cuidado y mucho cariño.",
//             "animalNeeds": "Hogar tranquilo y amoroso, comprometido con su bienestar en esta etapa de vida. Requiere controles veterinarios periódicos, una alimentación acorde a su edad y espacios cómodos y seguros que faciliten su movilidad. Sus paseos deben ser cortos y a su ritmo, priorizando siempre su comodidad.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-20T02:09:55.631Z",
//             "updatedAt": "2026-02-20T02:10:19.437Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 2,
//                 "code": "calm",
//                 "label": "Tranquilo"
//             },
//             "color": {
//                 "id": 17,
//                 "code": "bicolor",
//                 "label": "Bicolor",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 134,
//                     "animalId": "34",
//                     "url": "/uploads/animals/34/1771553396885_gsibt9.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-20T02:09:57.478Z"
//                 },
//                 {
//                     "id": 135,
//                     "animalId": "34",
//                     "url": "/uploads/animals/34/1771553414152_mvy6tc.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:10:14.717Z"
//                 },
//                 {
//                     "id": 136,
//                     "animalId": "34",
//                     "url": "/uploads/animals/34/1771553414719_raztaf.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:10:15.295Z"
//                 },
//                 {
//                     "id": 137,
//                     "animalId": "34",
//                     "url": "/uploads/animals/34/1771553415296_3z3q9x.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:10:15.849Z"
//                 },
//                 {
//                     "id": 138,
//                     "animalId": "34",
//                     "url": "/uploads/animals/34/1771553415849_3k01gi.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:10:16.409Z"
//                 }
//             ]
//         },
//         {
//             "id": 33,
//             "speciesId": 1,
//             "name": "Rojo",
//             "sexId": 1,
//             "approxAgeMonths": 96,
//             "birthDate": "2018-02-19T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 2,
//             "colorId": 5,
//             "breedId": "1",
//             "microchip": "3326927",
//             "behavior": "Perro geriatra ingresado por aprehensión preventiva junto a otro canino por mala salud y falta de atención. Comportamentalmente es tranquilo, dócil, permite la manipulación, disfruta el contacto humano y convive bien con otros perros. Médicamente presenta temblores en los miembros posteriores por una discopatía vertebral; está en tratamiento farmacológico y clínicamente estable.",
//             "animalNeeds": "Hogar tranquilo, empático y comprometido con su cuidado médico continuo. Por su discopatía vertebral necesita seguimiento veterinario periódico, medicación responsable y control del dolor según indicación profesional. Requiere ambiente seguro con superficies antideslizantes y sin escaleras. Paseos cortos y controlados, sin esfuerzos excesivos, y acompañamiento afectivo con rutinas estables.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": false,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-20T02:00:23.611Z",
//             "updatedAt": "2026-02-20T02:03:16.829Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 2,
//                 "code": "calm",
//                 "label": "Tranquilo"
//             },
//             "color": {
//                 "id": 5,
//                 "code": "tan",
//                 "label": "Canela",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 126,
//                     "animalId": "33",
//                     "url": "/uploads/animals/33/1771552824902_4uqloy.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-20T02:00:25.472Z"
//                 },
//                 {
//                     "id": 127,
//                     "animalId": "33",
//                     "url": "/uploads/animals/33/1771552928641_jlt3j5.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:02:09.224Z"
//                 },
//                 {
//                     "id": 128,
//                     "animalId": "33",
//                     "url": "/uploads/animals/33/1771552929225_isqbqh.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:02:09.760Z"
//                 },
//                 {
//                     "id": 129,
//                     "animalId": "33",
//                     "url": "/uploads/animals/33/1771552929760_2lyyj9.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:02:10.324Z"
//                 },
//                 {
//                     "id": 130,
//                     "animalId": "33",
//                     "url": "/uploads/animals/33/1771552930325_4y5bqt.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:02:10.876Z"
//                 },
//                 {
//                     "id": 131,
//                     "animalId": "33",
//                     "url": "/uploads/animals/33/1771552930878_ijny31.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:02:11.415Z"
//                 },
//                 {
//                     "id": 132,
//                     "animalId": "33",
//                     "url": "/uploads/animals/33/1771552931416_bivqfk.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:02:11.988Z"
//                 },
//                 {
//                     "id": 133,
//                     "animalId": "33",
//                     "url": "/uploads/animals/33/1771552931989_sf3wq4.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-20T02:02:12.577Z"
//                 }
//             ]
//         },
//         {
//             "id": 27,
//             "speciesId": 1,
//             "name": "Ruperto",
//             "sexId": 1,
//             "approxAgeMonths": 36,
//             "birthDate": "2023-02-18T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 1,
//             "colorId": 1,
//             "breedId": "1",
//             "microchip": "0462298",
//             "behavior": "Canino joven, es rescatado por encontrarse en condición de calle luego de sufrir un atropellamiento y una lesion en su miembro posterior derecho. Es un canino activo y lleno de energía, le encanta jugar, interactuar con las personas y se muestra dócil y tranquilo frente a la manipulación.",
//             "animalNeeds": "Al ser un perro joven necesita chequeos veterinarios periódicos, paseos diarios, juegos que le permitan liberar energía y estimulación mental para evitar el aburrimiento, rutinas claras, educación basada en refuerzos positivos, acompañamiento y mucho amor.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "MEDELLÍN",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-18T20:03:36.498Z",
//             "updatedAt": "2026-02-18T20:04:05.914Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 1,
//                 "code": "active",
//                 "label": "Activo"
//             },
//             "color": {
//                 "id": 1,
//                 "code": "black",
//                 "label": "Negro",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 94,
//                     "animalId": "27",
//                     "url": "/uploads/animals/27/1771445018125_i1pysh.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-18T20:03:38.678Z"
//                 },
//                 {
//                     "id": 95,
//                     "animalId": "27",
//                     "url": "/uploads/animals/27/1771445040484_2sszez.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-18T20:04:01.109Z"
//                 },
//                 {
//                     "id": 96,
//                     "animalId": "27",
//                     "url": "/uploads/animals/27/1771445041118_zspqfp.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-18T20:04:01.622Z"
//                 },
//                 {
//                     "id": 97,
//                     "animalId": "27",
//                     "url": "/uploads/animals/27/1771445041624_um3x83.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-18T20:04:02.176Z"
//                 },
//                 {
//                     "id": 98,
//                     "animalId": "27",
//                     "url": "/uploads/animals/27/1771445042179_af8yzx.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-18T20:04:02.729Z"
//                 }
//             ]
//         },
//         {
//             "id": 25,
//             "speciesId": 1,
//             "name": "Winny",
//             "sexId": 2,
//             "approxAgeMonths": 66,
//             "birthDate": "2020-08-10T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": null,
//             "colorId": 11,
//             "breedId": null,
//             "microchip": "29611545",
//             "behavior": "Fue rescatado en septiembre de 2024. Su nombre proviene del famoso osito amarillo de los dibujos animados, y el parecido no es solo por su color y su contextura gordita, sino también por la ternura que lo caracteriza.",
//             "animalNeeds": "Requiere una familia que esté dispuesta a darle paseos prolongados y que le haga enriquecimento ambiental en casa (Consiste en proporcionar retos, juguetes y experiencias (olfativas, sociales, físicas) para reducir el aburrimiento, el estrés y la ansiedad).",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": false,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-10T18:06:56.433Z",
//             "updatedAt": "2026-02-20T16:15:35.191Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "color": {
//                 "id": 11,
//                 "code": "golden",
//                 "label": "Dorado",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 81,
//                     "animalId": "25",
//                     "url": "/uploads/animals/25/1770746817487_4t8h5p.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-10T18:06:57.870Z"
//                 },
//                 {
//                     "id": 82,
//                     "animalId": "25",
//                     "url": "/uploads/animals/25/1770746839036_lqkrdg.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T18:07:19.448Z"
//                 },
//                 {
//                     "id": 83,
//                     "animalId": "25",
//                     "url": "/uploads/animals/25/1770746839451_yrk4wg.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T18:07:19.833Z"
//                 },
//                 {
//                     "id": 84,
//                     "animalId": "25",
//                     "url": "/uploads/animals/25/1770746839836_ks1ctr.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T18:07:20.207Z"
//                 },
//                 {
//                     "id": 85,
//                     "animalId": "25",
//                     "url": "/uploads/animals/25/1770746840209_qcii8t.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T18:07:20.602Z"
//                 },
//                 {
//                     "id": 86,
//                     "animalId": "25",
//                     "url": "/uploads/animals/25/1770746840605_enkct3.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T18:07:21.014Z"
//                 },
//                 {
//                     "id": 87,
//                     "animalId": "25",
//                     "url": "/uploads/animals/25/1770746841016_mg88o5.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T18:07:21.404Z"
//                 },
//                 {
//                     "id": 88,
//                     "animalId": "25",
//                     "url": "/uploads/animals/25/1770746841407_jij7es.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T18:07:21.797Z"
//                 },
//                 {
//                     "id": 89,
//                     "animalId": "25",
//                     "url": "/uploads/animals/25/1770746841799_oftl06.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T18:07:22.171Z"
//                 }
//             ]
//         },
//         {
//             "id": 23,
//             "speciesId": 1,
//             "name": "Cocote",
//             "sexId": 1,
//             "approxAgeMonths": 172,
//             "birthDate": "2011-10-10T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 2,
//             "colorId": 17,
//             "breedId": "1",
//             "microchip": "26127396",
//             "behavior": "Con alrededor de 14 años, este viejito se distingue por su ternura y serenidad. Sueña con encontrar una familia que lo colme de cariño y le ofrezca un hogar lleno de afecto.",
//             "animalNeeds": "No requiere paseos prolongados, tiene buena socialización con personas y otros perros, a pesar de ser un geriatra, aún cuenta con mucha energía.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": false,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-10T17:22:04.202Z",
//             "updatedAt": "2026-02-10T17:22:59.225Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 2,
//                 "code": "calm",
//                 "label": "Tranquilo"
//             },
//             "color": {
//                 "id": 17,
//                 "code": "bicolor",
//                 "label": "Bicolor",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 63,
//                     "animalId": "23",
//                     "url": "/uploads/animals/23/1770744125450_08rl0w.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-10T17:22:05.878Z"
//                 },
//                 {
//                     "id": 64,
//                     "animalId": "23",
//                     "url": "/uploads/animals/23/1770744174742_4a23x9.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T17:22:55.172Z"
//                 },
//                 {
//                     "id": 65,
//                     "animalId": "23",
//                     "url": "/uploads/animals/23/1770744175175_326hnt.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T17:22:55.557Z"
//                 },
//                 {
//                     "id": 66,
//                     "animalId": "23",
//                     "url": "/uploads/animals/23/1770744175560_7vrh83.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T17:22:55.949Z"
//                 },
//                 {
//                     "id": 67,
//                     "animalId": "23",
//                     "url": "/uploads/animals/23/1770744175952_0l280o.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T17:22:56.342Z"
//                 },
//                 {
//                     "id": 68,
//                     "animalId": "23",
//                     "url": "/uploads/animals/23/1770744176344_0ak8vy.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T17:22:56.740Z"
//                 },
//                 {
//                     "id": 69,
//                     "animalId": "23",
//                     "url": "/uploads/animals/23/1770744176742_54euzk.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T17:22:57.137Z"
//                 }
//             ]
//         },
//         {
//             "id": 21,
//             "speciesId": 1,
//             "name": "Muñeca",
//             "sexId": 2,
//             "approxAgeMonths": 132,
//             "birthDate": "2015-02-10T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": null,
//             "colorId": 11,
//             "breedId": "1",
//             "microchip": "377102",
//             "behavior": "Ingresó en marzo de 2025 como parte de un proceso de inclusión social, presentando baja condición corporal. Posteriormente pasó a entrega voluntaria. Se le realizó retiro de una masa (adenoma sebáceo). Es una perra mayor, tranquila, que permite las caricias y el contacto.",
//             "animalNeeds": "Su familia ideal es aquella que la colme de amor y le ofrezca una vida serena, con caminatas tranquilas y una camita cálida donde pueda sentirse segura.",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-10T14:49:29.513Z",
//             "updatedAt": "2026-02-20T16:15:39.078Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "color": {
//                 "id": 11,
//                 "code": "golden",
//                 "label": "Dorado",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 53,
//                     "animalId": "21",
//                     "url": "/uploads/animals/21/1770734974571_i7nz7d.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-10T14:49:35.033Z"
//                 },
//                 {
//                     "id": 54,
//                     "animalId": "21",
//                     "url": "/uploads/animals/21/1770735011427_87hbom.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T14:50:11.883Z"
//                 },
//                 {
//                     "id": 55,
//                     "animalId": "21",
//                     "url": "/uploads/animals/21/1770735011886_5zc8a5.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T14:50:12.295Z"
//                 }
//             ]
//         },
//         {
//             "id": 20,
//             "speciesId": 1,
//             "name": "Bruce \"DJ\"",
//             "sexId": 1,
//             "approxAgeMonths": 60,
//             "birthDate": "2021-02-10T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 1,
//             "colorId": 19,
//             "breedId": "1",
//             "microchip": "1077925",
//             "behavior": "Fue rescatado en diciembre de 2023. Es un perro muy activo, pero disfruta socializar con las personas. Le encantan las caricias y acompaña fielmente a quienes lo rodean. Presenta una limitación en una de sus patas delanteras y algunos movimientos involuntarios como secuela de distemper (moquillo). Bruce está listo para encontrar esa familia que le guste la diversión y disfrute caminar.",
//             "animalNeeds": "Familia responsable, que pueda brindar paseos estructurados y buena socialización, paseos prolongados por su alto nivel de energía y enriquecimiento ambiental en casa (Consiste en proporcionar retos, juguetes y experiencias (olfativas, sociales, físicas) para reducir el aburrimiento, el estrés y la ansiedad).",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-10T13:58:47.702Z",
//             "updatedAt": "2026-02-10T13:59:50.154Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 1,
//                 "code": "active",
//                 "label": "Activo"
//             },
//             "color": {
//                 "id": 19,
//                 "code": "black_white",
//                 "label": "Negro y blanco",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 45,
//                     "animalId": "20",
//                     "url": "/uploads/animals/20/1770731932409_d6jbe5.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-10T13:58:52.672Z"
//                 },
//                 {
//                     "id": 46,
//                     "animalId": "20",
//                     "url": "/uploads/animals/20/1770731986217_j31vej.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:59:46.626Z"
//                 },
//                 {
//                     "id": 47,
//                     "animalId": "20",
//                     "url": "/uploads/animals/20/1770731986629_elczhd.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:59:46.981Z"
//                 },
//                 {
//                     "id": 48,
//                     "animalId": "20",
//                     "url": "/uploads/animals/20/1770731986984_m0168e.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:59:47.431Z"
//                 },
//                 {
//                     "id": 49,
//                     "animalId": "20",
//                     "url": "/uploads/animals/20/1770731987433_jvllaz.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:59:47.656Z"
//                 },
//                 {
//                     "id": 50,
//                     "animalId": "20",
//                     "url": "/uploads/animals/20/1770731987658_1xzujc.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:59:47.865Z"
//                 },
//                 {
//                     "id": 51,
//                     "animalId": "20",
//                     "url": "/uploads/animals/20/1770731987867_4frtva.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:59:48.076Z"
//                 },
//                 {
//                     "id": 52,
//                     "animalId": "20",
//                     "url": "/uploads/animals/20/1770731988078_dme843.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:59:48.505Z"
//                 }
//             ]
//         },
//         {
//             "id": 19,
//             "speciesId": 1,
//             "name": "Lara",
//             "sexId": 2,
//             "approxAgeMonths": 54,
//             "birthDate": "2021-08-10T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 1,
//             "colorId": 17,
//             "breedId": "1",
//             "microchip": "380946",
//             "behavior": "Canina rescata en agosto de 2025, como aprehensión material preventiva, por Policía Nacional, ya que se encontraba en malas condiciones de albergue y estado caquectico. Disfruta el contacto y las caricias, es juguetona y enérgica, no es consciente de su tamaño, cree que es mas pequeña.",
//             "animalNeeds": "Familia responsable, que pueda brindar paseos estructurados y buena socialización, paseos prolongados y enriquecimiento ambiental en casa. (Consiste en proporcionar retos, juguetes y experiencias (olfativas, sociales, físicas) para reducir el aburrimiento, el estrés y la ansiedad.)",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": false,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-10T13:30:59.745Z",
//             "updatedAt": "2026-02-10T13:30:59.745Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 1,
//                 "code": "active",
//                 "label": "Activo"
//             },
//             "color": {
//                 "id": 17,
//                 "code": "bicolor",
//                 "label": "Bicolor",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 44,
//                     "animalId": "19",
//                     "url": "/uploads/animals/19/1770730261022_mtsxn3.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-10T13:31:01.439Z"
//                 }
//             ]
//         },
//         {
//             "id": 13,
//             "speciesId": 1,
//             "name": "Negra",
//             "sexId": 2,
//             "approxAgeMonths": 18,
//             "birthDate": "2024-08-10T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": 2,
//             "colorId": 1,
//             "breedId": "1",
//             "microchip": "3382411",
//             "behavior": "Canina rescatada en octubre de 2025 tras sufrir un atropello. Requirió cirugía ortopédica. Es joven, enérgica, afectuosa y muy juguetona.",
//             "animalNeeds": "Disfruta de paseos prolongados. Presenta buena socialización con personas y otros perros, con temperamento tranquilo. Actualmente requiere fisioterapia y radiografías de control.\n",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2026-02-10T13:14:35.435Z",
//             "updatedAt": "2026-02-10T13:15:01.985Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "temperament": {
//                 "id": 2,
//                 "code": "calm",
//                 "label": "Tranquilo"
//             },
//             "color": {
//                 "id": 1,
//                 "code": "black",
//                 "label": "Negro",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 36,
//                     "animalId": "13",
//                     "url": "/uploads/animals/13/1770729276613_9jkbhp.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2026-02-10T13:14:37.068Z"
//                 },
//                 {
//                     "id": 37,
//                     "animalId": "13",
//                     "url": "/uploads/animals/13/1770729297048_bjacg7.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:14:57.514Z"
//                 },
//                 {
//                     "id": 38,
//                     "animalId": "13",
//                     "url": "/uploads/animals/13/1770729297516_9lvbmu.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:14:57.959Z"
//                 },
//                 {
//                     "id": 39,
//                     "animalId": "13",
//                     "url": "/uploads/animals/13/1770729297961_6h9q0r.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:14:58.370Z"
//                 },
//                 {
//                     "id": 40,
//                     "animalId": "13",
//                     "url": "/uploads/animals/13/1770729298372_pkw3gu.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:14:58.784Z"
//                 },
//                 {
//                     "id": 41,
//                     "animalId": "13",
//                     "url": "/uploads/animals/13/1770729298786_mfqv3x.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:14:59.201Z"
//                 },
//                 {
//                     "id": 42,
//                     "animalId": "13",
//                     "url": "/uploads/animals/13/1770729299203_9qf1i3.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:14:59.613Z"
//                 },
//                 {
//                     "id": 43,
//                     "animalId": "13",
//                     "url": "/uploads/animals/13/1770729299615_39h12o.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-02-10T13:15:00.059Z"
//                 }
//             ]
//         },
//         {
//             "id": 8,
//             "speciesId": 1,
//             "name": "Firulo",
//             "sexId": 1,
//             "approxAgeMonths": 36,
//             "birthDate": "2022-12-22T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": null,
//             "colorId": 17,
//             "breedId": "1",
//             "microchip": "461730",
//             "behavior": "Fue rescatado en abril de 2024, se ha revelado como un perro verdaderamente especial. Basta con mirarlo para descubrir la nobleza y ternura que lo acompañan. Aunque presenta algunos movimientos involuntarios, esto no le impide llevar una vida plena y normal, llena de alegría y cariño. Sueña con encontrar una familia que lo acepte tal como es y que esté dispuesta a recibir el inmenso amor que tiene para entregar.",
//             "animalNeeds": null,
//             "acceptanceTerms": null,
//             "location": "Medellín",
//             "goodWithAnimals": false,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2025-12-22T14:22:55.065Z",
//             "updatedAt": "2026-02-09T13:00:16.930Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 1,
//                 "code": "male",
//                 "label": "Macho"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "color": {
//                 "id": 17,
//                 "code": "bicolor",
//                 "label": "Bicolor",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 18,
//                     "animalId": "8",
//                     "url": "/uploads/animals/8/1766413377002_z60o3a.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2025-12-22T14:22:57.506Z"
//                 }
//             ]
//         },
//         {
//             "id": 6,
//             "speciesId": 1,
//             "name": "Triniti",
//             "sexId": 2,
//             "approxAgeMonths": 72,
//             "birthDate": "2019-12-22T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": null,
//             "colorId": 16,
//             "breedId": "1",
//             "microchip": "3000303013",
//             "behavior": "Desde enero de 2023 vive en el CBA, donde se ha mostrado como una perra llena de energía y entusiasmo. Aunque a veces su carácter refleja cierta ansiedad, disfruta de los espacios amplios y libres, pues no le gustan los lugares estrechos. Sueña con una familia que le dedique tiempo, juego y paseos, brindándole así la oportunidad de desplegar todo su cariño y alegría en un entorno donde pueda sentirse tranquila y acompañada.",
//             "animalNeeds": "Familia responsable, que pueda brindar paseos estructurados y buena socialización, paseos prolongados y enriquecimiento ambiental en casa. (Consiste en proporcionar retos, juguetes y experiencias (olfativas, sociales, físicas) para reducir el aburrimiento, el estrés y la ansiedad.)",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": true,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2025-12-22T14:16:00.581Z",
//             "updatedAt": "2026-03-04T12:25:30.450Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "color": {
//                 "id": 16,
//                 "code": "tabby",
//                 "label": "Atigrado (tabby)",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 16,
//                     "animalId": "6",
//                     "url": "/uploads/animals/6/1766412961879_crsl09.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2025-12-22T14:16:02.401Z"
//                 },
//                 {
//                     "id": 195,
//                     "animalId": "6",
//                     "url": "/uploads/animals/6/1772627039243_g0w7zv.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:23:59.685Z"
//                 },
//                 {
//                     "id": 196,
//                     "animalId": "6",
//                     "url": "/uploads/animals/6/1772627039686_v44r6r.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:23:59.886Z"
//                 },
//                 {
//                     "id": 197,
//                     "animalId": "6",
//                     "url": "/uploads/animals/6/1772627039887_bnit0y.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:24:00.110Z"
//                 },
//                 {
//                     "id": 198,
//                     "animalId": "6",
//                     "url": "/uploads/animals/6/1772627040113_8d8y31.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:24:00.328Z"
//                 },
//                 {
//                     "id": 199,
//                     "animalId": "6",
//                     "url": "/uploads/animals/6/1772627040328_3xz9fd.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:24:00.562Z"
//                 },
//                 {
//                     "id": 200,
//                     "animalId": "6",
//                     "url": "/uploads/animals/6/1772627040562_7zvhma.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:24:00.756Z"
//                 },
//                 {
//                     "id": 201,
//                     "animalId": "6",
//                     "url": "/uploads/animals/6/1772627040756_iaddov.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:24:00.980Z"
//                 }
//             ]
//         },
//         {
//             "id": 4,
//             "speciesId": 1,
//             "name": "Parda",
//             "sexId": 2,
//             "approxAgeMonths": 96,
//             "birthDate": "2017-12-22T00:00:00.000Z",
//             "sizeId": 3,
//             "temperamentId": null,
//             "colorId": 3,
//             "breedId": "1",
//             "microchip": "7D02160",
//             "behavior": "Llegó a La Perla en julio de 2019 y desde entonces ilumina cada rincón con su energía. Activa y llena de vida, busca siempre el contacto humano y disfruta de las caricias con ternura y confianza. En su mirada brilla la esperanza de hallar un hogar donde entregar todo el amor que guarda en su corazón. Está lista para una familia que desee abrirse a la experiencia más pura y transformadora: descubrir el verdadero significado del amor incondicional.",
//             "animalNeeds": "Familia responsable, que pueda brindar paseos estructurados y buena socialización, paseos prolongados y enriquecimiento ambiental en casa. (Consiste en proporcionar retos, juguetes y experiencias (olfativas, sociales, físicas) para reducir el aburrimiento, el estrés y la ansiedad.)",
//             "acceptanceTerms": "La falta de atención a las necesidades del animal puede prolongar su proceso de adaptación.",
//             "location": "Medellín",
//             "goodWithAnimals": false,
//             "goodWithChildren": false,
//             "userId": "3",
//             "shelterId": "1",
//             "statusId": 1,
//             "createdAt": "2025-12-22T13:31:15.597Z",
//             "updatedAt": "2026-03-04T12:27:12.051Z",
//             "deletedAt": null,
//             "species": {
//                 "id": 1,
//                 "code": "dog",
//                 "label": "Perro"
//             },
//             "sex": {
//                 "id": 2,
//                 "code": "female",
//                 "label": "Hembra"
//             },
//             "size": {
//                 "id": 3,
//                 "code": "medium",
//                 "label": "Mediano"
//             },
//             "color": {
//                 "id": 3,
//                 "code": "brown",
//                 "label": "Marrón",
//                 "createdAt": "2025-11-13T03:05:29.290Z"
//             },
//             "breed": {
//                 "id": 1,
//                 "speciesId": 1,
//                 "code": "mixed",
//                 "label": "Criollo",
//                 "createdAt": "2025-11-13T03:05:28.973Z"
//             },
//             "shelter": {
//                 "id": 1,
//                 "name": "Centro de Bienestar Animal La Perla",
//                 "slug": "laperla",
//                 "logotipo": "/uploads/shelters/1/logotipo_1766173124263_qctw77.jpg",
//                 "banner": "/uploads/shelters/1/banner_1766173124322_mmb497.jpg",
//                 "contactEmail": "atencion.ciudadana@medellin.gov.co",
//                 "contactPhone": "3117963457",
//                 "address": "Carrera 112 #12-01, Belén Altavista. Medellín.",
//                 "websiteUrl": "https://www.medellin.gov.co/es/secretaria-medio-ambiente/proteccion-y-bienestar-animal/bienestar-animal-del-distrito-de-medellin/centro-de-bienestar-animal-la-perla/",
//                 "instagram": "https://www.instagram.com/laperlamed/",
//                 "facebook": null,
//                 "twitter": null,
//                 "tiktok": null,
//                 "whatsapp": "3117963457",
//                 "cityId": "73",
//                 "lat": "0.000000",
//                 "lon": "0.000000",
//                 "createdAt": "2025-11-13T03:05:29.389Z",
//                 "updatedAt": "2026-02-18T15:10:44.904Z",
//                 "deletedAt": null,
//                 "city": {
//                     "id": 73,
//                     "department": "Antioquia",
//                     "name": "Medellín",
//                     "createdAt": "2025-11-13T03:05:30.153Z",
//                     "updatedAt": "2025-11-13T03:05:30.153Z",
//                     "deletedAt": null
//                 },
//                 "cityName": "Medellín",
//                 "state": "Antioquia",
//                 "department": "Antioquia"
//             },
//             "status": {
//                 "id": 1,
//                 "code": "available",
//                 "label": "Disponible"
//             },
//             "photos": [
//                 {
//                     "id": 14,
//                     "animalId": "4",
//                     "url": "/uploads/animals/4/1766411220903_8awwsk.jpg",
//                     "isPrimary": true,
//                     "createdAt": "2025-12-22T13:47:01.161Z"
//                 },
//                 {
//                     "id": 202,
//                     "animalId": "4",
//                     "url": "/uploads/animals/4/1772627219348_k9vfb5.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:26:59.547Z"
//                 },
//                 {
//                     "id": 203,
//                     "animalId": "4",
//                     "url": "/uploads/animals/4/1772627219548_0s5ckb.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:26:59.737Z"
//                 },
//                 {
//                     "id": 204,
//                     "animalId": "4",
//                     "url": "/uploads/animals/4/1772627219737_3yl3bu.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:27:00.141Z"
//                 },
//                 {
//                     "id": 205,
//                     "animalId": "4",
//                     "url": "/uploads/animals/4/1772627220142_cwh16o.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:27:00.363Z"
//                 },
//                 {
//                     "id": 206,
//                     "animalId": "4",
//                     "url": "/uploads/animals/4/1772627220363_jcjdpl.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:27:00.557Z"
//                 },
//                 {
//                     "id": 207,
//                     "animalId": "4",
//                     "url": "/uploads/animals/4/1772627220557_zkn1du.jpg",
//                     "isPrimary": false,
//                     "createdAt": "2026-03-04T12:27:00.753Z"
//                 }
//             ]
//         }
//     ],
//     "total": 20,
//     "page": 1,
//     "pageSize": 20
// }
    //   return data;
    
    return this.http.get<IShelterAnimalsResponse>(`${this._baseUrl}`, { headers, params });
  }
}
