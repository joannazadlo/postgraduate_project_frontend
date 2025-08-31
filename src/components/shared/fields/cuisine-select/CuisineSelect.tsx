import { Form } from 'react-bootstrap';

type CuisineSelectProps = {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  label?: string;
  className?: string;
}

export default function CuisineSelect({
  options,
  value,
  onChange,
  label,
  className = 'mb-4'
}: CuisineSelectProps) {
  return (
    <Form.Group className={className}>
      {label && <Form.Label className="fw-semibold mb-1">{label}</Form.Label>}
      <div className="mb-2">
        <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select cuisine</option>
          {options.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </Form.Select>
      </div>
    </Form.Group>
  )
}
