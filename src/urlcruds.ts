import * as Data from './Data'

export const FetchAllStashpoints = async (): Promise<Response> => {
    return fetch(`/api/stashpoints`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    })
}

const serializeCart = (cart: Data.Cart): string => {
    return JSON.stringify(Data.Cart.encode(cart))
}

export const fetchPriceQoute = async (cart: Data.Cart): Promise<Response> => {
    return fetch(`/api/quotes`, {
        method: 'Post',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
        },
        body: serializeCart(cart),
    })
}

export const postBooking = async (cart: Data.Cart): Promise<Response> => {
    return fetch(`/api/bookings`, {
        method: 'Post',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
        },
        body: serializeCart(cart),
    })
}

type Payment = {
    readonly bookingId: string
}

export const postPayment = async (id: Payment): Promise<Response> => {
    const serializeBookinId = (id: Payment): string => {
        return JSON.stringify(Data.Payment.encode(id as unknown as Data.Payment))
    }
    return fetch(`/api/payments`, {
        method: 'Post',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
        },
        body: serializeBookinId(id),
    })
}
