describe("Recipe Application", () => {
  beforeEach(() => {
    cy.fixture("recipes.json").then((recipes) => {
      cy.mockRecipesApi(recipes);
    });
    cy.visit("http://localhost:5173");
  });

  it("loads and displays recipe cards", () => {
    cy.wait("@getRecipes");
    cy.get("h1").should("contain", "My Recipe Collection");
    cy.get(".recipe-grid").children().should("have.length.gt", 0);
    cy.get(".recipe-grid")
      .children()
      .first()
      .within(() => {
        cy.get('[data-testid="recipe-title"]').should("exist");
        cy.get('[data-testid="recipe-description"]').should("exist");
        cy.get('[data-testid="view-recipe-button"]').should(
          "contain",
          "View Recipe"
        );
      });
  });

  it("displays correct recipe information", () => {
    cy.wait("@getRecipes");
    cy.get(".recipe-grid")
      .children()
      .first()
      .within(() => {
        cy.get('[data-testid="recipe-title"]').should(
          "contain",
          "Spaghetti Carbonara"
        );
        cy.get('[data-testid="recipe-description"]').should(
          "contain",
          "Cooking Time: 30 mins | Servings: 4"
        );
        cy.get("ul.list-disc").should("contain", "400g spaghetti");
        cy.get("ol.list-decimal").should(
          "contain",
          "Cook the spaghetti in a large pot of salted boiling water"
        );
      });
  });

  it("handles empty recipe list", () => {
    cy.mockRecipesApi([]);
    cy.visit("http://localhost:5173");
    cy.wait("@getRecipes");
    cy.get(".recipe-grid").should("not.exist");
    cy.contains("No recipes found").should("be.visible");
  });

  it("displays correct number of recipe cards", () => {
    cy.fixture("recipes.json").then((recipes) => {
      cy.get(".recipe-grid").children().should("have.length", recipes.length);
    });
  });
});
