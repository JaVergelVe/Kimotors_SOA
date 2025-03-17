import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaMotoComponent } from './vista-moto.component';

describe('VistaMotoComponent', () => {
  let component: VistaMotoComponent;
  let fixture: ComponentFixture<VistaMotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaMotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaMotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
