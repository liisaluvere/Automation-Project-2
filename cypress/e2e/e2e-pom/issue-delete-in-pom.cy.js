import IssueModal from "../../pages/IssueModal";

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        IssueModal.checkNumberOfIssuesInBacklog(numberOfIssuesBeforeDeleting);
        cy.contains(issueTitle).click();
      });
  });

  const issueTitle = "This is an issue of type: Task.";
  const numberOfIssuesBeforeDeleting = 4;

  it("Should delete issue successfully", () => {
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    IssueModal.checkNumberOfIssuesInBacklog(numberOfIssuesBeforeDeleting - 1);
  });

  it("Should cancel deletion process successfully", () => {
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
    IssueModal.checkNumberOfIssuesInBacklog(numberOfIssuesBeforeDeleting);
  });
});
