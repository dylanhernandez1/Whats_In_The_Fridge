const FRONTEND_URL = "http://localhost:5173";
const BACKEND_URL = "http://localhost:8000";

describe("Add new user", () => {
  context("Successful post", () => {
    it("GIVEN I navigate to the create account page", () => {});

    it("WHEN I enter valid user information and click create account button", () => {
      cy.visit(`${FRONTEND_URL}/create-account`);
      cy.intercept("POST", `${BACKEND_URL}/users`).as(
        "addUser"
      );
      cy.get("#username-field").type(
        "uniqueUserNameForThisAPPTEST123"
      );
      cy.get("#email-field").type(
        "somethingrandome@example.com"
      );
      cy.get("#password-field").type("password123!");
      cy.get("#create-account").click();
      cy.wait("@addUser");
    });

    it("THEN a new user is added to the database", () => {
      cy.request(
        `${BACKEND_URL}/users?name=uniqueUserNameForThisAPPTEST123`
      ).then((response) => {
        assert.equal(response.status, 200);
        assert.isObject(response.body);
        assert.equal(
          response.body.name,
          "uniqueUserNameForThisAPPTEST123"
        );
        assert.equal(
          response.body.email,
          "somethingrandome@example.com"
        );
      });
    });
  });

  after(() => {
    cy.request(
      "DELETE",
      `${BACKEND_URL}/users?email=somethingrandome@example.com`
    ).then((response) => {
      expect(response.status).to.equal(200);
    });
  });

  context("Unsuccessful Post -- Bad Password", () => {
    it("GIVEN I navigate to the create account page", () => {});

    it("WHEN I enter mostly valid information, but not a long enough password (shorter than 6 characters)", () => {
      cy.visit(`${FRONTEND_URL}/create-account`);
      cy.get("#username-field").type(
        "uniqueUserNameForThisAPPTEST123"
      );
      cy.get("#email-field").type(
        "somethingrandome@example.com"
      );
      cy.get("#password-field").type("123");
      cy.get("#create-account").click();
      cy.get("#create-account").should(
        "contain",
        "Password Must Be At Least 6 Characters"
      );
    });

    it("THEN error message is set to 'Password Must Be At Least 6 Characters'", () => {});
  });
});
