import { screen, waitForElementToBeRemoved, } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import visit from '../test-helpers'
import makeServer from '../api/server'

let server;

beforeEach(() => {
    server = makeServer("test");
})

afterEach(() => {
    server.shutdown()
})

test("it can delete a recipe", async () => {
    server.create("recipe", { name: 'Full english'})

    visit("/")
    await waitForElementToBeRemoved(() => screen.getByText("Loading...")) 

    userEvent.click(screen.getByTestId("delete-recipe"));
    await waitForElementToBeRemoved(() => screen.getByText("Loading...")) 

    expect(screen.queryByText("Full english")).not.toBeInTheDocument();
    expect(server.db.recipes.length).toEqual(0);
})


// TODO: Rest of the unit tests; redux, react-select-creatable, etc.
// https://stackoverflow.com/questions/41991077/testing-react-select-component