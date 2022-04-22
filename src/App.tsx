import { useEffect, useState, useReducer } from 'react'
import { addDays, startOfDay } from 'date-fns'
import * as Data from './Data'
import { isDateRangeValid, isBagCountValid, sortBy, ACTIONS } from './util'
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

export const getInitialDraftCart = (): Data.Cart => {
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

    const sortStashpoint = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target
        setSelectSortBy(value)
        if (value === ACTIONS.DEFAULT) return dispatch({ type: value, payload: allStashpoints })
        dispatch({ type: value })
    }

    return (
        <>
            <Header cart={cart} setCart={setCart} />

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

                {!isFatchingStashPoints &&
                    state?.map((stashPoint: Data.Stashpoint, index: number) => (
                        <StashPoints stashPoint={stashPoint} cart={cart} setCart={setCart} />
                    ))}
            </main>

            {showModal && <SuccessModal setShowModal={setShowModal} id={bookingID} />}
            {errorMsg && <ErrorModal setErrorMsg={setErrorMsg} errorMsg={errorMsg} />}
        </>
    )
}
