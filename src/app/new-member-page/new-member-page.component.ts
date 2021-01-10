import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { filter, tap } from "rxjs/operators";
import { Member, MemberFormFields } from "../models";
import { MembersStorageService } from "../services/members-storage.service";
import { casedWordsValidator, memberEmailNameValidator, uniqueValueValidator, wordCountValidator } from "../validators";

@Component({
  selector: "app-new-member-page",
  templateUrl: "./new-member-page.component.html",
  styleUrls: ["./new-member-page.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewMemberPageComponent implements OnInit {

  coaches: Member[] = [];
  memberForm!: FormGroup;
  showLoader = false;

  constructor(
    private memberStorageService: MembersStorageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.coaches = Object.values(this.memberStorageService.getAll());

    this.memberForm = new FormGroup({
      [MemberFormFields.fullName]: new FormControl("", [
        Validators.required, Validators.min(3), Validators.max(64), Validators.pattern("[a-zA-Z ]*"),
        casedWordsValidator(), wordCountValidator(4), uniqueValueValidator(this.coaches.map(c => c.fullName))
      ]),
      [MemberFormFields.email]: new FormControl("", [Validators.required, Validators.email]),
      [MemberFormFields.coach]: new FormControl("", [Validators.required])
    }, { validators: memberEmailNameValidator as ValidatorFn });

    // set field validity based on form group validator
    this.memberForm.statusChanges.pipe(
      filter(x => x === "INVALID"),
      tap(() => {
        const emailField = this.memberForm.get(MemberFormFields.email)!;
        if (this.memberForm.hasError("memberEmailName") && emailField.valid) {
          emailField.setErrors({ memberEmailName: "" });
        }
      })
    ).subscribe();
  }

  async submit(): Promise<void> {
    this.showLoader = true;
    const rawMember = this.memberForm.getRawValue();
    this.memberStorageService.create(rawMember.fullName, rawMember.email, parseInt(rawMember.coach, 10));

    await new Promise(r => setTimeout(() => r(), 500)); // emulate server call for more realistic UI
    await this.router.navigate(["/members"]);
    this.showLoader = false;
  }

  getNameError(): string | undefined {
    const nameField = this.memberForm.get(MemberFormFields.fullName)!;
    if (nameField.hasError("casedWords")) {
      return "All words should start from uppercase";
    }
    if (nameField.hasError("wordCount")) {
      return "Max 4 words allowed";
    }
    if (nameField.hasError("uniqueValue")) {
      return "Name already exists";
    }

    return undefined;
  }

  getEmailError(): string | undefined {
    const emailField = this.memberForm.get(MemberFormFields.email)!;
    if (emailField.hasError("email")) {
      return "It is not valid email address";
    }
    if (this.memberForm.hasError("memberEmailName")) {
      return "Email should match full name name.surname@example.com";
    }

    return undefined;
  }

}
