import { MembersTreeService } from "./members-tree.service";
import { Member, Tree } from "../models";

describe("MembersService", () => {
  let service: MembersTreeService;

  const MEMBERS_MOCK: Record<number, Member> = {
    0: { id: 0, fullName: "owner", email: "", trainees: [1, 2, 3, 4] },
      1: { id: 1, fullName: "member 1", email: "", trainees: [] },
      2: { id: 2, fullName: "member 2", email: "", trainees: [5, 6] },
        5: { id: 5, fullName: "member 5", email: "", trainees: [] },
        6: { id: 6, fullName: "member 6", email: "", trainees: [7] },
          7: { id: 7, fullName: "member 7", email: "", trainees: [8] },
            8: { id: 8, fullName: "member 8", email: "", trainees: [] },
      3: { id: 3, fullName: "member 3", email: "", trainees: [] },
      4: { id: 4, fullName: "member 4", email: "", trainees: [9] },
        9: { id: 9, fullName: "member 9", email: "", trainees: [] }
  };

  beforeEach(() => service = new MembersTreeService()); // no point using TestBed for service without deps

  describe("given multi level members dataset", () => {
    it("should produce correct tree", () => {
      const expectedTree: Tree<Member> = {
        node: MEMBERS_MOCK[0],
        children: [
          { node: MEMBERS_MOCK[1], children: [] },
          {
            node: MEMBERS_MOCK[2],
            children: [
              { node: MEMBERS_MOCK[5], children: [] },
              {
                node: MEMBERS_MOCK[6],
                children: [
                  {
                    node: MEMBERS_MOCK[7],
                    children: [
                      { node: MEMBERS_MOCK[8], children: [] }
                    ]
                  }
                ]
              }
            ]
          },
          { node: MEMBERS_MOCK[3], children: [] },
          {
            node: MEMBERS_MOCK[4],
            children: [
              { node: MEMBERS_MOCK[9], children: [] }
            ]
          },
        ]
      };

      expect(service.generateTree(MEMBERS_MOCK)).toEqual(expectedTree);
    });
  });

  describe("given single level members dataset", () => {
    it("should produce correct tree", () => {
      const data: Record<number, Member> = {
        0: MEMBERS_MOCK[0]
      };
      const expectedTree: Tree<Member> = {
        node: MEMBERS_MOCK[0],
        children: []
      };

      expect(service.generateTree(data)).toEqual(expectedTree);
    });
  });

  describe("given members number above limit", () => {
    it("should not produce tree with more than 2000 nodes", () => {
      const dataset = generateDataset(2500);
      const generatedTree = service.generateTree(dataset);

      expect(generatedTree.children.length).toBe(1999);
    });
  });

});

function generateDataset(count: number): Record<number, Member> {
  const members: Record<number, Member> = {
    0: { id: 0, fullName: "", email: "", trainees: [] }
  };

  for (let i = 1; i < count; i++) {
    members[0].trainees.push(i);
    members[i] = { id: i, fullName: "", email: "", trainees: [] };
  }

  return members;
}
