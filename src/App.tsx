import { useEffect, useState, useReducer } from 'react'
import { addDays, startOfDay, format, isBefore, isEqual } from 'date-fns'
import * as Data from './Data'
import { isDateRangeValid, isBagCountValid, sortBy, ACTIONS, regex } from './util'
import { FetchAllStashpoints, fetchPriceQoute, postBooking, postPayment } from './urlcruds'
import styles from './styles.module.css'
import SuccessModal from './componets/Modal/SuccessModal'
import StashPoints from './componets/stashPoints/StashPoints'
import Header from './componets/header/Header'
import PriceBookBottomBar from './componets/priceBookBottomBar/PriceBookBottomBar'
import ErrorModal from './componets/Modal/ErrorModal'

export type AppProps = {
    readonly children?: never
}

const initialState: Data.Stashpoint[] = []

function reducer(state: Data.Stashpoint[], action: any) {
    switch (action.type) {
        case ACTIONS.SET_STASHPOINT:
            return action.payload
        case ACTIONS.SORT_BY_BAG_PER_DAY_PRICE:
            return [...state].sort(sortBy('bagPerDayPrice'))
        case ACTIONS.SORT_BY_RATING:
            return [...state].sort(sortBy('rating'))
        case ACTIONS.DEFAULT:
            return action.payload
    }
}

