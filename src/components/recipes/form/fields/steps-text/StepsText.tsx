import { Form } from 'react-bootstrap';

type StepsTextProps = {
  steps: string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function StepsText({ steps, onChange } : StepsTextProps) {
  return (
    <Form.Group className="mb-4">
      <Form.Label className="fw-semibold mb-1">Steps</Form.Label>
      <Form.Control
        as="textarea"
        rows={6}
        value={steps}
        onChange={onChange}
      />
    </Form.Group>
  )
}
