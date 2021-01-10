import {Injectable} from "@angular/core";
import { DbMember, Member } from "../models";

const storageKey = "coachManagement.members";

@Injectable({ providedIn: "root" })
export class MembersStorageService {

  private lastId = 0;
  private membersDatabase: Record<number, DbMember> = {};

  constructor() {
    this.loadFromStorage();
  }

  getAll(): Record<number, Member> {
    return this.membersDatabase;
  }

  get(id: number): Member | undefined {
    return this.membersDatabase[id];
  }

  create(fullName: string, email: string, coachId: number): Member {
    this.lastId++;
    const member = { fullName, email, coach: coachId, id: this.lastId, trainees: [] };
    const coach = this.membersDatabase[coachId]!;

    console.log("creating member", member);
    this.set(member);
    this.set({ ...coach, trainees: [...coach.trainees, member.id] });
    this.updateStorage();

    return member;
  }

  remove(id: number): void {
    const member = this.membersDatabase[id];
    if (!member) {
      return;
    }

    console.log("removing member", member);
    delete this.membersDatabase[id];

    const coach = member.coach && this.membersDatabase[member.coach];
    if (coach) {
      this.set({ ...coach, trainees: coach.trainees.filter(x => x !== member.id) });
    }

    this.updateStorage();
  }

  private set(member: DbMember): void {
    this.membersDatabase[member.id] = member;
  }

  private loadFromStorage(): void {
    const itemsRaw = window?.localStorage?.getItem(storageKey);
    if (itemsRaw) {
      this.membersDatabase = JSON.parse(itemsRaw);
      const ids = Object.keys(this.membersDatabase);
      this.lastId = parseInt(ids.sort().pop() || "0", 10);
      return;
    }

    this.membersDatabase = {
      0: { fullName: "Penelope Randi", email: "penelope.randi@example.com", id: 0, trainees: [], coach: undefined }
    };
    this.lastId = 0;
  }

  private updateStorage(): void {
    window?.localStorage?.setItem(storageKey, JSON.stringify(this.membersDatabase));
  }

}
