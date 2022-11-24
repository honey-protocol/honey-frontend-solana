import React from 'react';
import { Box, Text} from 'degen';
import * as styles from '../../styles/liquidation.css';
interface LiquidationCardProps {
  loan: any;
  openPositions?: boolean;
  liquidationType?: boolean;
  handleExecuteBid: () => void;
  index: number;
}

const LiquidationCard = (props: LiquidationCardProps) => {
  const { loan, index } = props;

  return (
        <Box className={styles.subWrapper}>
        <Box className={styles.subContainer}>
          <Box className={styles.collectionCard}>
            <Box className={styles.collectionCardWrapper}>
              <Text>Position:</Text>
              <Text>{index + 1}</Text>
            </Box>
            <Box className={styles.collectionCardWrapper}>
              <Text>Debt:</Text>
              <Text>{loan.debt} SOL</Text>
            </Box>

            {(() => {
              if (loan.is_healthy == '0') {
                return (
                  <Box className={styles.healthFactorHigh}>
                    High
                  </Box>
                )
              } else if (loan.is_healthy == '1') {
                  return (
                    <Box className={styles.healthFactorMedium}>
                      Medium
                    </Box>
                  )
              } else if (loan.is_healthy == '2') {
                  return (
                    <Box className={styles.healthFactorLow}>
                      Low
                    </Box>
                  )}
            })()}
            
            <Box className={styles.collectionCardWrapper}>
              <Text>Address:</Text>  
              <Text>{loan.owner.toString().substring(0,5)}...</Text>
            </Box>
          </Box>
        </Box>
      </Box>
  );
};

export default LiquidationCard;