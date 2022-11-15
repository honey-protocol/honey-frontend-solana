import { useCallback, useEffect, useState } from 'react';
import { useConnection } from '@saberhq/use-solana';
import { useHoney } from '@honey-finance/sdk';
import { fetchSolPrice } from '../helpers/loanHelpers/userCollection';

export const useSolPrice = () => {
  const [price, setPrice] = useState(0);
  const connection = useConnection();
  const { parsedReserves } = useHoney();

  const getSolPrice = useCallback(async () => {
    try {
      const price = await fetchSolPrice(parsedReserves, connection);
      setPrice(price);
    } catch (e) {
      console.error(e);
    }
  }, [connection, parsedReserves]);

  useEffect(() => {
    getSolPrice();
  }, [parsedReserves]);

  return price;
};
