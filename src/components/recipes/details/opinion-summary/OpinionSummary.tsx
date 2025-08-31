import { FaThumbsUp, FaThumbsDown, FaMeh } from 'react-icons/fa';
import styles from './OpinionSummary.module.css';
import { RecipeRating } from '../../../../types/types';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

type OpinionSummaryProps = {
  ratingData?: RecipeRating | null;
};

export default function OpinionSummary({ ratingData }: OpinionSummaryProps) {
  const iconSize = '0.7rem';

  const likes = ratingData?.likes;
  const dislikes = ratingData?.dislikes;
  const neutral = ratingData?.neutral;

  return (
    <div className={styles.container}>
      <span
        data-tooltip-id="tooltip-likes"
        data-tooltip-content="Likes"
        className={`${styles.pill} ${styles.likes}`}
      >
        <FaThumbsUp size={iconSize} /> {likes}
      </span>

      <ReactTooltip id="tooltip-likes" place="top" className={styles.customTooltip} />

      <span
        data-tooltip-id="tooltip-dislikes"
        data-tooltip-content="Dislikes"
        className={`${styles.pill} ${styles.dislikes}`}
      >
        <FaThumbsDown size={iconSize} /> {dislikes}
      </span>

      <ReactTooltip id="tooltip-dislikes" place="top" className={styles.customTooltip} />

      <span
        data-tooltip-id="tooltip-neutral"
        data-tooltip-content="Neutral"
        className={`${styles.pill} ${styles.neutral}`}
      >
        <FaMeh size={iconSize} /> {neutral}
      </span>

      <ReactTooltip id="tooltip-neutral" place="top" className={styles.customTooltip} />
    </div>
  );
}
