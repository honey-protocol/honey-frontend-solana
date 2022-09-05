import { FC, useState } from 'react';
import Layout from '../Layout/Layout';
import { InfoBlock } from '../InfoBlock/InfoBlock';
import { InputsBlock } from '../InputsBlock/InputsBlock';
import { Range } from '../Range/Range';

type BorrowFormProps = {};

const BorrowForm: FC<BorrowFormProps> = () => {
  const [valueUSD, setValueUSD] = useState('');
  const [valueUSDC, setValueUSDC] = useState('');
  const [rangeValue, setRangeValue] = useState(0);

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
        valueUSD={valueUSD}
        valueUSDC={valueUSDC}
        onChangeUSD={setValueUSD}
        onChangeUSDC={setValueUSDC}
      />
      <Range
        currentValue={rangeValue}
        estimatedValue={1000}
        borrowedValue={150}
        onChange={setRangeValue}
      />
    </Layout>
  );
};

export default BorrowForm;
