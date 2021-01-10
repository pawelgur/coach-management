import { MembersTreeService } from "./members-tree.service";
import { Member, Tree } from "../models";
import { TestBed } from "@angular/core/testing";
import { MembersStorageService } from "./members-storage.service";
import { LocalStorageRef } from "./local-storage-ref";

describe("MembersService", () => {
  let treeService: MembersTreeService;

  function setUpTest(membersMock: Record<number, Member>): void {
    TestBed.configureTestingModule({
      providers: [
        MembersTreeService,
        MembersStorageService,
        {
          provide: LocalStorageRef,
          useValue: {
            get: () => ({
              getItem: () => JSON.stringify(membersMock),
              setItem: () => undefined
            })
          }
        }
      ]
    });

    treeService = TestBed.inject(MembersTreeService);
  }

  describe("given complex multi level members dataset", () => {
    const MEMBERS_MOCK: Record<number, Member> = {
        0: { id: 0, fullName: "owner", email: "", trainees: [1, 2, 3, 4] },
          1: { id: 1, fullName: "member 1", email: "", trainees: [], coach: 0 },
          2: { id: 2, fullName: "member 2", email: "", trainees: [5, 6], coach: 1 },
            5: { id: 5, fullName: "member 5", email: "", trainees: [], coach: 2 },
            6: { id: 6, fullName: "member 6", email: "", trainees: [7], coach: 2 },
              7: { id: 7, fullName: "member 7", email: "", trainees: [8], coach: 6 },
                8: { id: 8, fullName: "member 8", email: "", trainees: [], coach: 7 },
          3: { id: 3, fullName: "member 3", email: "", trainees: [], coach: 0 },
          4: { id: 4, fullName: "member 4", email: "", trainees: [9], coach: 0 },
            9: { id: 9, fullName: "member 9", email: "", trainees: [], coach: 9 }
      };

    beforeEach(() => {
      setUpTest(MEMBERS_MOCK);
    });

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

      treeService.getTree$().subscribe(tree =>
        expect(tree).toEqual(expectedTree)
      );
    });

    describe("when nodes with children are deleted", () => {
      it("should assign their children to parent", () => {
        treeService.removeNode(4);

        const expectedTree: Tree<Member> = {
          node: {
            ...MEMBERS_MOCK[0],
            trainees: [1, 2, 3, 9]
          },
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
            { node: { ...MEMBERS_MOCK[9], coach: 0 }, children: [] }
          ]
        };

        treeService.getTree$().subscribe(tree =>
          expect(tree).toEqual(expectedTree)
        );
      });
    });
  });

  describe("given single level members dataset", () => {
    it("should produce correct tree", () => {
      const member = { id: 0, fullName: "owner", email: "", trainees: [] };
      const data: Record<number, Member> = {
        0: member
      };

      setUpTest(data);

      const expectedTree: Tree<Member> = {
        node: member,
        children: []
      };

      treeService.getTree$().subscribe(tree =>
        expect(tree).toEqual(expectedTree)
      );
    });
  });

  describe("given multi level members dataset", () => {
    const MEMBERS_MOCK: Record<number, Member> = {
        0: { id: 0, fullName: "owner", email: "", trainees: [1, 2, 3] },
          1: { id: 1, fullName: "member 1", email: "", trainees: [], coach: 0 },
          2: { id: 2, fullName: "member 2", email: "", trainees: [5], coach: 0 },
            5: { id: 5, fullName: "member 5", email: "", trainees: [], coach: 2 },
          3: { id: 3, fullName: "member 3", email: "", trainees: [], coach: 0 }
      };

    beforeEach(() => {
      setUpTest(MEMBERS_MOCK);
    });

    describe("when node is moved up", () => {
      it("should move it together with children", () => {
        treeService.move(2, "up");

        const expectedTree: Tree<Member> = {
          node: { ...MEMBERS_MOCK[0], trainees: [2, 1, 3] },
          children: [
            {
              node: MEMBERS_MOCK[2],
              children: [
                { node: MEMBERS_MOCK[5], children: [] },
              ]
            },
            { node: MEMBERS_MOCK[1], children: [] },
            { node: MEMBERS_MOCK[3], children: [] }
          ]
        };

        treeService.getTree$().subscribe(tree =>
          expect(tree).toEqual(expectedTree)
        );
      });
    });

    describe("when node is moved down", () => {
      it("should move it together with children", () => {
        treeService.move(2, "down");

        const expectedTree: Tree<Member> = {
          node: { ...MEMBERS_MOCK[0], trainees: [1, 3, 2] },
          children: [
            { node: MEMBERS_MOCK[1], children: [] },
            { node: MEMBERS_MOCK[3], children: [] },
            {
              node: MEMBERS_MOCK[2],
              children: [
                { node: MEMBERS_MOCK[5], children: [] },
              ]
            }
          ]
        };

        treeService.getTree$().subscribe(tree =>
          expect(tree).toEqual(expectedTree)
        );
      });
    });

  });

  describe("given members number above limit", () => {
    it("should not produce tree with more than 2000 nodes", () => {
      const dataset = generateDataset(2500);
      setUpTest(dataset);

      treeService.getTree$().subscribe(tree =>
        expect(tree.children.length).toBe(1999)
      );
    });
  });

});

function generateDataset(count: number): Record<number, Member> {
  const members: Record<number, Member> = {
    0: { id: 0, fullName: "", email: "", trainees: [] }
  };

  for (let i = 1; i < count; i++) {
    members[0].trainees.push(i);
    members[i] = { id: i, fullName: "", email: "", trainees: [], coach: 0 };
  }

  return members;
}
