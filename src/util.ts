import { addDays, isAfter as isDateAfter, isEqual as isDateEqual, isValid as isValidDate, startOfDay } from 'date-fns'
import * as Data from './Data'

export const isBagCountValid = (bagCount: number): boolean => {
    return Number.isSafeInteger(bagCount) && bagCount >= 1 && bagCount <= 50
}

export const isDateRangeValid = (dateRange: Data.DateRange): boolean => {
    const minDateFrom = addDays(startOfDay(new Date()), 1)
    const minDateTo = addDays(dateRange.from, 1)

    return (
        isValidDate(dateRange.from) &&
        isValidDate(dateRange.to) &&
        isDateEqual(dateRange.from, startOfDay(dateRange.from)) &&
        isDateEqual(dateRange.to, startOfDay(dateRange.to)) &&
        (isDateEqual(dateRange.from, minDateFrom) || isDateAfter(dateRange.from, minDateFrom)) &&
        (isDateEqual(dateRange.to, minDateTo) || isDateAfter(dateRange.to, minDateTo))
    )
}

export const sortBy = (key: string) => (a: Data.Stashpoint, b: Data.Stashpoint) => {
    if (a[key as keyof Data.Stashpoint] > b[key as keyof Data.Stashpoint]) {
        return key === 'bagPerDayPrice' ? 1 : -1
    }
    if (a[key as keyof Data.Stashpoint] < b[key as keyof Data.Stashpoint]) {
        return key === 'bagPerDayPrice' ? -1 : 1
    }

    return 0
}

export const formatToCurrency = (currencyCode: string, number: number | bigint): string => {
    return Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currencyCode,
    }).format(number)
}

interface Actions {
    SORT_BY_RATING: string
    SET_STASHPOINT: string
    SORT_BY_BAG_PER_DAY_PRICE: string
    DEFAULT: string
}

export const ACTIONS: Actions = {
    SORT_BY_RATING: 'Rating',
    SET_STASHPOINT: 'setStashpoint',
    SORT_BY_BAG_PER_DAY_PRICE: 'Bag Per Day Price',
    DEFAULT: 'Default',
}

export const regex: any = /^[0-9\b]+$/

export const sortValues: string[] = [ACTIONS.DEFAULT, ACTIONS.SORT_BY_RATING, ACTIONS.SORT_BY_BAG_PER_DAY_PRICE]
