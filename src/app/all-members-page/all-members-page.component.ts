import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Member, Tree} from "../models";

@Component({
  selector: 'app-all-members-page',
  templateUrl: './all-members-page.component.html',
  styleUrls: ['./all-members-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllMembersPageComponent implements OnInit {

  members: Tree<Member> = {
    node: { fullName: "Penelope Randi", email: "penelope.randi@example.com" },
    children: [
      { node: { fullName: "Penelope Randi Child 1", email: "penelope.randi@example.com" } },
      {
        node: { fullName: "Penelope Randi Child 2", email: "penelope.randi@example.com" },
        children: [
          {
            node: { fullName: "Penelope Randi 2 Grand Child", email: "penelope.randi@example.com" },
            children: [{ node: { fullName: "Penelope Randi Granddd", email: "penelope.randi@example.com" } }]
          },
        ]
      },
      { node: { fullName: "Penelope Randi Child 3", email: "penelope.randi@example.com" } },
    ]
  }

  constructor() { }

  ngOnInit(): void {
  }

}
