import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ConversationDetailComponent } from './conversation-detail.component';

describe('Conversation Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ConversationDetailComponent,
              resolve: { conversation: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ConversationDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load conversation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ConversationDetailComponent);

      // THEN
      expect(instance.conversation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
