import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';

import { SimuladorNeoComponent } from './simulador-neo.component';

describe('SimuladorNeoComponent', () => {
  let component: SimuladorNeoComponent;
  let fixture: ComponentFixture<SimuladorNeoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimuladorNeoComponent],
      imports: [IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(SimuladorNeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
