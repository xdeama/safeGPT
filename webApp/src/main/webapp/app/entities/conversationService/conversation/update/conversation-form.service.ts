import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IConversation, NewConversation } from '../conversation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConversation for edit and NewConversationFormGroupInput for create.
 */
type ConversationFormGroupInput = IConversation | PartialWithRequiredKeyOf<NewConversation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IConversation | NewConversation> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

type ConversationFormRawValue = FormValueOf<IConversation>;

type NewConversationFormRawValue = FormValueOf<NewConversation>;

type ConversationFormDefaults = Pick<NewConversation, 'id' | 'startDate'>;

type ConversationFormGroupContent = {
  id: FormControl<ConversationFormRawValue['id'] | NewConversation['id']>;
  startDate: FormControl<ConversationFormRawValue['startDate']>;
  provider: FormControl<ConversationFormRawValue['provider']>;
  message: FormControl<ConversationFormRawValue['message']>;
};

export type ConversationFormGroup = FormGroup<ConversationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConversationFormService {
  createConversationFormGroup(conversation: ConversationFormGroupInput = { id: null }): ConversationFormGroup {
    const conversationRawValue = this.convertConversationToConversationRawValue({
      ...this.getFormDefaults(),
      ...conversation,
    });
    return new FormGroup<ConversationFormGroupContent>({
      id: new FormControl(
        { value: conversationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startDate: new FormControl(conversationRawValue.startDate, {
        validators: [Validators.required],
      }),
      provider: new FormControl(conversationRawValue.provider),
      message: new FormControl(conversationRawValue.message),
    });
  }

  getConversation(form: ConversationFormGroup): IConversation | NewConversation {
    return this.convertConversationRawValueToConversation(form.getRawValue() as ConversationFormRawValue | NewConversationFormRawValue);
  }

  resetForm(form: ConversationFormGroup, conversation: ConversationFormGroupInput): void {
    const conversationRawValue = this.convertConversationToConversationRawValue({ ...this.getFormDefaults(), ...conversation });
    form.reset(
      {
        ...conversationRawValue,
        id: { value: conversationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ConversationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
    };
  }

  private convertConversationRawValueToConversation(
    rawConversation: ConversationFormRawValue | NewConversationFormRawValue,
  ): IConversation | NewConversation {
    return {
      ...rawConversation,
      startDate: dayjs(rawConversation.startDate, DATE_TIME_FORMAT),
    };
  }

  private convertConversationToConversationRawValue(
    conversation: IConversation | (Partial<NewConversation> & ConversationFormDefaults),
  ): ConversationFormRawValue | PartialWithRequiredKeyOf<NewConversationFormRawValue> {
    return {
      ...conversation,
      startDate: conversation.startDate ? conversation.startDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
