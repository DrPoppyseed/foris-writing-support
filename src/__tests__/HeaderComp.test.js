import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/svelte'

import HeaderComp from '../components/HeaderComp.svelte'

test("'Foris Essay' is rendered on the header", () => {
  const { getByText } = render(HeaderComp)

  expect(getByText('FORIS ESSAY')).toBeInTheDocument()
})

test('Contact button is rendered on the header', () => {
  const { getByText } = render(HeaderComp)

  expect(getByText('お問い合わせ')).toHaveAttribute(
    'href',
    'https://form.run/@foris-essay'
  )
})
