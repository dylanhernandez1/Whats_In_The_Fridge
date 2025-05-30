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

  context("Unsuccessful post -- user already exists", () => {
    it("GIVEN I navigate to the create account page", () => {});

    it("WHEN I enter valid user information (but the username already exists) and click create account button", () => {
      cy.visit(`${FRONTEND_URL}/create-account`);
      cy.intercept("POST", `${BACKEND_URL}/users`).as(
        "addUser"
      );
      cy.get("#username-field").type(
        "uniqueUserNameForThisAPPTEST123"
      );
      cy.get("#email-field").type(
        "whateve23094324r@example.com"
      );
      cy.get("#password-field").type("password123!");
      cy.get("#create-account").click();
      cy.wait("@addUser");

      cy.get(".invalid").should(
        "contain",
        "Username already taken"
      );
    });

    it("THEN error message is set to 'Username already taken'\nAND user is not added to the database", () => {
      cy.request({
        url: `${BACKEND_URL}/users?email=whateve23094324r@example.com`,
        failOnStatusCode: false
      }).then((response) => {
        assert.equal(response.status, 404);
        assert.equal(response.body, "Resource not found.");
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
        "sdkfjwldsfjlsjdflkjsfawepfasoef2394"
      );
      cy.get("#email-field").type(
        "seslkdfjlsdjfljsdlfjsljdfkljl@example.com"
      );
      cy.get("#password-field").type("123");
      cy.get("#create-account").click();
      cy.get("#create-account").should(
        "contain",
        "Password Must Be At Least 6 Characters"
      );
    });

    it("THEN error message is set to 'Password Must Be At Least 6 Characters'\nAND user is not added to the database", () => {
      cy.request({
        url: `${BACKEND_URL}/users?email=seslkdfjlsdjfljsdlfjsljdfkljl@example.com`,
        failOnStatusCode: false
      }).then((response) => {
        assert.equal(response.status, 404);
        assert.equal(response.body, "Resource not found.");
      });
    });
  });
});

describe("API Posting and Getting User", () => {
  context("Successful Post User", () => {
    before(() => {});

    let user = {};

    it("GIVEN My user object has valid fields (name and email and password)", () => {
      user = {
        name: "dillpickle1234433212341234",
        email: "whateverwhateverwhatever@example.com",
        password: "password123!"
      };
    });

    it("WHEN I attempt to post the user obj", () => {
      cy.request("POST", `${BACKEND_URL}/users`, user).then(
        (response) => {
          assert.equal(
            response.status,
            201,
            "THEN I receive a successful response (code 201)"
          );
          assert.exists(
            response.body.token,
            "AND the response object contains a token"
          );
        }
      );
    });
  });

  context("Unsuccessful post User", () => {
    before(() => {});

    let user = {};

    it("GIVEN My user object has no password", () => {
      user = {
        name: "somethignskdfjsldjflsjd",
        email: "sdflksjdflkjsldfj@example.com"
      };
    });

    it("WHEN I attempt to post the user obj", () => {
      cy.request({
        method: "POST",
        url: `${BACKEND_URL}/users`,
        body: user,
        failOnStatusCode: false
      }).then((response) => {
        assert.equal(
          response.status,
          400,
          "THEN I receive a failure response (code 400)"
        );
        assert.equal(
          response.body,
          "Bad request: Invalid input data.",
          "AND I receive an error message"
        );
      });
    });
  });

  context("Successful get User", () => {
    let user = {};

    it("GIVEN My user email exists in a given account", () => {
      user = {
        name: "dillpickle1234433212341234",
        email: "whateverwhateverwhatever@example.com",
        password: "password123!"
      };
    });

    it("WHEN I attempt to get the user obj by the email", () => {
      cy.request(
        `${BACKEND_URL}/users?email=whateverwhateverwhatever@example.com`
      ).then((response) => {
        assert.equal(
          response.status,
          200,
          "THEN I receive a successful response (code 200)"
        );
        assert.equal(
          response.body.name,
          user.name,
          "AND the response object contains the same name and email I passed earlier"
        );
        assert.equal(
          response.body.email,
          user.email,
          "AND the response object contains the same name and email I passed earlier"
        );
      });
    });
  });

  context("Unsuccessful get User", () => {
    let user = {};

    it("GIVEN My user email does not exist in a given account", () => {
      user = {
        name: "dillpickle1234433212341234",
        email:
          "somethingthatdoesntexistforreal12345@something.com",
        password: "password123!"
      };
    });

    it("WHEN I attempt to get the user obj by the email", () => {
      cy.request({
        url: `${BACKEND_URL}/users?email=somethingthatdoesntexistforreal12345@something.com`,
        failOnStatusCode: false
      }).then((response) => {
        assert.equal(
          response.status,
          404,
          "THEN I receive a successful response (code 200)"
        );
        assert.equal(
          response.body,
          "Resource not found.",
          "AND I receive an error message"
        );
      });
    });

    after(() => {
      cy.request(
        "DELETE",
        `${BACKEND_URL}/users?email=whateverwhateverwhatever@example.com`
      ).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  });
});
