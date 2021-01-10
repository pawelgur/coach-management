import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {Member, Tree} from "../../models";
import { MembersTreeService } from "../../services/members-tree.service";

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberComponent implements OnInit {

  @Input("member") memberNode!: Tree<Member>;

  constructor(
    private membersTreeService: MembersTreeService
  ) { }

  ngOnInit(): void {
  }

  trackById(_index: number, item: Tree<Member>): number {
    return item.node.id;
  }

  remove() {
    this.membersTreeService.removeNode(this.memberNode.node.id);
  }

  moveUp() {

  }

  moveDown() {

  }

}
