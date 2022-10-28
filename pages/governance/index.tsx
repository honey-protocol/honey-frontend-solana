import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { ColumnType } from 'antd/lib/table';
import c from 'classnames';

import HoneyContent from 'components/HoneyContent/HoneyContent';
import LayoutRedesign from 'components/LayoutRedesign/LayoutRedesign';
import HoneySider from 'components/HoneySider/HoneySider';
import GovernanceSidebar from 'components/GovernanceSidebar/GovernanceSidebar';
import HoneyTable from 'components/HoneyTable/HoneyTable';
import HoneyButton from 'components/HoneyButton/HoneyButton';
import HoneyToggle from 'components/HoneyToggle/HoneyToggle';
import ProgressStatus from 'components/ProgressStatus/ProgressStatus';
import HexaBoxContainer from 'components/HexaBoxContainer/HexaBoxContainer';
import NewProposalSidebar from 'components/NewProposalSidebar/NewProposalSidebar';
import GetVeHoneySidebar from 'components/GetVeHoneySidebar/GetVeHoneySidebar';
import { GovernanceStats } from 'components/GovernanceStats/GovernanceStats';
import HoneyTableNameCell from 'components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import HoneyTableRow from 'components/HoneyTable/HoneyTableRow/HoneyTableRow';
import HoneyTooltip from 'components/HoneyTooltip/HoneyTooltip';

import {
  GovernanceSidebarForm,
  GovernanceTableRow,
  ProposalStatus
} from 'types/governance';

import * as style from 'styles/governance.css';
import { hideTablet, showTablet, table } from 'styles/markets.css';
import { vars } from 'styles/theme.css';

import { formatNumber } from 'helpers/format';
import { ProposalState } from 'helpers/dao';
import { getVoteCountFmt } from 'helpers/utils';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { useProposals } from 'hooks/tribeca/useProposals';

const { format: f, formatShortName: fsn } = formatNumber;
const NUM_PLACEHOLDERS = 0;

