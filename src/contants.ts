import * as Data from './Data'

export const sortBy = (key: string) => (a: Data.Stashpoint, b: Data.Stashpoint) => {
    if (a[key as keyof Data.Stashpoint] > b[key as keyof Data.Stashpoint]) {
        return -1
    }
    if (a[key as keyof Data.Stashpoint] < b[key as keyof Data.Stashpoint]) {
        return 1
    }

    return 0
}

export const formatToCurrency = (currencyCode: string, number: number | bigint): string => {
    return Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currencyCode,
    }).format(number)
}

export const ACTIONS = {
    SORT_BY_RATING: 'Rating',
    SET_STASHPOINT: 'setStashpoint',
    SORT_BY_BAG_PER_DAY_PRICE: 'Bag Per Day Price',
    DEFAULT: 'Default',
}

export const regex: any = /^[0-9\b]+$/
