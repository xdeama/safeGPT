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

describe('Actor e2e test', () => {
  const actorPageUrl = '/actor';
  const actorPageUrlPattern = new RegExp('/actor(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const actorSample = { name: 'scar' };

  let actor;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/conversationservice/api/actors+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/conversationservice/api/actors').as('postEntityRequest');
    cy.intercept('DELETE', '/services/conversationservice/api/actors/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (actor) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/conversationservice/api/actors/${actor.id}`,
      }).then(() => {
        actor = undefined;
      });
    }
  });

  it('Actors menu should load Actors page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('actor');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Actor').should('exist');
    cy.url().should('match', actorPageUrlPattern);
  });

  describe('Actor page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(actorPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Actor page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/actor/new$'));
        cy.getEntityCreateUpdateHeading('Actor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', actorPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/conversationservice/api/actors',
          body: actorSample,
        }).then(({ body }) => {
          actor = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/conversationservice/api/actors+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [actor],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(actorPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Actor page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('actor');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', actorPageUrlPattern);
      });

      it('edit button click should load edit Actor page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Actor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', actorPageUrlPattern);
      });

      it('edit button click should load edit Actor page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Actor');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', actorPageUrlPattern);
      });

      it('last delete button click should delete instance of Actor', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('actor').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', actorPageUrlPattern);

        actor = undefined;
      });
    });
  });

  describe('new Actor page', () => {
    beforeEach(() => {
      cy.visit(`${actorPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Actor');
    });

    it('should create an instance of Actor', () => {
      cy.get(`[data-cy="name"]`).type('batting restfully before');
      cy.get(`[data-cy="name"]`).should('have.value', 'batting restfully before');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        actor = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', actorPageUrlPattern);
    });
  });
});
