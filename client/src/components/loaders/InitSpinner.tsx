import styles from './init_spinner.module.css';

const InitSpinner = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        <div className={styles.face}>
          <div className={styles.circle}></div>
        </div>
        <div className={styles.face}>
          <div className={styles.circle}></div>
        </div>
        <div className={styles.face}>
          <div className={styles.circle}></div>
        </div>
        <div className={styles.center}></div>
      </div>
    </div>
  );
};

export default InitSpinner;
