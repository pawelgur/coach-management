import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Member, Tree} from "../models";
import { MembersTreeService } from "../services/members-tree.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-all-members-page',
  templateUrl: './all-members-page.component.html',
  styleUrls: ['./all-members-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllMembersPageComponent {

  membersTree$: Observable<Tree<Member>>;

  constructor(
    private membersTreeService: MembersTreeService
  ) {
    // not nice from performance perspective to completely regenerate whole tree for each update,
    // would be better to make parts immutable and rebuild only changed leaves
    this.membersTree$ = membersTreeService.getTree$();
  }

}
