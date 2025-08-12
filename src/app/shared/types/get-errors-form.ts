import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { getError } from './error.constant';

export interface AllValidationErrors {
    control_name: string;
    error_name: string;
    error_value: any;
}

export interface FormGroupControls {
    [key: string]: AbstractControl;
}

export function getFormValidationErrors(
    controls: FormGroupControls
): AllValidationErrors[] {
    let errors: AllValidationErrors[] = [];
    Object.keys(controls).forEach((key) => {
        const control = controls[key];
        if (control instanceof FormGroup) {
            errors = errors.concat(getFormValidationErrors(control.controls));
        }
        const controlErrors: ValidationErrors = controls[key].errors as any;
        if (controlErrors !== null) {
            Object.keys(controlErrors).forEach((keyError) => {
                errors.push({
                    control_name: key,
                    error_name: keyError,
                    error_value: controlErrors[keyError],
                });
            });
        }
    });
    return errors;
}

export function searchFormError(error: AllValidationErrors) {
    let text;
    switch (error.error_name) {
        case 'required':
            text = `El campo ${getError(error.control_name)} es requerido!`;
            break;
        case 'pattern':
            text = `${getError(error.control_name)} no cumple con el formato!`;
            break;
        case 'email':
            text = `${getError(
                error.control_name
            )} no tiene el formato de correo correcto!`;
            break;
        case 'minlength':
            text = `${error.control_name} demasiado corto! Tamaño requerido: ${error.error_value.requiredLength}`;
            break;
        case 'maxlength':
            text = `${getError(
                error.control_name
            )} demasiado largo! Tamaño máximo de caracteres: ${error.error_value.requiredLength
                }`;
            break;
        case 'areEqual':
            text = `${getError(error.control_name)} debe ser igual!`;
            break;
        case 'maxLengthFile':
            text = `El campo ${getError(
                error.control_name
            )} no puede contener más de ${error.error_value} archivos`;
            break;
        default:
            text = `${getError(error.control_name)}: ${getError(
                error.control_name
            )}: ${error.error_value}`;
    }
    return text;
}
