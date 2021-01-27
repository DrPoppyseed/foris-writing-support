import '@testing-library/jest-dom/extend-expect'

import { render } from '@testing-library/svelte'

import StaffComp from '../components/StaffComp.svelte'

test('Staff images have correct src url', () => {
  const { getByText } = render(StaffComp, {
    imageUrl: 'dummy_image.jpeg',
    imageAlt: 'test_alt',
    name: 'test_name',
    description: 'test_description',
  })

  expect(getByText('test_name')).toBeInTheDocument()
})
