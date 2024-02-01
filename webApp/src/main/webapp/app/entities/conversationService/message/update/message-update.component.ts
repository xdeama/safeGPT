import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IActor } from 'app/entities/conversationService/actor/actor.model';
import { ActorService } from 'app/entities/conversationService/actor/service/actor.service';
import { MessageService } from '../service/message.service';
import { IMessage } from '../message.model';
import { MessageFormService, MessageFormGroup } from './message-form.service';

@Component({
  standalone: true,
  selector: 'jhi-message-update',
  templateUrl: './message-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MessageUpdateComponent implements OnInit {
  isSaving = false;
  message: IMessage | null = null;

  repsonsesCollection: IMessage[] = [];
  actorsCollection: IActor[] = [];

  editForm: MessageFormGroup = this.messageFormService.createMessageFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected messageFormService: MessageFormService,
    protected actorService: ActorService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareMessage = (o1: IMessage | null, o2: IMessage | null): boolean => this.messageService.compareMessage(o1, o2);

  compareActor = (o1: IActor | null, o2: IActor | null): boolean => this.actorService.compareActor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ message }) => {
      this.message = message;
      if (message) {
        this.updateForm(message);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('webApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const message = this.messageFormService.getMessage(this.editForm);
    if (message.id !== null) {
      this.subscribeToSaveResponse(this.messageService.update(message));
    } else {
      this.subscribeToSaveResponse(this.messageService.create(message));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMessage>>): void {
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

  protected updateForm(message: IMessage): void {
    this.message = message;
    this.messageFormService.resetForm(this.editForm, message);

    this.repsonsesCollection = this.messageService.addMessageToCollectionIfMissing<IMessage>(this.repsonsesCollection, message.repsonse);
    this.actorsCollection = this.actorService.addActorToCollectionIfMissing<IActor>(this.actorsCollection, message.actor);
  }

  protected loadRelationshipsOptions(): void {
    this.messageService
      .query({ filter: 'message-is-null' })
      .pipe(map((res: HttpResponse<IMessage[]>) => res.body ?? []))
      .pipe(map((messages: IMessage[]) => this.messageService.addMessageToCollectionIfMissing<IMessage>(messages, this.message?.repsonse)))
      .subscribe((messages: IMessage[]) => (this.repsonsesCollection = messages));

    this.actorService
      .query({ filter: 'message-is-null' })
      .pipe(map((res: HttpResponse<IActor[]>) => res.body ?? []))
      .pipe(map((actors: IActor[]) => this.actorService.addActorToCollectionIfMissing<IActor>(actors, this.message?.actor)))
      .subscribe((actors: IActor[]) => (this.actorsCollection = actors));
  }
}
