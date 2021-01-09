import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Member} from "../models";

@Component({
  selector: 'app-new-member-page',
  templateUrl: './new-member-page.component.html',
  styleUrls: ['./new-member-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewMemberPageComponent implements OnInit {

  coaches: Member[] = [
    {
      id: 1,
      fullName: "Peter Morell",
      email: ""
    },
    {
      id: 2,
      fullName: "Marta Wagner",
      email: ""
    },
    {
      id: 3,
      fullName: "Lare Heartridge",
      email: ""
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
