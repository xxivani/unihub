// src/components/PdfModal.jsx
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const PdfModal = ({ pdfUrl, show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Newsletter PDF</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: '80vh' }}>
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        ></iframe>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PdfModal.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default PdfModal;
