import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Home from '@/app/page'

vi.mock('@clerk/nextjs', () => {
  return {
    auth: () => new Promise((resolve) => resolve({ userId: 'testUser' })),
    ClerkProvider: ({ children }) => <div>{children}</div>,
    user: {
      id: 'user_2NNEqL2nrIRdJ194ndJqAHwEfxC',
      fullName: 'Charles Harris',
    },
  }
})

test('Home', async () => {
  render(await Home())
  expect(screen.getByText('The best Journaling app')).toBeTruthy()
})
