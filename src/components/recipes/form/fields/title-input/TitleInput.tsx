import { Form } from 'react-bootstrap';

type TitleInputProps = {
  title: string
  onChange: (value: string) => void;
  validated: boolean
}

export default function TitleInput({ title, onChange, validated }: TitleInputProps) {
  return (
    <Form.Group className="mb-4" controlId="formTitle">
      <Form.Label className="fw-semibold mb-1">Title</Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="Enter title"
        value={title}
        isInvalid={validated && !title.trim()}

        onChange={(e) => onChange(e.target.value)}
      />
      <Form.Control.Feedback type="invalid">
        Please enter a title.
      </Form.Control.Feedback>
    </Form.Group>

  )
}
