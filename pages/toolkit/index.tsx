import type { NextPage } from 'next';
import Layout from '../../components/Layout/Layout';
import { InfoBlock } from '../../components/InfoBlock/InfoBlock';
import { InputsBlock } from '../../components/InputsBlock/InputsBlock';
import {useState} from 'react';
import { Range } from '../../components/Range/Range';

const Governance: NextPage = () => {
  const mockBorrowedValue = 10;
  const mockEstimatedValue = 1000;
  const mockPriceUSDtoUSDC = 1.001;
  const [newBorrowValue, setNewBorrowValue] = useState(mockBorrowedValue);

  const onChangeUSD = (value: string) => {
    setNewBorrowValue(Number(value))
  }
  const onChangeUSDC = (value: string) => {
    setNewBorrowValue(Number(value) / mockPriceUSDtoUSDC)
  }

  return (
    <Layout>
      <InfoBlock
        value="$ 1,000"
        valueSize="big"
        footer={<span>Estimated value</span>}
      />
      <InfoBlock
        title="Allowance"
        value="$ 600"
        footer={<span>No more than 60%</span>}
      />

      <InputsBlock
        valueUSD={newBorrowValue.toString()}
        valueUSDC={(newBorrowValue * mockPriceUSDtoUSDC).toString()}
        onChangeUSD={onChangeUSD}
        onChangeUSDC={onChangeUSDC}
      />
      <Range
        estimatedValue={mockEstimatedValue}
        borrowedValue={mockBorrowedValue}
        currentValue={newBorrowValue}
        onChange={value => setNewBorrowValue(value)}
      />
    </Layout>
  );
};

export default Governance;
