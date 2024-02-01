import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActorService } from '../service/actor.service';
import { IActor } from '../actor.model';
import { ActorFormService } from './actor-form.service';

import { ActorUpdateComponent } from './actor-update.component';

describe('Actor Management Update Component', () => {
  let comp: ActorUpdateComponent;
  let fixture: ComponentFixture<ActorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actorFormService: ActorFormService;
  let actorService: ActorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ActorUpdateComponent],
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
      .overrideTemplate(ActorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    actorFormService = TestBed.inject(ActorFormService);
    actorService = TestBed.inject(ActorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const actor: IActor = { id: 456 };

      activatedRoute.data = of({ actor });
      comp.ngOnInit();

      expect(comp.actor).toEqual(actor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActor>>();
      const actor = { id: 123 };
      jest.spyOn(actorFormService, 'getActor').mockReturnValue(actor);
      jest.spyOn(actorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actor }));
      saveSubject.complete();

      // THEN
      expect(actorFormService.getActor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(actorService.update).toHaveBeenCalledWith(expect.objectContaining(actor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActor>>();
      const actor = { id: 123 };
      jest.spyOn(actorFormService, 'getActor').mockReturnValue({ id: null });
      jest.spyOn(actorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actor }));
      saveSubject.complete();

      // THEN
      expect(actorFormService.getActor).toHaveBeenCalled();
      expect(actorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActor>>();
      const actor = { id: 123 };
      jest.spyOn(actorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(actorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
