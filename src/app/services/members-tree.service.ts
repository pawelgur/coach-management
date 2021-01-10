import { Injectable } from "@angular/core";
import { Member, Tree } from "../models";
import { BehaviorSubject, Observable } from "rxjs";
import { MembersStorageService } from "./members-storage.service";
import { map } from "rxjs/operators";

const maxTreeSize = 2000;

@Injectable({ providedIn: "root" })
export class MembersTreeService {

  private members$: BehaviorSubject<Record<number, Member>>;

  constructor(
    private membersStorageService: MembersStorageService
  ) {
    this.members$ = new BehaviorSubject<Record<number, Member>>(membersStorageService.getAll());
  }

  removeNode(id: number): void {
    this.membersStorageService.remove(id);
    this.members$.next(this.membersStorageService.getAll());
  }

  move(id: number, direction: "up" | "down"): void {
    this.membersStorageService.move(id, direction);
    this.members$.next(this.membersStorageService.getAll());
  }

  canMoveUp(id: number): boolean {
    const coach = this.membersStorageService.getCoach(id);
    return !!coach?.trainees.length && coach.trainees[0] !== id;
  }

  canMoveDown(id: number): boolean {
    const coach = this.membersStorageService.getCoach(id);
    return !!coach?.trainees.length && coach.trainees[coach.trainees.length - 1] !== id;
  }

  getTree$(): Observable<Tree<Member>> {
    return this.members$.pipe(
      map(members => this.generateTree(members))
    );
  }

  // note: alternatively can be implemented with recursion
  private generateTree(members: Record<number, Member>): Tree<Member> {
    const rootMember = members[0]!;
    const tree: Tree<Member> = { node: rootMember, children: [] };
    const stack: Tree<Member>[] = [];

    let currentTree = tree;
    let treeSize = 1;
    stack.push(currentTree);
    do {
      // find child that was not yet traversed
      const nextChild = currentTree.node.trainees.find(id =>
        !currentTree.children.find(traversedChild => traversedChild.node.id === id)
      );

      if (!nextChild || treeSize === maxTreeSize) {
        stack.pop();
        currentTree = stack[stack.length - 1];
        continue;
      }

      if (!members[nextChild]) {
        console.warn(`no member data found for child ${nextChild} of ${currentTree.node.id}, data got corrupted`);
        currentTree.node.trainees = currentTree.node.trainees.filter(x => x !== nextChild);
        continue;
      }

      const nextMember = members[nextChild];
      const newTree = { node: nextMember, children: [] };
      currentTree.children.push(newTree);
      stack.push(newTree);
      currentTree = newTree;
      treeSize++;
    } while (stack.length);

    return tree;
  }

}
