import "@testing-library/jest-dom/extend-expect";

import { render, fireEvent } from "@testing-library/svelte";

import ButtonComp from "../components/ButtonComp";

test("'Hello Svelte' is rendered on the header", () => {
  const { getByText } = render(ButtonComp, { name: "Svelte" });

  expect(getByText("Hello Svelte!")).toBeInTheDocument();
});

test("Button text changes when button is clicked", async () => {
  const { getByText } = render(ButtonComp, { name: "Svelte" });
  const button = getByText("Button");

  await fireEvent.click(button);

  expect(button).toHaveTextContent("Button Clicked");
});
