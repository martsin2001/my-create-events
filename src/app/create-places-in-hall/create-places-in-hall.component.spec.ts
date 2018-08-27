import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlacesInHallComponent } from './create-places-in-hall.component';

describe('CreatePlacesInHallComponent', () => {
  let component: CreatePlacesInHallComponent;
  let fixture: ComponentFixture<CreatePlacesInHallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePlacesInHallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePlacesInHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
