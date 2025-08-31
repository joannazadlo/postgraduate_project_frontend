import { Button, Form } from 'react-bootstrap';
import styles from './ImageUpload.module.css';

type ImageUploadProps = {
  image: File | string | null;
  invalidFile: File | null;
  handleRemoveInvalidFile: () => void;
  onImageValidated: (image: File | null, error: string | null, invalidFile: File | null) => void;
  handleRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imageError?: string | null;
}

export default function ImageUpload({
  image,
  invalidFile,
  handleRemoveInvalidFile,
  onImageValidated,
  handleRemoveImage,
  fileInputRef,
  imageError }: ImageUploadProps) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    if (!validExtensions.includes(file.type)) {
      onImageValidated(null, 'Invalid file type. Please upload JPG, JPEG, PNG, or GIF images.', file);
      return;
    }

    if (file.size > maxSize) {
      onImageValidated(null, 'Image must be smaller than 5MB.', file);
      return;
    }

    onImageValidated(file, null, null);
  };

  return (
    <Form.Group controlId="formFile" className="mb-4">
      <Form.Label className="fw-semibold mb-1">Choose photo (Recommended for public recipes)</Form.Label>
      {image && (
        <div className="mb-3">
          <Form.Label className="fw-semibold mb-1">Preview</Form.Label>
          <div className={styles.imagePreviewContainer}>
            <img
              src={
                typeof image === 'string'
                  ? `${baseUrl}${image}`
                  : URL.createObjectURL(image)
              }
              alt="Recipe Preview"
              className={styles.imagePreview}
            />
            <Button variant="outline-danger" size="sm" onClick={handleRemoveImage}>
              Remove Image
            </Button>
          </div>
        </div>
      )}

      {invalidFile && (
        <div style={{ color: 'red', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{invalidFile.name} (Invalid file)</span>
          <Button variant="outline-danger" size="sm" onClick={handleRemoveInvalidFile}>
            Remove
          </Button>
        </div>
      )}

      <Form.Control
        ref={fileInputRef}
        type="file"
        isInvalid={!!imageError}
        onChange={handleImageChange}
      />
      <Form.Control.Feedback type="invalid">
        {imageError}
      </Form.Control.Feedback>

    </Form.Group>
  );
};
