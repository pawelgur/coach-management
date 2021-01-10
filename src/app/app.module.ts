import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NewMemberPageComponent } from "./new-member-page/new-member-page.component";
import { AllMembersPageComponent } from "./all-members-page/all-members-page.component";
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component";
import { MaterialModule } from "./material.module";
import { MemberComponent } from "./all-members-page/member/member.component";

@NgModule({
  declarations: [
    AppComponent,
    NewMemberPageComponent,
    AllMembersPageComponent,
    NotFoundPageComponent,
    MemberComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
