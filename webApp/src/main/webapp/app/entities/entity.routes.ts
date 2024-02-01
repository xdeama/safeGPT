import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'message',
    data: { pageTitle: 'webApp.conversationServiceMessage.home.title' },
    loadChildren: () => import('./conversationService/message/message.routes'),
  },
  {
    path: 'conversation',
    data: { pageTitle: 'webApp.conversationServiceConversation.home.title' },
    loadChildren: () => import('./conversationService/conversation/conversation.routes'),
  },
  {
    path: 'provider',
    data: { pageTitle: 'webApp.conversationServiceProvider.home.title' },
    loadChildren: () => import('./conversationService/provider/provider.routes'),
  },
  {
    path: 'actor',
    data: { pageTitle: 'webApp.conversationServiceActor.home.title' },
    loadChildren: () => import('./conversationService/actor/actor.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
