import { Form, Button } from 'react-bootstrap';
import styles from '../RecipeFinder.module.css';

type VisibilityFilterProps = {
  options: string[];
  value: boolean | '';
  onChange: (value: boolean | '') => void;
}

export default function VisibilityFilter({ options, value, onChange }: VisibilityFilterProps) {
  return (
    <Form.Group>
      <div className="d-flex flex-wrap align-items-center gap-3">
        <Form.Label className="fw-semibold mb-0">
          Would you like to search for public or private recipes?
        </Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {options.map((option) => {
            const optionVal = option.toLowerCase() === 'public';
            const isActive = value === optionVal;
            return (
              <Button
                key={option}
                variant={isActive ? 'primary' : 'outline-primary'}
                className={`d-flex align-items-center ${styles.customButton}`}
                onClick={() =>
                  onChange(isActive ? '' : optionVal)
                }
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
