import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Conversation e2e test', () => {
  const conversationPageUrl = '/conversation';
  const conversationPageUrlPattern = new RegExp('/conversation(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const conversationSample = { startDate: '2024-01-31T20:27:58.413Z' };

  let conversation;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/conversationservice/api/conversations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/conversationservice/api/conversations').as('postEntityRequest');
    cy.intercept('DELETE', '/services/conversationservice/api/conversations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (conversation) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/conversationservice/api/conversations/${conversation.id}`,
      }).then(() => {
        conversation = undefined;
      });
    }
  });

  it('Conversations menu should load Conversations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('conversation');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Conversation').should('exist');
    cy.url().should('match', conversationPageUrlPattern);
  });

  describe('Conversation page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(conversationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Conversation page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/conversation/new$'));
        cy.getEntityCreateUpdateHeading('Conversation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', conversationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/conversationservice/api/conversations',
          body: conversationSample,
        }).then(({ body }) => {
          conversation = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/conversationservice/api/conversations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/conversationservice/api/conversations?page=0&size=20>; rel="last",<http://localhost/services/conversationservice/api/conversations?page=0&size=20>; rel="first"',
              },
              body: [conversation],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(conversationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Conversation page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('conversation');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', conversationPageUrlPattern);
      });

      it('edit button click should load edit Conversation page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Conversation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', conversationPageUrlPattern);
      });

      it('edit button click should load edit Conversation page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Conversation');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', conversationPageUrlPattern);
      });

      it('last delete button click should delete instance of Conversation', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('conversation').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', conversationPageUrlPattern);

        conversation = undefined;
      });
    });
  });

  describe('new Conversation page', () => {
    beforeEach(() => {
      cy.visit(`${conversationPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Conversation');
    });

    it('should create an instance of Conversation', () => {
      cy.get(`[data-cy="startDate"]`).type('2024-01-31T12:53');
      cy.get(`[data-cy="startDate"]`).blur();
      cy.get(`[data-cy="startDate"]`).should('have.value', '2024-01-31T12:53');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        conversation = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', conversationPageUrlPattern);
    });
  });
});
