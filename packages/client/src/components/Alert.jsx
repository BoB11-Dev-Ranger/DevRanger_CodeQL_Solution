import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Alert = ({title, content, is_open, handleClose}) => {
    return (
        <>
            <Modal show={is_open} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{content}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Alert;

