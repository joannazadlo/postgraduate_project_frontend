import { Form } from 'react-bootstrap';

type CookingTimeProps = {
  selected: string;
  onChange: (value: string) => void;
}

const options = [
  'Under 15 Minutes',
  'Under 30 minutes',
  'Under 45 Minutes',
  '1–2 hours',
  '2–3 hours',
  'Over 3 hours',
];

export default function CookingTime({ selected, onChange } : CookingTimeProps) {
  return (
    <Form.Group className="mb-4" controlId="cookingTimeSelect">
      <Form.Label className="fw-semibold mb-1">Cooking Time</Form.Label>
      <Form.Select value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select time</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};
