import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActorDetailComponent } from './actor-detail.component';

describe('Actor Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActorDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ActorDetailComponent,
              resolve: { actor: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ActorDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load actor on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ActorDetailComponent);

      // THEN
      expect(instance.actor).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
