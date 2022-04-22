import React from 'react'
import styles from '../../styles.module.css'
import { addDays, format, isBefore, isEqual, startOfDay } from 'date-fns'
import * as Data from '../../Data'
import { getInitialDraftCart } from '../../App'
import { isBagCountValid, regex } from '../../util'

interface props {
    setCart: (value: Data.Cart) => void
    cart: Data.Cart
}

const Header = ({ cart, setCart }: props) => {
    const formatInputValueProp = (value: string): string => {
        return format(new Date(cart.dateRange[value as keyof Data.DateRange]), 'yyyy-MM-dd')
    }

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
