import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { Member, Tree } from "../../models";
import { MembersTreeService } from "../../services/members-tree.service";

@Component({
  selector: "app-member",
  templateUrl: "./member.component.html",
  styleUrls: ["./member.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberComponent implements OnInit {

  @Input() memberNode!: Tree<Member>;

  constructor(
    private membersTreeService: MembersTreeService
  ) {
  }

  ngOnInit(): void {
  }

  trackById(index: number, item: Tree<Member>): number {
    return item.node.id;
  }

  remove(): void {
    this.membersTreeService.removeNode(this.memberNode.node.id);
  }

  moveUp(): void {
    this.membersTreeService.move(this.memberNode.node.id, "up");
  }

  moveDown(): void {
    this.membersTreeService.move(this.memberNode.node.id, "down");
  }

  canMoveUp(): boolean {
    return this.membersTreeService.canMoveUp(this.memberNode.node.id);
  }

  canMoveDown(): boolean {
    return this.membersTreeService.canMoveDown(this.memberNode.node.id);
  }

}
