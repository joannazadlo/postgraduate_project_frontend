import { Form } from 'react-bootstrap';
import styles from './DislikedRecipesCheckbox.module.css'

type DislikedRecipesCheckboxProps = {
  excludeDisliked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  layoutClassName?: string;
};

export default function DislikedRecipesCheckbox({ excludeDisliked, onChange, label, layoutClassName }: DislikedRecipesCheckboxProps) {
  return (
    <Form.Group>
      {label && <Form.Label className="fw-semibold mb-1">{label}</Form.Label>}
      <div className={`d-flex ${layoutClassName ?? 'flex-wrap gap-2'}`}>
        <Form.Check
          type="checkbox"
          id="exclude-disliked"
          label="Exclude recipes you've disliked"
          checked={excludeDisliked}
          className={styles.brightCheckbox}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    </Form.Group>
  );
};
