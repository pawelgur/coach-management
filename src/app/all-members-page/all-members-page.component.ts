import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Member, Tree} from "../models";
import { MembersStorageService } from "../services/members-storage.service";
import { MembersTreeService } from "../services/members-tree.service";

@Component({
  selector: 'app-all-members-page',
  templateUrl: './all-members-page.component.html',
  styleUrls: ['./all-members-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllMembersPageComponent implements OnInit {

  membersTree!: Tree<Member>;

  constructor(
    private membersStorageService: MembersStorageService,
    private membersTreeService: MembersTreeService
  ) { }

  ngOnInit(): void {
    this.membersTree = this.membersTreeService.generateTree(this.membersStorageService.getAll());
  }

}
