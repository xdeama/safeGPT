import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IActor } from '../actor.model';
import { ActorService } from '../service/actor.service';

export const actorResolve = (route: ActivatedRouteSnapshot): Observable<null | IActor> => {
  const id = route.params['id'];
  if (id) {
    return inject(ActorService)
      .find(id)
      .pipe(
        mergeMap((actor: HttpResponse<IActor>) => {
          if (actor.body) {
            return of(actor.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default actorResolve;
