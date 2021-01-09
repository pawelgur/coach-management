export interface Member {
  id?: number;
  fullName: string;
  email: string;
  coach?: number;
}

export interface Tree<TNode> {
  node: TNode;
  children?: Tree<TNode>[];
}
