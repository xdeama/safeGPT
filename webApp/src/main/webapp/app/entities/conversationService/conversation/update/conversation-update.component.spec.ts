import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IProvider } from 'app/entities/conversationService/provider/provider.model';
import { ProviderService } from 'app/entities/conversationService/provider/service/provider.service';
import { IMessage } from 'app/entities/conversationService/message/message.model';
import { MessageService } from 'app/entities/conversationService/message/service/message.service';
import { IConversation } from '../conversation.model';
import { ConversationService } from '../service/conversation.service';
import { ConversationFormService } from './conversation-form.service';

import { ConversationUpdateComponent } from './conversation-update.component';

describe('Conversation Management Update Component', () => {
  let comp: ConversationUpdateComponent;
  let fixture: ComponentFixture<ConversationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let conversationFormService: ConversationFormService;
  let conversationService: ConversationService;
  let providerService: ProviderService;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ConversationUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ConversationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConversationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    conversationFormService = TestBed.inject(ConversationFormService);
    conversationService = TestBed.inject(ConversationService);
    providerService = TestBed.inject(ProviderService);
    messageService = TestBed.inject(MessageService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call provider query and add missing value', () => {
      const conversation: IConversation = { id: 456 };
      const provider: IProvider = { id: 4234 };
      conversation.provider = provider;

      const providerCollection: IProvider[] = [{ id: 28672 }];
      jest.spyOn(providerService, 'query').mockReturnValue(of(new HttpResponse({ body: providerCollection })));
      const expectedCollection: IProvider[] = [provider, ...providerCollection];
      jest.spyOn(providerService, 'addProviderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ conversation });
      comp.ngOnInit();

      expect(providerService.query).toHaveBeenCalled();
      expect(providerService.addProviderToCollectionIfMissing).toHaveBeenCalledWith(providerCollection, provider);
      expect(comp.providersCollection).toEqual(expectedCollection);
    });

    it('Should call Message query and add missing value', () => {
      const conversation: IConversation = { id: 456 };
      const message: IMessage = { id: 12694 };
      conversation.message = message;

      const messageCollection: IMessage[] = [{ id: 2972 }];
      jest.spyOn(messageService, 'query').mockReturnValue(of(new HttpResponse({ body: messageCollection })));
      const additionalMessages = [message];
      const expectedCollection: IMessage[] = [...additionalMessages, ...messageCollection];
      jest.spyOn(messageService, 'addMessageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ conversation });
      comp.ngOnInit();

      expect(messageService.query).toHaveBeenCalled();
      expect(messageService.addMessageToCollectionIfMissing).toHaveBeenCalledWith(
        messageCollection,
        ...additionalMessages.map(expect.objectContaining),
      );
      expect(comp.messagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const conversation: IConversation = { id: 456 };
      const provider: IProvider = { id: 15922 };
      conversation.provider = provider;
      const message: IMessage = { id: 21324 };
      conversation.message = message;

      activatedRoute.data = of({ conversation });
      comp.ngOnInit();

      expect(comp.providersCollection).toContain(provider);
      expect(comp.messagesSharedCollection).toContain(message);
      expect(comp.conversation).toEqual(conversation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConversation>>();
      const conversation = { id: 123 };
      jest.spyOn(conversationFormService, 'getConversation').mockReturnValue(conversation);
      jest.spyOn(conversationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conversation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conversation }));
      saveSubject.complete();

      // THEN
      expect(conversationFormService.getConversation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(conversationService.update).toHaveBeenCalledWith(expect.objectContaining(conversation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConversation>>();
      const conversation = { id: 123 };
      jest.spyOn(conversationFormService, 'getConversation').mockReturnValue({ id: null });
      jest.spyOn(conversationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conversation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conversation }));
      saveSubject.complete();

      // THEN
      expect(conversationFormService.getConversation).toHaveBeenCalled();
      expect(conversationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConversation>>();
      const conversation = { id: 123 };
      jest.spyOn(conversationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conversation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(conversationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProvider', () => {
      it('Should forward to providerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(providerService, 'compareProvider');
        comp.compareProvider(entity, entity2);
        expect(providerService.compareProvider).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareMessage', () => {
      it('Should forward to messageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(messageService, 'compareMessage');
        comp.compareMessage(entity, entity2);
        expect(messageService.compareMessage).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
