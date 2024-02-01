import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProviderDetailComponent } from './provider-detail.component';

describe('Provider Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProviderDetailComponent,
              resolve: { provider: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProviderDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load provider on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProviderDetailComponent);

      // THEN
      expect(instance.provider).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
