import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesTabComponent } from './attributes-tab.component';

describe('AttributesTabComponent', () => {
  let component: AttributesTabComponent;
  let fixture: ComponentFixture<AttributesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
