export interface Member {
  id: number;
  fullName: string;
  email: string;
  trainees: number[];
}

/**
 * model saved in database with extra parent link for fast removal
 */
export interface DbMember extends Member {
  coach: number | undefined;
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
