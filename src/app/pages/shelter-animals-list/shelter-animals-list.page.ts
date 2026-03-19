import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ShelterAnimalService } from 'src/app/services/shelter-animal.service';
import { IShelterAnimal, IShelterAnimalsResponse } from 'src/app/shared/types/shelter-animal.interface';

interface FilterOptions {
    species: number[];
    sex: number[];
    size: number[];
    temperament: number[];
    shelter: number[];
    breed: number[];
    minAge: number | null;
    maxAge: number | null;
    sortBy: string;
    sortDirection: string;
}

@Component({
    selector: 'app-shelter-animals-list',
    templateUrl: './shelter-animals-list.page.html',
    styleUrls: ['./shelter-animals-list.page.scss'],
})
export class ShelterAnimalsListPage implements OnInit {
    public animalList: IShelterAnimal[] = [];
    public filteredAnimals: IShelterAnimal[] = [];
    public showData = false;
    public showFilters = false;

    // Pagination
    public currentPage = 1;
    public pageSize = 20;
    public totalAnimals = 0;
    public hasMorePages = true;
    public isLoadingMore = false;

    // Filter options
    public filters: FilterOptions = {
        species: [],
        sex: [],
        size: [],
        temperament: [],
        shelter: [],
        breed: [],
        minAge: null,
        maxAge: null,
        sortBy: 'approxAgeMonths',
        sortDirection: 'asc'
    };

    // Available options from data
    public availableSpecies: any[] = [];
    public availableSexes: any[] = [];
    public availableSizes: any[] = [];
    public availableTemperaments: any[] = [];
    public availableShelters: any[] = [];
    public availableBreeds: any[] = [];

    constructor(
        private shelterAnimalService: ShelterAnimalService,
        private loadingService: LoadingService,
        private alertService: AlertService,
        private navCtrl: NavController,
        private router: Router
    ) { }

    async ngOnInit() {
        await this.loadAnimals();
    }

    async ionViewWillEnter() {
        await this.loadAnimals(true);
    }

    /**
     * Load shelter animals from API
     */
    async loadAnimals(reset: boolean = false) {
        if (reset) {
            this.currentPage = 1;
            this.animalList = [];
            this.hasMorePages = true;
        }
        // try {
            const response: any =  this.shelterAnimalService.getShelterAnimals(this.currentPage, this.pageSize)
            // const response: IShelterAnimalsResponse = await this.shelterAnimalService.getShelterAnimals(this.currentPage, this.pageSize).toPromise();
            if (reset) {
                this.animalList = response.data;
            } else {
                this.animalList = [...this.animalList, ...response.data];
            }

            this.totalAnimals = response.total;
            // Verificar si hay más páginas basándose en el total
            const totalLoaded = this.currentPage * this.pageSize;
            this.hasMorePages = totalLoaded < this.totalAnimals;

            this.extractFilterOptions();
            this.applyFilters();
            this.showData = true;
            await this.loadingService.hideLoading();
        // } catch (error) {
        //     await this.loadingService.hideLoading();
        //     this.alertService.presentToast('Fallo cargando los animales, por favor intentar nuevamente');
        // }
    }

    /**
     * Load more animals (infinite scroll)
     */
    async loadMore(event: any) {
        if (!this.hasMorePages) {
            event.target.complete();
            return;
        }

        this.isLoadingMore = true;
        this.currentPage++;

        const response: any = this.shelterAnimalService.getShelterAnimals(this.currentPage, this.pageSize);

        this.animalList = [...this.animalList, ...response.data];
        this.totalAnimals = response.total;

        // Verificar si hay más páginas basándose en el total
        const totalLoaded = this.currentPage * this.pageSize;
        this.hasMorePages = totalLoaded < this.totalAnimals;

        this.extractFilterOptions();
        this.applyFilters();
        this.isLoadingMore = false;
        event.target.complete();
    }

