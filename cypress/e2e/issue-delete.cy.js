const firstIssueTitle = "This is an issue of type: Task.";
const numberOfIssuesBeforeDeleting = 4;

describe("Issue deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.get('[data-testid="board-list:backlog"]').within(() => {
          cy.get('[data-testid="list-issue"]').should(
            "have.length",
            numberOfIssuesBeforeDeleting
          );
        });

        cy.contains(firstIssueTitle).click();
        cy.get('[data-testid="modal:issue-details"]').should("be.visible");
      });
  });

  it("Should successfully delete issue", () => {
    cy.get('[data-testid="icon:trash"]').click();

    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .contains("Delete issue")
      .click();

    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(firstIssueTitle).should("not.exist");
      cy.get('[data-testid="list-issue"]').should(
        "have.length",
        numberOfIssuesBeforeDeleting - 1
      );
    });
  });

  it("Should successfully cancel deleting issue", () => {
    cy.get('[data-testid="icon:trash"]').click();

    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .contains("Cancel")
      .click();

    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");

    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(firstIssueTitle).should("be.visible");
      cy.get('[data-testid="list-issue"]').should(
        "have.length",
        numberOfIssuesBeforeDeleting
      );
    });
  });
});
