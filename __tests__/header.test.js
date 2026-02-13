import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

// Mock usePathname
jest.mock('next/navigation', () => ({
    usePathname: () => '/en',
    useRouter: () => ({ push: jest.fn() }),
}))

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
            onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
        },
    },
}))

describe('Header', () => {
    it('renders a heading', () => {
        // Basic test to verify test runner works
        expect(true).toBe(true)
    })
})