    /**
     * Extract unique filter options from loaded data
     */
    extractFilterOptions() {
        // Extract unique species
        const speciesMap = new Map();
        const sexMap = new Map();
        const sizeMap = new Map();
        const temperamentMap = new Map();
        const shelterMap = new Map();
        const breedMap = new Map();

        this.animalList.forEach(animal => {
            if (animal?.species) {
                speciesMap.set(animal.species.id, animal.species);
            }
            if (animal?.sex) {
                sexMap.set(animal.sex.id, animal.sex);
            }
            if (animal?.size) {
                sizeMap.set(animal.size.id, animal.size);
            }
            if (animal?.temperament) {
                temperamentMap.set(animal.temperament.id, animal.temperament);
            }
            if (animal?.shelter) {
                shelterMap.set(animal.shelter.id, animal.shelter);
            }
            if (animal?.breed) {
                breedMap.set(animal.breed.id, animal.breed);
            }
        });

        this.availableSpecies = Array.from(speciesMap.values());
        this.availableSexes = Array.from(sexMap.values());
        this.availableSizes = Array.from(sizeMap.values());
        this.availableTemperaments = Array.from(temperamentMap.values());
        this.availableShelters = Array.from(shelterMap.values());
        this.availableBreeds = Array.from(breedMap.values());
    }

    /**
     * Apply filters to animal list
     */
    applyFilters() {
        this.filteredAnimals = this.animalList.filter(animal => {
            if (!animal) return false;

            // Filter by species
            if (this.filters.species.length > 0 && !this.filters.species.includes(animal.speciesId)) {
                return false;
            }

            // Filter by sex
            if (this.filters.sex.length > 0 && !this.filters.sex.includes(animal.sexId)) {
                return false;
            }

            // Filter by size
            if (this.filters.size.length > 0 && !this.filters.size.includes(animal.sizeId)) {
                return false;
            }

            // Filter by temperament
            if (this.filters.temperament.length > 0 && !this.filters.temperament.includes(animal.temperamentId)) {
                return false;
            }

            // Filter by shelter
            if (this.filters.shelter.length > 0 && !this.filters.shelter.includes(Number(animal.shelterId))) {
                return false;
            }

            // Filter by breed
            if (this.filters.breed.length > 0 && !this.filters.breed.includes(Number(animal.breedId))) {
                return false;
            }

            // Filter by age
            if (this.filters.minAge !== null && animal.approxAgeMonths < this.filters.minAge) {
                return false;
            }

            if (this.filters.maxAge !== null && animal.approxAgeMonths > this.filters.maxAge) {
                return false;
            }

            return true;
        });

        // Apply sorting
        this.filteredAnimals.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (this.filters.sortBy) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                case 'id':
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case 'approxAgeMonths':
                default:
                    aValue = a.approxAgeMonths || 0;
                    bValue = b.approxAgeMonths || 0;
                    break;
            }

            if (this.filters.sortDirection === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
    }

    /**
     * Toggle filter panel
     */
    toggleFilters() {
        this.showFilters = !this.showFilters;
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = {
            species: [],
            sex: [],
            size: [],
            temperament: [],
            shelter: [],
            breed: [],
            minAge: null,
            maxAge: null,
            sortBy: 'approxAgeMonths',
            sortDirection: 'asc'
        };
        this.applyFilters();
    }

    /**
     * Handle filter change
     */
    onFilterChange() {
        this.applyFilters();
    }

    /**
     * Handle refresh event
     */
    async handleRefresh(event: any) {
        this.currentPage = 1;
        this.animalList = [];
        this.hasMorePages = true;

        const response: any = this.shelterAnimalService.getShelterAnimals(this.currentPage, this.pageSize);

        this.animalList = response.data;
        this.totalAnimals = response.total;

        const totalLoaded = this.currentPage * this.pageSize;
        this.hasMorePages = totalLoaded < this.totalAnimals;

        this.extractFilterOptions();
        this.applyFilters();
        event.target.complete();
    }

    /**
     * Navigate to animal detail
     */
    goToAnimalDetail(animal: IShelterAnimal) {
        if (!animal?.id) return;
        // Pasar el objeto completo como estado de navegación
        this.navCtrl.navigateForward(['main-tab/shelter-animal-detail', animal.id], {
            state: { animal }
        });
    }

    /**
     * Get primary photo or first photo
     */
    getPrimaryPhoto(animal: IShelterAnimal): string {
        if (!animal?.photos || animal.photos.length === 0) {
            return '/assets/no-image.png';
        }
        const primaryPhoto = animal.photos.find(photo => photo?.isPrimary);
        const photoUrl = primaryPhoto?.url || animal.photos[0]?.url;

        if (!photoUrl) {
            return '/assets/no-image.png';
        }

        // Si la URL es relativa, agregar el dominio base
        if (photoUrl.startsWith('/')) {
            return 'https://api.sabuesos.com.co' + photoUrl;
        }

        return photoUrl;
    }
}
