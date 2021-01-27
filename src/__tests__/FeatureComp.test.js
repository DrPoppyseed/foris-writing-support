import '@testing-library/jest-dom/extend-expect'

import { render } from '@testing-library/svelte'

import FeatureComp from '../components/FeatureComp.svelte'

test('Features are rendering', () => {
  const { getByText } = render(FeatureComp, {
    point: 1,
    title: 'test_title',
    description: 'test_description',
  })

  expect(getByText('ポイント')).toBeInTheDocument()
  expect(getByText(1)).toBeInTheDocument()
  expect(getByText('test_title')).toBeInTheDocument()
  expect(getByText('test_description')).toBeInTheDocument()
})
