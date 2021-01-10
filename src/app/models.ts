export interface Member {
  id: number;
  fullName: string;
  email: string;
  trainees: number[];
  coach?: number;
}

export interface Tree<TNode> {
  node: TNode;
  children: Tree<TNode>[];
}

export const enum MemberFormFields {
  fullName = "fullName",
  email = "email",
  coach = "coach"
}
