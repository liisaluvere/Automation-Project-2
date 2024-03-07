const testIssueDescription =
  "Description for testing time estimation and logging";
const testIssueTitle = "Title for testing";
const testIssueCreatedConfirmation = "Issue has been successfully created.";

const backLogList = () => cy.get('[data-testid="board-list:backlog"]');
const estimatedTime = () => cy.get('[placeholder="Number"]');
const issueDetailsModalClosing = () => cy.get('[data-testid="icon:close"]');
const timeTrackingLine = () => cy.get('[data-testid="icon:stopwatch"]');
const timeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
const timeSpentField = () => cy.get('[placeholder="Number"]').eq(0);
const timeRemainingField = () => cy.get('[placeholder="Number"]').eq(1);
const timeTrackingDoneButton = () => cy.get("button").contains("Done");
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');

const estimatedTimeInitial = "10";
const estimatedTimeUpdated = "20";
const loggedTimeSpent = "2";
const loggedTimeRemaining = "5";

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");

        cy.get('[data-testid="modal:issue-create"]').within(() => {
          cy.get(".ql-editor").type(testIssueDescription);

          cy.get('input[name="title"]').type(testIssueTitle);

          cy.get('[data-testid="select:type"]').click();
          cy.get('[data-testid="select-option:Bug"]').click();

          cy.get('[data-testid="select:userIds"]').click();
          cy.get('[data-testid="select-option:Baby Yoda"]').click();

          cy.get('button[type="submit"]').click();
        });

        cy.contains(testIssueCreatedConfirmation).should("be.visible");
        backLogList().should("be.visible").contains(testIssueTitle);
      });
  });

  it("Should add, edit and remove time estimation", () => {
    backLogList().contains(testIssueTitle).click();

    getIssueDetailsModal().within(() => {
      cy.contains("No time logged").should("be.visible");

      estimatedTime().type(estimatedTimeInitial);
      estimatedTime().should("have.value", estimatedTimeInitial);
      cy.contains(estimatedTimeInitial + "h estimated").should("be.visible");
      issueDetailsModalClosing().first().click();
    });

    backLogList().contains(testIssueTitle).click();
    getIssueDetailsModal().within(() => {
      estimatedTime().should("have.value", estimatedTimeInitial);

      estimatedTime().clear().type(estimatedTimeUpdated);
      estimatedTime().should("have.value", estimatedTimeUpdated);
      cy.contains(estimatedTimeUpdated + "h estimated").should("be.visible");
      issueDetailsModalClosing().first().click();
    });

    backLogList().contains(testIssueTitle).click();
    getIssueDetailsModal().within(() => {
      estimatedTime().should("have.value", estimatedTimeUpdated);
      estimatedTime().clear();
      estimatedTime().should("have.value", "");
      cy.contains(estimatedTimeUpdated + "h estimated").should("not.exist");
    });
  });

  it("Should add time estimation, log time and remove logged time", () => {
    backLogList().contains(testIssueTitle).click();

    getIssueDetailsModal().within(() => {
      cy.contains("No time logged").should("be.visible");
      estimatedTime().type(estimatedTimeInitial);
      estimatedTime().should("have.value", estimatedTimeInitial);
      timeTrackingLine().click();
    });
    timeTrackingModal()
      .should("be.visible")
      .within(() => {
        timeSpentField().type(loggedTimeSpent);
        timeRemainingField().type(loggedTimeRemaining);

        cy.contains("No time logged").should("not.exist");
        cy.contains(loggedTimeSpent + "h logged").should("be.visible");
        cy.contains(loggedTimeRemaining + "h remaining").should("be.visible");
        timeTrackingDoneButton().click();
      });
    getIssueDetailsModal().within(() => {
      cy.contains("No time logged").should("not.exist");
      cy.contains(loggedTimeSpent + "h logged").should("be.visible");
      cy.contains(loggedTimeRemaining + "h remaining").should("be.visible");

      timeTrackingLine().click();
    });
    timeTrackingModal().within(() => {
      timeSpentField().clear();
      timeRemainingField().clear();
      cy.contains("No time logged").should("be.visible");
      cy.contains(estimatedTimeInitial + "h estimated").should("be.visible");
      timeTrackingDoneButton().click();
    });
    getIssueDetailsModal().within(() => {
      estimatedTime().should("have.value", estimatedTimeInitial);
      cy.contains("No time logged").should("be.visible");
      cy.contains(estimatedTimeInitial + "h estimated").should("be.visible");
    });
  });
});
