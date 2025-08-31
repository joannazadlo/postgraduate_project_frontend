import { Alert } from 'react-bootstrap';
import { FaExclamationTriangle, FaExclamationCircle, FaQuestionCircle } from 'react-icons/fa';

type FallbackMessageProps = {
  title: string;
  message?: string;
  variant?: 'danger' | 'secondary';
}

export default function FallbackMessage({
  title,
  message,
  variant = 'secondary'
} : FallbackMessageProps) {
  const getIcon = (variant: string): React.JSX.Element => {
    switch (variant) {
      case 'danger':
        return <FaExclamationTriangle className="text-danger me-3" size={32} />;
      case 'secondary':
        return <FaExclamationCircle className="text-secondary me-3" size={32} />;
      default:
        return <FaQuestionCircle className="text-muted me-3" size={32} />;
    }
  }

  return (
    <div className="d-flex justify-content-center pt-5 pb-5">
      <Alert variant={variant} className="text-center shadow-lg p-4" role="alert">
        <div className="d-flex align-items-center justify-content-center">
          {getIcon(variant)}
          <div>
            <h5 className="mb-2">{title}</h5>
            {message && <p className="mb-0">{message}</p>}
          </div>
        </div>
      </Alert>
    </div>
  );
};
