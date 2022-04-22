import styles from './modal.module.css'

interface ModalProps {
    setErrorMsg: (value: string) => void
    errorMsg: string
}
const ErrorModal = ({ errorMsg, setErrorMsg }: ModalProps) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <div className={styles.modal_message}>
                    <h1 className={styles.modal_message_error}>An error occured</h1>
                    <p>{errorMsg}</p>
                </div>
                <button onClick={() => setErrorMsg('')} className={styles.modal_action}>
                    ok
                </button>
            </div>
        </div>
    )
}

export default ErrorModal
