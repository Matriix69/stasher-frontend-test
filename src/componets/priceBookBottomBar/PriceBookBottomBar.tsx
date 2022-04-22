import styles from '../../styles.module.css'
import { formatToCurrency, sortValues } from '../../util'
import Loader from '../Loader'
import * as Data from '../../Data'

interface props {
    selectSortBy: string
    sortStashpoint: (e: React.ChangeEvent<HTMLSelectElement>) => void
    isFatchingPriceQuote: boolean
    isCreatingBooking: boolean
    priceQuote: Data.PriceQuote | undefined
    creatBooking: () => void
    disableSelect: boolean
}

const PriceBookBottomBar = ({
    sortStashpoint,
    selectSortBy,
    isFatchingPriceQuote,
    priceQuote,
    isCreatingBooking,
    creatBooking,
    disableSelect,
}: props) => {
    return (
        <div className={styles.bottom_bar}>
            <div className={styles.bottom_bar_content}>
                <div className={styles.input_conatainer}>
                    <label htmlFor='sortby-select'>sortby</label>
                    <select
                        id='sortby-select'
                        className='select-item'
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => sortStashpoint(e)}
                        value={selectSortBy}
                        disabled={disableSelect}
                    >
                        {sortValues.map((value: string, index: number) => (
                            <option key={index}>{value}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.group_elements}>
                    <span className={styles.price}>
                        price:
                        {!isFatchingPriceQuote &&
                            (priceQuote?.totalPrice
                                ? formatToCurrency(priceQuote?.currencyCode, priceQuote?.totalPrice)
                                : formatToCurrency('GBP', 0))}
                        {isFatchingPriceQuote && <Loader />}
                    </span>

                    <button
                        name='book'
                        className={styles.button}
                        disabled={!priceQuote?.totalPrice || isCreatingBooking ? true : false}
                        onClick={() => creatBooking()}
                    >
                        {isCreatingBooking && <Loader />}
                        {!isCreatingBooking && 'Book'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PriceBookBottomBar
