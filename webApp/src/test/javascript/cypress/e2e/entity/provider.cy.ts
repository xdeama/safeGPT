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

describe('Provider e2e test', () => {
  const providerPageUrl = '/provider';
  const providerPageUrlPattern = new RegExp('/provider(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const providerSample = { name: 'gadzooks yippee gee' };

  let provider;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/conversationservice/api/providers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/conversationservice/api/providers').as('postEntityRequest');
    cy.intercept('DELETE', '/services/conversationservice/api/providers/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (provider) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/conversationservice/api/providers/${provider.id}`,
      }).then(() => {
        provider = undefined;
      });
    }
  });

  it('Providers menu should load Providers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('provider');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Provider').should('exist');
    cy.url().should('match', providerPageUrlPattern);
  });

  describe('Provider page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(providerPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Provider page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/provider/new$'));
        cy.getEntityCreateUpdateHeading('Provider');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', providerPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/conversationservice/api/providers',
          body: providerSample,
        }).then(({ body }) => {
          provider = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/conversationservice/api/providers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [provider],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(providerPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Provider page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('provider');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', providerPageUrlPattern);
      });

      it('edit button click should load edit Provider page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Provider');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', providerPageUrlPattern);
      });

      it('edit button click should load edit Provider page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Provider');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', providerPageUrlPattern);
      });

      it('last delete button click should delete instance of Provider', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('provider').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', providerPageUrlPattern);

        provider = undefined;
      });
    });
  });

  describe('new Provider page', () => {
    beforeEach(() => {
      cy.visit(`${providerPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Provider');
    });

    it('should create an instance of Provider', () => {
      cy.get(`[data-cy="name"]`).type('sensibility');
      cy.get(`[data-cy="name"]`).should('have.value', 'sensibility');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        provider = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', providerPageUrlPattern);
    });
  });
});
