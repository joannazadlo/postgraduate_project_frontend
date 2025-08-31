import { Form } from 'react-bootstrap';

type VisibilitySwitchProps = {
  isPublic: boolean;
  onToggle: (value: boolean) => void;
}

export default function VisibilitySwitch({ isPublic, onToggle }: VisibilitySwitchProps) {
  return (
    <Form.Group className="mb-4" controlId="visibilitySwitch">
      <Form.Label className="fw-semibold mb-2">Visible to other users?</Form.Label>
      <Form.Check
        type="switch"
        label={isPublic ? 'Yes (Public)' : 'No (Private)'}
        checked={isPublic}
        onChange={() => onToggle(!isPublic)}
      />
    </Form.Group>
  );
};