const Governance: NextPage = () => {
  // const [tableData, setTableData] = useState<GovernanceTableRow[]>([]);
  const [isDraftFilterEnabled, setIsDraftFilterEnabled] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(10);
  const [tableData, setTableData] = useState<GovernanceTableRow[]>();

  const [sidebarMode, setSidebarMode] =
    useState<GovernanceSidebarForm>('get_vehoney');
  const { veToken } = useGovernor();
  const proposals = useProposals();
  const [isMobileSidebarVisible, setShowMobileSidebar] = useState(false);

  const showMobileSidebar = () => {
    setShowMobileSidebar(true);
    document.body.classList.add('disable-scroll');
  };

  const hideMobileSidebar = () => {
    setShowMobileSidebar(false);
    document.body.classList.remove('disable-scroll');
  };

  const allProposals = [
    ...proposals,
    ...new Array<null>(NUM_PLACEHOLDERS).fill(null)
  ].filter(p => {
    const proposalState = p?.data?.status.state;
    return isDraftFilterEnabled
      ? true
      : proposalState !== ProposalState.Draft &&
          proposalState !== ProposalState.Canceled;
  });

  // console.log({ allProposals });

  const getStatus = (state: ProposalState): ProposalStatus => {
    // if(!state) return 'approved';
    switch (state) {
      case ProposalState.Active:
        return 'active';
      case ProposalState.Succeeded:
        return 'succeeded';
      case ProposalState.Draft:
        return 'draft';
      case ProposalState.Queued:
        return 'queued';
      case ProposalState.Canceled:
        return 'rejected';
      case ProposalState.Defeated:
        return 'rejected';
    }
  };

  const getTableData = useCallback(() => {
    const data = allProposals.map((proposal, i) => ({
      id: proposal?.data?.index || 0,
      name: proposal?.data?.proposalMetaData?.title || '',
      votes: proposal?.data?.proposalData.forVotes.toNumber() || 0,
      against: proposal?.data?.proposalData.againstVotes.toNumber() || 0,
      votesRequired: 0,
      status: proposal?.data?.status.executed
        ? 'executed'
        : proposal?.data?.status.state !== undefined
        ? getStatus(proposal?.data?.status.state)
        : 'draft'
    }));
    if (!data || !data[0]?.id || data.length === tableData?.length) return;
    // console.log({ data });
    setTableData(data);
  }, [allProposals]);

  // console.log({ tableData });

  useEffect(() => {
    getTableData();
  }, [getTableData]);

  const handleToggle = (checked: boolean) => {
    setIsDraftFilterEnabled(checked);
  };

  const DraftToggle = () => (
    <div className={style.draftToggle}>
      <div className={style.toggle}>
        <HoneyToggle checked={isDraftFilterEnabled} onChange={handleToggle} />
        <span className={style.toggleText}>Drafts</span>
      </div>
    </div>
  );

  const MainTitleTable = () => (
    <>
      <div className={style.pageTitle}>Proposals</div>
      <div className={style.pageDescription}>
        Track proposal statuses and vote on changes
      </div>
    </>
  );

  const columnsWidth: Array<number | string> = [350, 120, 130];

  const columns: ColumnType<GovernanceTableRow>[] = useMemo(
    () => [
      {
        title: MainTitleTable,
        width: columnsWidth[0],
        dataIndex: 'name',
        key: 'name',
        render: (_, row: GovernanceTableRow) => {
          return (
            <div className={style.nameCell}>
              <div className={style.logoWrapper}>
                <div className={style.collectionLogo}>
                  <HexaBoxContainer
                    borderColor={
                      ['succeeded', 'queued', 'executed'].includes(row.status)
                        ? 'green'
                        : row.status === 'rejected'
                        ? 'red'
                        : row.status === 'draft'
                        ? 'gray'
                        : 'black'
                    }
                  >
                    <div
                      className={c(
                        style.statusIcon,
                        row.status === 'draft'
                          ? style.statusDraftIcon
                          : row.status === 'succeeded' ||
                            row.status === 'queued' ||
                            row.status === 'executed'
                          ? style.statusCheckIcon
                          : row.status === 'active'
                          ? style.statusWaitIcon
                          : style.statusErrorRedIcon
                      )}
                    />
                  </HexaBoxContainer>
                </div>
              </div>
              <div className={style.titleTooltipContainer}>
                <HoneyTooltip label={row.name}>
                  <div className={style.collectionName}>{row.name}</div>
                </HoneyTooltip>
              </div>
            </div>
          );
        }
      },
      {
        title: () => {
          return <div className={style.textTabletTitle}>Voted For</div>;
        },
        dataIndex: 'votes',
        render: (votes: number) => {
          return (
            <div className={style.textTablet}>
              {veToken ? fsn(getVoteCountFmt(votes, veToken)) : 0}
            </div>
          );
        }
      },
      {
        title: () => {
          return <div className={style.textTabletTitle}>Against</div>;
        },
        dataIndex: 'against',
        render: (against: number) => {
          return (
            <div className={style.textTablet}>
              {veToken ? fsn(getVoteCountFmt(against, veToken)) : 0}
            </div>
          );
        }
      },
      {
        title: () => {
          return <div className={style.textTabletTitle}>Status</div>;
        },
        width: columnsWidth[1],
        dataIndex: 'status',
        render: (_, row: GovernanceTableRow) => {
          console.log(row.votes, row.votesRequired, {
            percent: (row.votes / row.votesRequired) * 100
          });
          return (
            <div>
              <ProgressStatus
                strokeColor={
                  row.status === 'rejected' ? vars.colors.red : undefined
                }
                percent={(row.votes / 10000000) * 100}
              />
            </div>
          );
        }
      },
      {
        title: DraftToggle,
        width: columnsWidth[2],
        render: (_: null, row: GovernanceTableRow) => {
          return (
            <div className={style.buttonsCell}>
              <HoneyButton variant="text">
                {row.status === 'active' ? 'Vote' : 'View'}
                <div className={style.arrowIcon} />
              </HoneyButton>
            </div>
          );
        }
      }
    ],
    [isDraftFilterEnabled]
  );

  const columnsMobile: ColumnType<GovernanceTableRow>[] = useMemo(
    () => [
      {
        dataIndex: 'name',
        key: 'name',
        render: (name: string, row: GovernanceTableRow) => {
          return (
            <div className={style.governanceTable}>
              <HoneyTableNameCell
                leftSide={
                  <div className={style.nameCell}>
                    <div className={style.logoWrapper}>
                      <div className={style.collectionLogo}>
                        <HexaBoxContainer>
                          <div
                            className={c(
                              style.statusIcon,
                              style.statusCheckIcon
                            )}
                          />
                        </HexaBoxContainer>
                      </div>
                    </div>
                    <div className={style.collectionName}>{name}</div>
                  </div>
                }
                rightSide={
                  <div className={style.buttonsCell}>
                    <HoneyButton variant="text">
                      Vote <div className={style.arrowIcon} />
                    </HoneyButton>
                  </div>
                }
              />

              <HoneyTableRow>
                <div className={style.textTablet}>
                  {veToken ? fsn(getVoteCountFmt(row.votes, veToken)) : 0}
                </div>
                <div className={style.textTablet}>
                  {veToken ? fsn(getVoteCountFmt(row.against, veToken)) : 0}
                </div>
                <div>
                  <ProgressStatus
                    percent={(row.votes / row.votesRequired) * 100}
                  />
                </div>
              </HoneyTableRow>
            </div>
          );
        }
      }
    ],
    [tableData, isDraftFilterEnabled]
  );

  const renderSidebar = () => {
    switch (sidebarMode) {
      case 'vote':
        return (
          <GovernanceSidebar
            onCancel={hideMobileSidebar}
            selectedProposalId={selectedProposalId}
            setSidebarMode={setSidebarMode}
          />
        );
      case 'new_proposal':
        return <NewProposalSidebar onCancel={hideMobileSidebar} />;
      case 'get_vehoney':
        return <GetVeHoneySidebar onCancel={hideMobileSidebar} />;
      default:
        return null;
    }
  };

  const handleRowClick = (
    event: React.MouseEvent<Element, MouseEvent>,
    record: GovernanceTableRow
  ) => {
    setSelectedProposalId(record.id);
    setSidebarMode('vote');
    showMobileSidebar();
  };

  const handleGetVeHoneyClick = () => {
    setSidebarMode('get_vehoney');
    showMobileSidebar();
  };

  const getRowClassName = (record: GovernanceTableRow) => {
    if (record.id === selectedProposalId) {
      return style.selectedProposal;
    }
    return '';
  };

  const handleCreateProposal = () => {
    setSidebarMode('new_proposal');
    showMobileSidebar();
  };

  return (
    <LayoutRedesign>
      <HoneyContent>
        <GovernanceStats onGetVeHoneyClick={handleGetVeHoneyClick} />
      </HoneyContent>
      <HoneyContent
        sidebar={
          <HoneySider isMobileSidebarVisible={isMobileSidebarVisible}>
            {renderSidebar()}
          </HoneySider>
        }
      >
        <div className={hideTablet}>
          <HoneyTable
            tableLayout={'fixed'}
            pagination={false}
            hasRowsShadow={true}
            rowKey={'id'}
            columns={columns}
            dataSource={tableData}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => handleRowClick(event, record)
              };
            }}
            rowClassName={getRowClassName}
            selectedRowsKeys={[selectedProposalId]}
          />
        </div>

        <div className={showTablet}>
          <div className={style.mobileTableTitle}>
            <div>{MainTitleTable()}</div>

            {DraftToggle()}
          </div>

          <div className={style.mobileTableHeader}>
            <div className={style.tableCell}>Voted For</div>
            <div className={style.tableCell}>Against</div>
            <div className={style.tableCell}>Status</div>
          </div>

          <HoneyTable
            hasRowsShadow={true}
            tableLayout="fixed"
            columns={columnsMobile}
            dataSource={tableData}
            pagination={false}
            showHeader={false}
            className={c(table, style.governanceTableMobile)}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => handleRowClick(event, record)
              };
            }}
          />
        </div>

        <div className={style.create}>
          <div className={style.nameCell}>
            <div className={style.logoWrapper}>
              <div className={style.collectionLogo}>
                <HexaBoxContainer borderColor="gray">
                  <div className={style.lampIconStyle} />
                </HexaBoxContainer>
              </div>
            </div>
            <div className={style.collectionNameCreate}>
              Do you want to suggest a new one?
            </div>
          </div>
          <div className={style.buttonsCell}>
            <HoneyButton variant="text" onClick={handleCreateProposal}>
              Create <div className={style.arrowIcon} />
            </HoneyButton>
          </div>
        </div>
      </HoneyContent>
    </LayoutRedesign>
  );
};

export default Governance;
