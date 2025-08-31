import { Button, Form } from 'react-bootstrap';
import { FaLeaf, FaSeedling, FaGlassWhiskey, FaBreadSlice } from 'react-icons/fa';
import styles from './DietPreferencesSelect.module.css';

type DietPreferencesSelectProps = {
  options: string[];
  selected: string[];
  onChange: (updated: string[]) => void;
  label?: string;
  className?: string;
  layoutClassName?: string;
};

export default function DietPreferencesSelect({
  options,
  selected,
  onChange,
  label,
  className = 'mb-4',
  layoutClassName
}: DietPreferencesSelectProps) {
  const toggleDiet = (option: string) => {
    const updated = selected.includes(option)
      ? selected.filter((d) => d !== option)
      : [...selected, option];
    onChange(updated);
  };

  const getIcon = (option: string) => {
    switch (option) {
      case 'Vegan':
        return <FaLeaf />;
      case 'Vegetarian':
        return <FaSeedling />;
      case 'Dairy-Free':
        return <FaGlassWhiskey />;
      case 'Gluten-Free':
        return <FaBreadSlice />;
      default:
        return null;
    }
  };

  return (
    <Form.Group className={className}>
      {label && <Form.Label className="fw-semibold mb-1">{label}</Form.Label>}
      <div className={`d-flex ${layoutClassName ?? 'flex-wrap gap-2'}`}>
        {options.map((option) => {
          const isActive = selected.includes(option);
          return (
            <Button
              key={option}
              variant={isActive ? 'primary' : 'outline-primary'}
              className={styles.customButton}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggleDiet(option)}
            >
              {getIcon(option)}
              <span className="ms-2">{option}</span>
            </Button>
          );
        })}
      </div>
    </Form.Group>
  );
}
