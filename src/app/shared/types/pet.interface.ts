export interface IPet {
    _id?: string;
    name: string;
    birthDate?: any;
    race: string;
    typePet: number;
}

export function hashPet(type: number): string{
    switch (type) {
      case 0 :  {
        return 'Perro';
        break;
      }
      case 1 :  {
        return 'Gato';
        break;
      }
      case 2 :  {
        return 'Otro';
        break;
      }
      default:{
        return 'Otro';
        break;
      }
    }
}
