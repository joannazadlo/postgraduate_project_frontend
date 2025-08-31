import { Button } from "react-bootstrap"
import {
  FaThumbsUp,
  FaThumbsDown,
  FaRegMeh
} from 'react-icons/fa';
import { RecipeRating } from "../../../../types/types";
import styles from './OpinionPanel.module.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

type OpinionPanelProps = {
  ratingData?: RecipeRating | null;
  onOpinionChange?: (opinion: 'like' | 'dislike' | 'neutral' | null) => void;
}

export default function OpinionPanel({ ratingData, onOpinionChange }: OpinionPanelProps) {
  const handleClick = (opinion: 'like' | 'dislike' | 'neutral') => {
    if (ratingData?.userOpinion === opinion) {
      onOpinionChange?.(null);
    } else {
      onOpinionChange?.(opinion);
    }
  }

  return (
    <div className={styles.opinionPanel}>
      <small className={styles.opinionLabel}>Your opinion:</small>

      <Button
        size="sm"
        variant={ratingData?.userOpinion === 'like' ? 'success' : 'outline-success'}
        data-tooltip-id="tooltip-like"
        data-tooltip-content="I like it"
        onClick={() => handleClick('like')}
      >
        <FaThumbsUp />
      </Button>

      <ReactTooltip id="tooltip-like" place="top" className={styles.customTooltip} />

      <Button
        size="sm"
        variant={ratingData?.userOpinion === 'dislike' ? 'danger' : 'outline-danger'}
        data-tooltip-id="tooltip-dislike"
        data-tooltip-content="I don't like it"
        onClick={() => handleClick('dislike')}
      >
        <FaThumbsDown />
      </Button>

      <ReactTooltip id="tooltip-dislike" place="top" className={styles.customTooltip} />

      <Button
        size="sm"
        variant={ratingData?.userOpinion === 'neutral' ? 'secondary' : 'outline-secondary'}
        data-tooltip-id="tooltip-neutral"
        data-tooltip-content="No strong feelings"
        onClick={() => handleClick('neutral')}
      >
        <FaRegMeh />
      </Button>

      <ReactTooltip id="tooltip-neutral" place="top" className={styles.customTooltip} />
    </div>
  )
}
