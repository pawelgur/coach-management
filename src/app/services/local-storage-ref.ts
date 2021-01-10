import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class LocalStorageRef {

  get(): Storage  {
    return window.localStorage;
  }

}
