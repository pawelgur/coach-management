import {Injectable} from "@angular/core";
import { Member } from "../models";
import { LocalStorageRef } from "./local-storage-ref";

const storageKey = "coachManagement.members";

@Injectable({ providedIn: "root" })
export class MembersStorageService {

  private lastId = 0;
  private membersDatabase: Record<number, Member> = {};

  constructor(
    private storageRef: LocalStorageRef
  ) {
    this.loadFromStorage();
  }

  getAll(): Record<number, Member> {
    return this.membersDatabase;
  }

  get(id: number): Member | undefined {
    return this.membersDatabase[id];
  }

  getCoach(memberId: number): Member | undefined {
    const member = this.membersDatabase[memberId];
    if (member?.coach === undefined) {
      return;
    }
    return this.membersDatabase[member.coach];
  }

  create(fullName: string, email: string, coachId: number): Member {
    this.lastId++;
    const member = { fullName, email, coach: coachId, id: this.lastId, trainees: [] };
    const coach = this.membersDatabase[coachId]!;

    this.set(member);
    this.set({ ...coach, trainees: [...coach.trainees, member.id] });
    console.log("member created", member, "new state:", this.membersDatabase);

    return member;
  }

  move(id: number, direction: "up" | "down"): void {
    const coach = this.getCoach(id);
    if (!coach) {
      return;
    }

    const i = coach.trainees.indexOf(id);
    const before = coach.trainees.slice(0, i);
    const after = coach.trainees.slice(i + 1);
    switch (direction) {
      case "up":
        if (!before.length) {
          return;
        }
        const elementBefore = before.pop();
        before.push(id);
        if (elementBefore !== undefined) {
          before.push(elementBefore);
        }
        break;
      case "down":
        if (!after.length) {
          return;
        }
        const elementAfter = after.shift();
        if (elementAfter !== undefined) {
          before.push(elementAfter);
        }
        before.push(id);
        break;
    }

    this.set({ ...coach, trainees: [...before, ...after] });
    console.log("member moved", id, "new state:", this.membersDatabase);
  }

  remove(id: number): void {
    const member = this.membersDatabase[id];
    if (!member) {
      return;
    }

    const coach = this.getCoach(id);
    if (coach) {
      const newTrainees = coach.trainees.filter(x => x !== member.id);
      for (const traineeId of member.trainees) {
        const trainee = this.get(traineeId);
        if (trainee) {
          newTrainees.push(traineeId);
          this.set({ ...trainee, coach: coach.id });
        }
        this.set({...coach, trainees: newTrainees});
      }
    }

    delete this.membersDatabase[id];
    this.updateStorage();

    console.log("member removed", member, "new state:", this.membersDatabase);
  }

  private set(member: Member): void {
    this.membersDatabase[member.id] = member;
    this.updateStorage();
  }

  private loadFromStorage(): void {
    const itemsRaw = this.storageRef.get().getItem(storageKey);
    if (itemsRaw) {
      this.membersDatabase = JSON.parse(itemsRaw);
      const ids = Object.keys(this.membersDatabase);
      this.lastId = parseInt(ids.sort().pop() || "0", 10);
      console.log("database loaded", this.membersDatabase);
      return;
    }

    this.membersDatabase = {
      0: { fullName: "Penelope Randi", email: "penelope.randi@example.com", id: 0, trainees: [], coach: undefined }
    };
    this.lastId = 0;
  }

  private updateStorage(): void {
    this.storageRef.get().setItem(storageKey, JSON.stringify(this.membersDatabase));
  }

}
