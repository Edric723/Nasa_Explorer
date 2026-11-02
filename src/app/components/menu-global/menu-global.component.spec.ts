import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';

import { MenuGlobalComponent } from './menu-global.component';

describe('MenuGlobalComponent', () => {
  let component: MenuGlobalComponent;
  let fixture: ComponentFixture<MenuGlobalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuGlobalComponent],
      imports: [IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(MenuGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
