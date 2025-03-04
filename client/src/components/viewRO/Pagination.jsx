import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Pagination.css'; // Make sure to style your pagination component

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="pagination">
      <button 
        className={`pagination-arrow ${isFirstPage ? 'disabled' : ''}`}
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <FaChevronLeft />
      </button>

      <button
        className={`pagination-number ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
      
      <span className="pagination-ellipsis">...</span>

      <button
        className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>

      <button 
        className={`pagination-arrow ${isLastPage ? 'disabled' : ''}`}
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;