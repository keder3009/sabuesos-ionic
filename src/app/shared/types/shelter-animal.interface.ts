export interface IShelterAnimal {
  id: number;
  speciesId: number;
  name: string;
  sexId: number;
  approxAgeMonths: number;
  birthDate: string;
  sizeId: number;
  temperamentId: number;
  colorId: number;
  breedId: string;
  microchip?: string;
  behavior: string;
  animalNeeds: string;
  acceptanceTerms: string;
  location: string;
  goodWithAnimals: boolean;
  goodWithChildren: boolean;
  userId: string;
  shelterId: string;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  species: ISpecies;
  sex: ISex;
  size: ISize;
  temperament: ITemperament;
  color: IColor;
  breed: IBreed;
  shelter: IShelter;
  status: IStatus;
  photos: IPhoto[];
}

export interface ISpecies {
  id: number;
  code: string;
  label: string;
}

export interface ISex {
  id: number;
  code: string;
  label: string;
}

export interface ISize {
  id: number;
  code: string;
  label: string;
}

export interface ITemperament {
  id: number;
  code: string;
  label: string;
}

export interface IColor {
  id: number;
  code: string;
  label: string;
  createdAt: string;
}

export interface IBreed {
  id: number;
  speciesId: number;
  code: string;
  label: string;
  createdAt: string;
}

export interface IShelter {
  id: number;
  name: string;
  slug: string;
  logotipo: string;
  banner: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  websiteUrl?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  whatsapp?: string;
  cityId: string;
  lat: string;
  lon: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  city: ICity;
  cityName: string;
  state: string;
  department: string;
}

export interface ICity {
  id: number;
  department: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IStatus {
  id: number;
  code: string;
  label: string;
}

export interface IPhoto {
  id: number;
  animalId: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface IShelterAnimalsResponse {
  data: IShelterAnimal[];
  total: number;
  page: number;
  pageSize: number;
}
