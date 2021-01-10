import { Injectable } from "@angular/core";
import { Member, Tree } from "../models";

const maxTreeSize = 2000;

@Injectable({ providedIn: "root" })
export class MembersTreeService {

  // note: alternatively can be implemented with recursion
  generateTree(members: Record<number, Member>): Tree<Member> {
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

      if (!nextChild || !members[nextChild] || treeSize === maxTreeSize) {
        stack.pop();
        currentTree = stack[stack.length - 1];
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
