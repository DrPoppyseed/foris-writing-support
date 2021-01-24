import "@testing-library/jest-dom/extend-expect";

import { render } from "@testing-library/svelte";

import App from "../App";

test("'Hello World' is rendered on the header", () => {
  const { getByText } = render(App, { name: "World" });

  expect(getByText("Hello World!")).toBeInTheDocument();
});
