import { Button } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';

type FilterToggleButtonProps = {
  onClick: () => void;
}

export default function FilterToggleButton({ onClick }: FilterToggleButtonProps) {
  return (
    <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
      <Button
        variant="link"
        className="p-0 d-flex align-items-center"
        aria-label="Toggle Filter"
        style={{
          gap: '0.5rem',
          textDecoration: 'none',
          color: 'inherit',
        }}
        onClick={onClick}
      >
        <span className="fw-semibold small">FILTER</span>
        <FaFilter size={10} />
      </Button>
    </div>
  );
};
