import * as styles from './SwapFooter.css';

export const SwapFooter = () => {
  return (
    <div className={styles.swapFooter}>
      <div className={styles.footerTitle}>
        Powered by
      </div>
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>{' '}</div>
      </div>
    </div>
  )
}