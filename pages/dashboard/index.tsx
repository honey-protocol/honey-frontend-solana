import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, Box, Text } from 'degen';
import { Stack } from 'degen';
import Layout from '../../components/Layout/Layout';
import DashboardHeaderComponent from '../../components/DashboardHeaderComponent/DashboardHeaderComponent';

// TOOD: Needs to accept props for data
const topPanel = [
  {"title": "Your NFTs staked", "value": "14", key: 1},
  {"title": "Your positions", "value": "0", key: 2},
  {"title": "Avg APR", "value": "14.20%", key: 3},
  {"title": "Health Factor", "value": "69%", key: 4}
]

const bottomPanel = [
  {
    "title": "Community",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "icon": "💰",
    "link": "#"
  },
  {
    "title": "Learn to earn",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "icon": "💰",
    "link": "#"
  },
  {
    "title": "Risks",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "icon": "💰",
    "link": "#"
  }
]

const Dashboard: NextPage = () => {

  const [mainPanel, setMainPanel] = useState(1)

  function selectPanel(key: number) {
    setMainPanel(key);
    console.log(key)
  };

  // Update mainPanel state when the user clicks on a panel
  useEffect(() => {
    selectPanel(1);
  }, []);



  return (
    <Layout>
      <Stack>
        <Box>
          <DashboardHeaderComponent
            onSelectPanel={selectPanel}
            data={topPanel}
          />
        </Box>
        <Box
          backgroundColor="backgroundTertiary"
          borderRadius="2xLarge"
          width="full"
          minHeight='32'
        >
          <Text>Panel {mainPanel}</Text>
        </Box>
        <Box marginBottom="1">
          <Stack
            space="3"
            direction="horizontal"
          >
            {bottomPanel.map((panel, index) => (
              <Link href={panel.link} key={index} passHref>
                <Box
                  key={index}
                  backgroundColor="backgroundTertiary"
                  padding="5"
                  borderRadius="2xLarge"
                  width="full"
                >
                  <Stack>
                    <Box paddingBottom="3">
                      <Avatar
                        label="icon"
                        size="10"
                        src={''}
                      />
                    </Box>
                    <Box>
                      <Text
                        weight="semiBold"
                        variant="large"
                        ellipsis
                        lineHeight="none"
                        whiteSpace="pre-wrap"
                      >
                        {panel.title}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        size="small"
                        align="left"
                        weight="normal"
                        color="textTertiary"
                      >
                        {panel.text}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              </Link>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Dashboard;
