import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/svelte'

import HeaderComp from '../components/HeaderComp.svelte'

test("'Foris Essay' is rendered on the header", () => {
  const { getAllByText } = render(HeaderComp)

  getAllByText('FORIS ESSAY').forEach(text => expect(text).toBeInTheDocument())
})

test('Contact button is rendered on the header', () => {
  const { getAllByText } = render(HeaderComp)

  getAllByText('お問い合わせ').forEach(text =>
    expect(text).toHaveAttribute('href', 'https://form.run/@foris-essay')
  )
})
