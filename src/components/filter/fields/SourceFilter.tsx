import { Form, Button } from 'react-bootstrap';
import styles from '../RecipeFinder.module.css';

type SourceFilterProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}
export default function SourceFilter({
  options,
  value,
  onChange
}: SourceFilterProps) {
  return (
    <Form.Group>
      <div className="d-flex flex-wrap align-items-center gap-3">
        <Form.Label className="fw-semibold mb-0 d-flex align-items-center gap-1">
          Which source do you want to search?
        </Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {options.map((option) => {
            const isActive = value === option;
            return (
              <Button
                key={option}
                variant={isActive ? 'primary' : 'outline-primary'}
                className={`d-flex align-items-center ${styles.customButton}`}
                onClick={() => onChange(isActive ? '' : option)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>
    </Form.Group>
  )
}
