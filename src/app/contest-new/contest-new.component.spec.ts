import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestNewComponent } from './contest-new.component';

describe('ContestNewComponent', () => {
  let component: ContestNewComponent;
  let fixture: ComponentFixture<ContestNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContestNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContestNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
