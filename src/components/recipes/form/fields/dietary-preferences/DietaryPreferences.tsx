import { Col, Form, Row } from 'react-bootstrap';
import styles from './DietaryPreferences.module.css';
import { DIET_OPTIONS } from '../../../../../constants/preferences';

type DietaryPreferencesProps = {
  selected: string[];
  onChange: (updated: string[]) => void;
}

export default function DietaryPreferences({ selected, onChange } : DietaryPreferencesProps) {
  const handleCheckboxChange = (option: string) => {
    const updated = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(updated);
  };

  return (
    <>
      <Form.Label className="fw-semibold mb-1">Dietary Preferences</Form.Label>
      <Form.Group className="mb-4" as={Row}>
        {DIET_OPTIONS.map(option => (
          <Col key={option} md="3">
            <div className={styles.checkboxWrapper}>
              <Form.Check
                type="checkbox"
                id={`diet-${option}`}
                label={option}
                checked={selected.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
            </div>
          </Col>
        ))}
      </Form.Group >
    </>
  );
};
