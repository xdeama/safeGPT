import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IActor } from '../actor.model';
import { ActorService } from '../service/actor.service';
import { ActorFormService, ActorFormGroup } from './actor-form.service';

@Component({
  standalone: true,
  selector: 'jhi-actor-update',
  templateUrl: './actor-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ActorUpdateComponent implements OnInit {
  isSaving = false;
  actor: IActor | null = null;

  editForm: ActorFormGroup = this.actorFormService.createActorFormGroup();

  constructor(
    protected actorService: ActorService,
    protected actorFormService: ActorFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actor }) => {
      this.actor = actor;
      if (actor) {
        this.updateForm(actor);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actor = this.actorFormService.getActor(this.editForm);
    if (actor.id !== null) {
      this.subscribeToSaveResponse(this.actorService.update(actor));
    } else {
      this.subscribeToSaveResponse(this.actorService.create(actor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActor>>): void {
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

  protected updateForm(actor: IActor): void {
    this.actor = actor;
    this.actorFormService.resetForm(this.editForm, actor);
  }
}