export const App = (_props: AppProps) => {
    const getInitialDraftCart = (): Data.Cart => {
        const initialDateFrom = addDays(startOfDay(new Date()), 1)

        return {
            bagCount: 1,
            dateRange: {
                from: initialDateFrom,
                to: addDays(initialDateFrom, 1),
            },
            stashpointId: '',
        }
    }

    const [allStashpoints, setAllStashpoints] = useState<Data.Stashpoints>([])
    const [cart, setCart] = useState<Data.Cart>(getInitialDraftCart())
    const [priceQuote, setPriceQuote] = useState<Data.PriceQuote>()
    const [selectSortBy, setSelectSortBy] = useState<string>('default')
    const [state, dispatch] = useReducer(reducer, initialState)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [bookingID, setBookingID] = useState<string>('')
    const [errorMsg, setErrorMsg] = useState<string>('')

    //loading states
    const [isFatchingStashPoints, setIsFatchingStashPoints] = useState<boolean>(true)
    const [isFatchingPriceQuote, setIsFatchingPriceQuote] = useState<boolean>(false)
    const [isCreatingBooking, setIsCreatingBooking] = useState<boolean>(false)

    useEffect(() => {
        const getAllStashpoints = async () => {
            try {
                const response = await FetchAllStashpoints()
                const [error, stashpoints] = Data.Stashpoints.decode(await response.json())
                if (error) {
                    setErrorMsg('Something wrong fetching stash points')
                    setIsFatchingStashPoints(false)
                } else {
                    setAllStashpoints(stashpoints)
                    dispatch({ type: ACTIONS.SET_STASHPOINT, payload: stashpoints })
                    setIsFatchingStashPoints(false)
                }
            } catch (error) {
                setErrorMsg('Something wrong fetching stash points')
                setIsFatchingStashPoints(false)
            }
        }
        getAllStashpoints()
    }, [])

    //date onChange function
    const handleInputChangeforCartDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target

        const dateObj: Data.DateRange = {
            ...cart.dateRange,
            ...(name === 'from'
                ? {
                      //make sure the value of from is not before the initial dateRange.from value (validation without the minDate attribute on the input)
                      from: isBefore(startOfDay(new Date(value)), getInitialDraftCart().dateRange.from)
                          ? getInitialDraftCart().dateRange.from
                          : startOfDay(new Date(value)),
                      //if dataRange.from not before dateRange.to, change dateRange.to to new date value of from and add one day
                      ...(isBefore(startOfDay(new Date(value)), cart.dateRange.to)
                          ? null
                          : { to: addDays(startOfDay(new Date(value)), 1) }),
                  }
                : {
                      to:
                          //make sure date is not before or equal to dateRange.from (validations without the minDate attribute on the input)
                          isBefore(startOfDay(new Date(value)), cart.dateRange.from) ||
                          isEqual(startOfDay(new Date(value)), cart.dateRange.from)
                              ? addDays(cart.dateRange.from, 1)
                              : startOfDay(new Date(value)),
                  }),
        }

        setCart({
            ...cart,
            dateRange: { ...dateObj },
        })
    }

    const handleInputChangeforBegCount = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target

        if (value === '' || (regex.test(value) && isBagCountValid(Number(value)))) {
            setCart({
                ...cart,
                [name]: value !== '' ? Number(value) : '',
            })
        }
    }

    const formatInputValueProp = (value: string): string => {
        return format(new Date(cart.dateRange[value as keyof Data.DateRange]), 'yyyy-MM-dd')
    }

    const selectStashPoint = (id: string): void => {
        if (id === cart.stashpointId) return
        setCart({ ...cart, stashpointId: id })
    }

    const sortStashpoint = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        setSelectSortBy(value)
        if (value === ACTIONS.DEFAULT) return dispatch({ type: value, payload: allStashpoints })
        dispatch({ type: value })
    }

    const isCartValid = (): boolean => {
        if (!isBagCountValid(cart.bagCount)) return false
        if (!isDateRangeValid(cart.dateRange)) return false
        if (!cart.stashpointId) return false
        return true
    }

    useEffect(() => {
        const getPriceQoute = async () => {
            if (!isCartValid()) return

            setIsFatchingPriceQuote(true)

            try {
                const response = await fetchPriceQoute(cart)
                const [error, data] = Data.PriceQuote.decode(await response.json())
                if (error) {
                    setErrorMsg('Something went wrong getting price qoute')
                } else {
                    setPriceQuote(data)
                    setIsFatchingPriceQuote(false)
                }
            } catch (error) {
                setErrorMsg('Something went wrong getting price qoute')
                setIsFatchingPriceQuote(false)
            }
        }
        getPriceQoute()
    }, [cart])

    const creatBooking = async () => {
        if (!isCartValid()) return
        setIsCreatingBooking(true)

        try {
            const response = await postBooking(cart)
            const [error, data] = Data.Booking.decode(await response.json())

            if (error) {
                return setErrorMsg('Something went wrong booking stash point')
            }
            const response2 = await postPayment({ bookingId: data.id })
            const [error2, data2] = Data.Payment.decode(await response2.json())
            if (error2) {
                setErrorMsg('Something went wrong booking stash point')
            } else {
                setBookingID(data.id)
                setIsCreatingBooking(false)
                setShowModal(true)
            }
        } catch (error) {
            setErrorMsg('Something went wrong booking stash point')
            setIsCreatingBooking(false)
        }
    }

    return (
        <>
            <Header
                formatInputValueProp={formatInputValueProp}
                handleInputChangeforCartDate={handleInputChangeforCartDate}
                handleInputChangeforBegCount={handleInputChangeforBegCount}
                cart={cart}
            />

            <PriceBookBottomBar
                sortStashpoint={sortStashpoint}
                selectSortBy={selectSortBy}
                isFatchingPriceQuote={isFatchingPriceQuote}
                priceQuote={priceQuote}
                isCreatingBooking={isCreatingBooking}
                creatBooking={creatBooking}
                disableSelect={!allStashpoints.length ? true : false}
            />

            <main className={styles.stashCard_container}>
                {isFatchingStashPoints && <p>Loading stash points...</p>}

                {!isFatchingStashPoints && (
                    <StashPoints state={state} stashpointID={cart.stashpointId} selectStashPoint={selectStashPoint} />
                )}
            </main>

            {showModal && <SuccessModal setShowModal={setShowModal} id={bookingID} />}
            {errorMsg && <ErrorModal setErrorMsg={setErrorMsg} errorMsg={errorMsg} />}
        </>
    )
}
