
export const ERRORS: MenuError[] = [
    { key: 'name', value: 'Nombre' },
    { key: 'email', value: 'Correo' },
    { key: 'password', value: 'Contraseña' },
    { key: 'retypePassword', value: 'Confirme su contraseña' },
    { key: 'city', value: 'Deapartamento' },
    { key: 'document', value: 'Documento' },
    { key: 'phone', value: 'Teléfono' },
    { key: 'contactPerson', value: 'Persona de Contacto' },
    { key: 'address', value: 'Dirección entidad' },
    { key: 'nameOrganization', value: 'Nombre de la entidad' },
    { key: 'NIT', value: 'NIT' },
    { key: 'webpage', value: 'Sitio Web' },
    { key: 'birthDateUserDay', value: 'Fecha nacimiento usuario (día)' },
    { key: 'birthDateUserMonth', value: 'Fecha nacimiento usuario (mes)' },
    { key: 'birthDateUserYear', value: 'Fecha nacimiento usuario (año)' },
    { key: 'namePet', value: 'Nombre de la mascota' },
    { key: 'typePet', value: 'Tipo' },
    { key: 'race', value: 'Raza' },
    { key: 'authorizationOrganization', value: 'Autorizo el uso de información' },
    { key: 'birthDatePetDay', value: 'Fecha nacimiento mascota (día)' },
    { key: 'birthDatePetMonth', value: 'Fecha nacimiento mascota (mes)' },
    { key: 'birthDatePetYear', value: 'Fecha nacimiento mascota (año)' },
    { key: 'description', value: 'Descripción' },
    { key: 'birthDate', value: 'Fecha nacimiento' }
];

export function getError(data: string): any {
    for (const error of ERRORS) {
        if (error.key === data) {
            return error.value;
        }
    }
}

export interface MenuError {
    key: string;
    value: string;
}