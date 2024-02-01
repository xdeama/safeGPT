import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActor, NewActor } from '../actor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActor for edit and NewActorFormGroupInput for create.
 */
type ActorFormGroupInput = IActor | PartialWithRequiredKeyOf<NewActor>;

type ActorFormDefaults = Pick<NewActor, 'id'>;

type ActorFormGroupContent = {
  id: FormControl<IActor['id'] | NewActor['id']>;
  name: FormControl<IActor['name']>;
};

export type ActorFormGroup = FormGroup<ActorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActorFormService {
  createActorFormGroup(actor: ActorFormGroupInput = { id: null }): ActorFormGroup {
    const actorRawValue = {
      ...this.getFormDefaults(),
      ...actor,
    };
    return new FormGroup<ActorFormGroupContent>({
      id: new FormControl(
        { value: actorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(actorRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getActor(form: ActorFormGroup): IActor | NewActor {
    return form.getRawValue() as IActor | NewActor;
  }

  resetForm(form: ActorFormGroup, actor: ActorFormGroupInput): void {
    const actorRawValue = { ...this.getFormDefaults(), ...actor };
    form.reset(
      {
        ...actorRawValue,
        id: { value: actorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ActorFormDefaults {
    return {
      id: null,
    };
  }
}
