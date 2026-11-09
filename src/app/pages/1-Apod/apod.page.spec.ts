import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { ApodPageModule } from './apod.module';
import { ApodPage } from './apod.page';

describe('ApodPage', () => {
  let component: ApodPage;
  let fixture: ComponentFixture<ApodPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApodPageModule, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ApodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
