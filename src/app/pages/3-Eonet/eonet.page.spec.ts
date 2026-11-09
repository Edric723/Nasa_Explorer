import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { EonetPageModule } from './eonet.module';
import { EonetPage } from './eonet.page';

describe('EonetPage', () => {
  let component: EonetPage;
  let fixture: ComponentFixture<EonetPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EonetPageModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EonetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
