import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ActorComponent } from './list/actor.component';
import { ActorDetailComponent } from './detail/actor-detail.component';
import { ActorUpdateComponent } from './update/actor-update.component';
import ActorResolve from './route/actor-routing-resolve.service';

const actorRoute: Routes = [
  {
    path: '',
    component: ActorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActorDetailComponent,
    resolve: {
      actor: ActorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActorUpdateComponent,
    resolve: {
      actor: ActorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActorUpdateComponent,
    resolve: {
      actor: ActorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default actorRoute;
