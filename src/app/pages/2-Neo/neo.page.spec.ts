import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { NeoPageModule } from './neo.module';
import { NeoPage } from './neo.page';

describe('NeoPage', () => {
  let component: NeoPage;
  let fixture: ComponentFixture<NeoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeoPageModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(NeoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
