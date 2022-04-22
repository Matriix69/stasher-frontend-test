import React from 'react'
import styles from '../../styles.module.css'
import { addDays, format, startOfDay } from 'date-fns'
import * as Data from '../../Data'

interface props {
    formatInputValueProp: (value: string) => string
    handleInputChangeforCartDate: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleInputChangeforBegCount: (e: React.ChangeEvent<HTMLInputElement>) => void
    cart: Data.Cart
}

const Header = ({ formatInputValueProp, handleInputChangeforCartDate, handleInputChangeforBegCount, cart }: props) => {
    return (
        <>
            <header>
                <h1>Stasher</h1>
            </header>

            <div className={styles.header_bar}>
                <div className={styles.header_bar_content}>
                    <div className={styles.group_elements_date}>
                        <div className={styles.input_conatainer}>
                            <label htmlFor='from'>From</label>
                            <input
                                type='date'
                                name='from'
                                id='from'
                                value={formatInputValueProp('from')}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChangeforCartDate(e)}
                                min={format(addDays(startOfDay(new Date()), 1), 'yyyy-MM-dd')}
                            />
                        </div>
                        <div className={styles.input_conatainer}>
                            <label htmlFor='to'>To</label>
                            <input
                                type='date'
                                name='to'
                                id='to'
                                value={formatInputValueProp('to')}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChangeforCartDate(e)}
                                min={format(addDays(cart.dateRange.from, 1), 'yyyy-MM-dd')}
                            />
                        </div>
                    </div>

                    <div className={styles.input_conatainer}>
                        <label htmlFor='bagCount'>Bags</label>
                        <input
                            id='bagCount'
                            type='number'
                            name='bagCount'
                            value={cart.bagCount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChangeforBegCount(e)}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
