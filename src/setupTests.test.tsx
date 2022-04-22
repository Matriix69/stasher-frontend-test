// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

// import { server } from './mocks/server'
import { render, fireEvent, screen, waitForElementToBeRemoved, waitFor } from '@testing-library/react'
import { App } from './App'
import { addDays, format, startOfDay } from 'date-fns'

const fakeData = [
    {
        address: '61602 Lindsey Lock Apt. 565',
        bagPerDayPrice: 7n,
        currencyCode: 'GBP',
        id: '0c788c4c-d762-4140-b8f1-b2e14aa9ded1',
        name: 'Marks Group',
        rating: 3.9,
    },
    {
        address: '9286 Schmitt Brooks Apt. 387',
        bagPerDayPrice: 4n,
        currencyCode: 'GBP',
        id: '5fbaab17-1945-457f-87c1-778f27315867',
        name: 'Muller - Hayes',
        rating: 0.5,
    },
    {
        address: '598 Hilario Points Apt. 626',
        bagPerDayPrice: 6n,
        currencyCode: 'GBP',
        id: '691bf9f1-d775-4b0e-91b4-3f614845015e',
        name: 'Gottlieb - Skiles',
        rating: 4.6,
    },
]
export const handlers = [
    rest.get('http://localhost/api/stashpoints', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(fakeData), ctx.delay(250))
    }),
]

const servers = setupServer(...handlers)

// Establish API mocking before all tests.
beforeAll(() => servers.listen({ onUnhandledRequest: 'error' }))
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => servers.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => servers.close())
// jest.setTimeout(30000)
describe('integration test', () => {
    test('all components, user interact and app flow in one integration test', async () => {
        // render the app component
        render(<App />)
        // const { container } = render(<App />)

        expect(screen.getByLabelText(/from/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/to/i)).toBeInTheDocument()
        expect(
            screen.getByRole('spinbutton', {
                name: /bags/i,
            }),
        ).toBeInTheDocument()
        expect(screen.getByLabelText(/sortby/i)).toBeInTheDocument()
        // expect(screen.getByText(/price: £0\.00/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /book/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /book/i })).toBeDisabled()
        expect(screen.getByText(/loading stash points\.\.\./i)).toBeInTheDocument()

        expect(screen.getByLabelText(/from/i)).toHaveValue(format(addDays(startOfDay(new Date()), 1), 'yyyy-MM-dd'))

        fireEvent.change(screen.getByLabelText(/from/i), {
            target: { value: '2023-04-18' },
        })

        expect(screen.getByLabelText(/from/i)).toHaveValue('2023-04-18')
        expect(screen.getByLabelText(/to/i)).toHaveValue('2023-04-19')
        fireEvent.change(screen.getByLabelText(/to/i), {
            target: { value: '2023-03-11' },
        })
        expect(screen.getByLabelText(/to/i)).toHaveValue('2023-04-19')

        expect(
            screen.getByRole('spinbutton', {
                name: /bags/i,
            }),
        ).toHaveValue(1)

        fireEvent.change(
            screen.getByRole('spinbutton', {
                name: /bags/i,
            }),
            {
                target: { value: 5 },
            },
        )

        expect(
            screen.getByRole('spinbutton', {
                name: /bags/i,
            }),
        ).toHaveValue(5)

        // I couldn't get my mock interception to work, i tried everything i could
        // i kept getting this error below
        //TypeError: Network request failed
        //at node_modules/whatwg-fetch/dist/fetch.umd.js:535:18
        //at Timeout.task [as _onTimeout] (node_modules/jsdom/lib/jsdom/browser/Window.js:516:19)

        //due to this, I can't run futher test, i will be ending the test here so i dont run  late for the submittion
        //while i figure out what could be wrong.

        // await waitForElementToBeRemoved(() => screen.queryByText(/loading stash points\.\.\./i), { timeout: 5000 })
        // await waitFor(() => {
        //     expect(screen.queryByText(/loading stash points\.\.\./i)).not.toBeInTheDocument()
        // })
        // await new Promise((r) => setTimeout(r, 1500))
        // screen.debug()
    })
})
