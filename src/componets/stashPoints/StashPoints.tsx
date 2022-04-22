import * as Data from '../../Data'
import styles from '../../styles.module.css'
import { formatToCurrency } from '../../util'

interface props {
    stashPoint: Data.Stashpoint
    cart: Data.Cart
    setCart: (value: Data.Cart) => void
}

const StashPoints = ({ stashPoint, cart, setCart }: props) => {
    const selectStashPoint = (id: string): void => {
        if (id === cart.stashpointId) return
        setCart({ ...cart, stashpointId: id })
    }

    return (
        <div
            className={`${styles.stashCard} ${cart.stashpointId === stashPoint.id ? styles.selectedStashPoint : ``}`}
            onClick={() => selectStashPoint(stashPoint.id)}
        >
            <div>
                <strong>{stashPoint.name}</strong>
            </div>
            <div>
                Address: <strong>{stashPoint.address}</strong>
            </div>
            <div>
                Rating: <strong>{stashPoint.rating}</strong>
            </div>
            <div>
                Pice Per Bag:
                <strong>{formatToCurrency(stashPoint?.currencyCode, stashPoint?.bagPerDayPrice)}</strong>
            </div>
        </div>
    )
}

export default StashPoints
