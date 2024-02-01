import NavbarItem from 'app/layouts/navbar/navbar-item.model';

export const EntityNavbarItems: NavbarItem[] = [
  {
    name: 'Message',
    route: '/message',
    translationKey: 'global.menu.entities.conversationServiceMessage',
  },
  {
    name: 'Conversation',
    route: '/conversation',
    translationKey: 'global.menu.entities.conversationServiceConversation',
  },
  {
    name: 'Provider',
    route: '/provider',
    translationKey: 'global.menu.entities.conversationServiceProvider',
  },
  {
    name: 'Actor',
    route: '/actor',
    translationKey: 'global.menu.entities.conversationServiceActor',
  },
];
