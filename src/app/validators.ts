import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MemberFormFields } from "./models";

export function casedWordsValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const words = getWords(control);
    return words?.length && words.find(word => word[0] !== word[0].toUpperCase())
      ? { casedWords: control.value }
      : null;
  };
}

export function wordCountValidator(maxWordCount: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const words = getWords(control);
    return words && words.length > maxWordCount
      ? { wordCount: control.value }
      : null;
  };
}

export function uniqueValueValidator(existingValues: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    return existingValues.find(x => x === control.value)
      ? { uniqueValue: control.value }
      : null;
  };
}

export function memberEmailNameValidator(control: FormGroup): ValidationErrors | null {
  const email: string = control.get(MemberFormFields.email)?.value;
  const fullName: string = control.get(MemberFormFields.fullName)?.value;

  if (!email || !fullName) {
    return null;
  }

  return fullName.split(" ").join(".").toLowerCase() !== email.split("@")[0]?.toLowerCase()
    ? { memberEmailName: { email, fullName } }
    : null;
}

function getWords(control: AbstractControl): string[] | undefined {
  return control.value && (control.value as string).split(" ").filter(x => !!x);
}
