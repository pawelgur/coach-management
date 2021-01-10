import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AllMembersPageComponent } from "./all-members-page/all-members-page.component";
import { NewMemberPageComponent } from "./new-member-page/new-member-page.component";
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "members",
    pathMatch: "full"
  },
  {
    path: "members",
    component: AllMembersPageComponent,
    pathMatch: "full"
  },
  {
    path: "new-member",
    component: NewMemberPageComponent,
    pathMatch: "full"
  },
  {
    path: "**",
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
