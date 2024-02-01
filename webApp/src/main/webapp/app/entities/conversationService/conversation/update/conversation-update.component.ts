import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProvider } from 'app/entities/conversationService/provider/provider.model';
import { ProviderService } from 'app/entities/conversationService/provider/service/provider.service';
import { IMessage } from 'app/entities/conversationService/message/message.model';
import { MessageService } from 'app/entities/conversationService/message/service/message.service';
import { ConversationService } from '../service/conversation.service';
import { IConversation } from '../conversation.model';
import { ConversationFormService, ConversationFormGroup } from './conversation-form.service';

@Component({
  standalone: true,
  selector: 'jhi-conversation-update',
  templateUrl: './conversation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ConversationUpdateComponent implements OnInit {
  isSaving = false;
  conversation: IConversation | null = null;

  providersCollection: IProvider[] = [];
  messagesSharedCollection: IMessage[] = [];

  editForm: ConversationFormGroup = this.conversationFormService.createConversationFormGroup();

  constructor(
    protected conversationService: ConversationService,
    protected conversationFormService: ConversationFormService,
    protected providerService: ProviderService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareProvider = (o1: IProvider | null, o2: IProvider | null): boolean => this.providerService.compareProvider(o1, o2);

  compareMessage = (o1: IMessage | null, o2: IMessage | null): boolean => this.messageService.compareMessage(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conversation }) => {
      this.conversation = conversation;
      if (conversation) {
        this.updateForm(conversation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const conversation = this.conversationFormService.getConversation(this.editForm);
    if (conversation.id !== null) {
      this.subscribeToSaveResponse(this.conversationService.update(conversation));
    } else {
      this.subscribeToSaveResponse(this.conversationService.create(conversation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConversation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(conversation: IConversation): void {
    this.conversation = conversation;
    this.conversationFormService.resetForm(this.editForm, conversation);

    this.providersCollection = this.providerService.addProviderToCollectionIfMissing<IProvider>(
      this.providersCollection,
      conversation.provider,
    );
    this.messagesSharedCollection = this.messageService.addMessageToCollectionIfMissing<IMessage>(
      this.messagesSharedCollection,
      conversation.message,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.providerService
      .query({ filter: 'conversation-is-null' })
      .pipe(map((res: HttpResponse<IProvider[]>) => res.body ?? []))
      .pipe(
        map((providers: IProvider[]) =>
          this.providerService.addProviderToCollectionIfMissing<IProvider>(providers, this.conversation?.provider),
        ),
      )
      .subscribe((providers: IProvider[]) => (this.providersCollection = providers));

    this.messageService
      .query()
      .pipe(map((res: HttpResponse<IMessage[]>) => res.body ?? []))
      .pipe(
        map((messages: IMessage[]) => this.messageService.addMessageToCollectionIfMissing<IMessage>(messages, this.conversation?.message)),
      )
      .subscribe((messages: IMessage[]) => (this.messagesSharedCollection = messages));
  }
}
