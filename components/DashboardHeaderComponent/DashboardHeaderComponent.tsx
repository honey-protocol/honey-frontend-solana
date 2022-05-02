import Link from 'next/link';
import { Box, Text } from 'degen';
import React from 'react';
import * as styles from './DashboardHeaderComponent.css';

type TopPanel = {
    title: string;
    value: string;
    key: number;
  };

interface DashboardHeaderComponentProps {
    onSelectPanel: (key: number) => void,
    data: TopPanel[]
  }

const DashboardHeaderComponent = (props: DashboardHeaderComponentProps) => {

    const {
        data,
        onSelectPanel
      } = props;

    return (
        <Box className={styles.headerWrapper}>
            {data.map((item, index) => (
                <div onClick={() => onSelectPanel(item.key)} key={index}>
                    <Box key={index}>
                        <Text>{item.title}</Text>
                        {item.key == 4 ?
                            <Text color={'green'}>{item.value}</Text>
                            :
                            <Text>{item.value}</Text>
                        }
                    </Box>
                </div>
            ))}
        </Box>
    );
};

export default DashboardHeaderComponent;
