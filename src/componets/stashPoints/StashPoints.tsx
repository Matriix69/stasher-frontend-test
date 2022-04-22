import * as Data from '../../Data'
import styles from '../../styles.module.css'
import { formatToCurrency } from '../../util'

interface props {
    state: Data.Stashpoint[]
    selectStashPoint: (id: string) => void
    stashpointID: string
}

const StashPoints = ({ state, selectStashPoint, stashpointID }: props) => {
    return (
        <>
            {state?.map((stashpoint: Data.Stashpoint, index: number) => (
                <div
                    className={`${styles.stashCard} ${stashpointID === stashpoint.id ? styles.selectedStashPoint : ``}`}
                    key={index}
                    onClick={() => selectStashPoint(stashpoint.id)}
                >
                    <div>
                        <strong>{stashpoint.name}</strong>
                    </div>
                    <div>
                        Address: <strong>{stashpoint.address}</strong>
                    </div>
                    <div>
                        Rating: <strong>{stashpoint.rating}</strong>
                    </div>
                    <div>
                        Pice Per Bag:
                        <strong>{formatToCurrency(stashpoint?.currencyCode, stashpoint?.bagPerDayPrice)}</strong>
                    </div>
                </div>
            ))}
        </>
    )
}

export default StashPoints
