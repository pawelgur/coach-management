import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMembersPageComponent } from './all-members-page.component';

describe('AllMembersPageComponent', () => {
  let component: AllMembersPageComponent;
  let fixture: ComponentFixture<AllMembersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMembersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMembersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
