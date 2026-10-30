import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { LoginPage } from "./login.page";

const routes = [
  {
    path: "",
    component: LoginPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
