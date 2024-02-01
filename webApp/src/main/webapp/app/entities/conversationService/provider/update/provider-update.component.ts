import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProvider } from '../provider.model';
import { ProviderService } from '../service/provider.service';
import { ProviderFormService, ProviderFormGroup } from './provider-form.service';

@Component({
  standalone: true,
  selector: 'jhi-provider-update',
  templateUrl: './provider-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProviderUpdateComponent implements OnInit {
  isSaving = false;
  provider: IProvider | null = null;

  editForm: ProviderFormGroup = this.providerFormService.createProviderFormGroup();

  constructor(
    protected providerService: ProviderService,
    protected providerFormService: ProviderFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ provider }) => {
      this.provider = provider;
      if (provider) {
        this.updateForm(provider);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const provider = this.providerFormService.getProvider(this.editForm);
    if (provider.id !== null) {
      this.subscribeToSaveResponse(this.providerService.update(provider));
    } else {
      this.subscribeToSaveResponse(this.providerService.create(provider));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProvider>>): void {
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

  protected updateForm(provider: IProvider): void {
    this.provider = provider;
    this.providerFormService.resetForm(this.editForm, provider);
  }
}
