import styles from './modal.module.css'

interface ModalProps {
    setShowModal: (value: boolean) => void
    id: string
}
const SuccessModal = ({ setShowModal, id }: ModalProps) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <div className={styles.modal_message}>
                    <h1>Stash point Booked!</h1>
                    <p>Booking ID: {id}</p>
                </div>
                <button onClick={() => setShowModal(false)} className={styles.modal_action}>
                    ok
                </button>
            </div>
        </div>
    )
}

export default SuccessModal
