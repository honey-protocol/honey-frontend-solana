import type { NextPage } from 'next';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import HoneySider from '../../components/HoneySider/HoneySider';
import GovernanceSidebar from '../../components/GovernanceSidebar/GovernanceSidebar';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import React, { useEffect, useMemo, useState } from 'react';
import {
  GovernanceSidebarForm,
  GovernanceTableRow
} from '../../types/governance';
import * as style from '../../styles/governance.css';
import HexaBoxContainer from '../../components/HexaBoxContainer/HexaBoxContainer';
import { ColumnType } from 'antd/lib/table';
import HoneyButton from '../../components/HoneyButton/HoneyButton';
import HoneyToggle from '../../components/HoneyToggle/HoneyToggle';
import ProgressStatus from '../../components/ProgressStatus/ProgressStatus';
import c from 'classnames';
import NewProposalSidebar from '../../components/NewProposalSidebar/NewProposalSidebar';
import GetVeHoneySidebar from '../../components/GetVeHoneySidebar/GetVeHoneySidebar';
import { formatNumber } from '../../helpers/format';
import {GovernanceStats} from "../../components/GovernanceStats/GovernanceStats";
import { hideTablet, showTablet, table } from 'styles/markets.css';
import HoneyTableNameCell from '../../components/HoneyTable/HoneyTableNameCell/HoneyTableNameCell';
import HoneyTableRow from '../../components/HoneyTable/HoneyTableRow/HoneyTableRow';

const { format: f, formatShortName: fsn } = formatNumber;

const Governance: NextPage = () => {
  const [tableData, setTableData] = useState<GovernanceTableRow[]>([]);
  const [isDraftFilterEnabled, setIsDraftFilterEnabled] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(10);

  const [sidebarMode, setSidebarMode] =
    useState<GovernanceSidebarForm>('get_vehoney');

  // PUT YOUR DATA SOURCE HERE
  // MOCK DATA FOR NOW
  useEffect(() => {
    const mockData: GovernanceTableRow[] = [
      {
        id: 1,
        name: 'Upgrade the StarkProxy smart contract',
        votes: 25000,
        against: 313,
        votesRequired: 50000,
        status: 'approved'
      },
      {
        id: 2,
        name: 'Upgrade the StarkProxy smart contract',
        votes: 39487,
        against: 313,
        votesRequired: 50000,
        status: 'approved'
      },
      {
        id: 3,
        name: 'Draft proposal',
        votes: 5000,
        against: 313,
        votesRequired: 50000,
        status: 'draft'
      }
    ];

    setTableData(mockData);
  }, [isDraftFilterEnabled]);

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
        render: (name: string) => {
          return (
            <div className={style.nameCell}>
              <div className={style.logoWrapper}>
                <div className={style.collectionLogo}>
                  <HexaBoxContainer>
                    <div
                      className={c(style.statusIcon, style.statusCheckIcon)}
                    />
                  </HexaBoxContainer>
                </div>
              </div>
              <div className={style.collectionName}>{name}</div>
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
          return <div className={style.textTablet}>{fsn(votes)}</div>;
        }
      },
      {
        title: () => {
          return <div className={style.textTabletTitle}>Against</div>;
        },
        dataIndex: 'against',
        render: (against: number) => {
          return <div className={style.textTablet}>{fsn(against)}</div>;
        }
      },
      {
        title: () => {
          return <div className={style.textTabletTitle}>Status</div>;
        },
        width: columnsWidth[1],
        dataIndex: 'status',
        render: (status, row: GovernanceTableRow) => {
          return (
            <div>
              <ProgressStatus percent={(row.votes / row.votesRequired) * 100} />
            </div>
          );
        }
      },
      {
        title: DraftToggle,
        width: columnsWidth[2],
        render: (_: null) => {
          return (
            <div className={style.buttonsCell}>
              <HoneyButton variant="text">
                Vote <div className={style.arrowIcon} />
              </HoneyButton>
            </div>
          );
        }
      }
    ],
    [tableData, isDraftFilterEnabled]
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
                            className={c(style.statusIcon, style.statusExecutedIcon)}
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
                <div className={style.textTablet}>{fsn(row.votes)}</div>
                <div className={style.textTablet}>{fsn(row.against)}</div>
                <div>
                  <ProgressStatus percent={(row.votes / row.votesRequired) * 100} />
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
        return <GovernanceSidebar selectedProposalId={selectedProposalId} />;
      case 'new_proposal':
        return <NewProposalSidebar />;
      case 'get_vehoney':
        return <GetVeHoneySidebar />;
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
  };

  const handleGetVeHoneyClick = () => {
    setSidebarMode('get_vehoney')
  }

  const getRowClassName = (record: GovernanceTableRow) => {
    if (record.id === selectedProposalId) {
      return style.selectedProposal;
    }
    return '';
  };

  const handleCreateProposal = () => {
    setSidebarMode('new_proposal');
  };

  return (
    <LayoutRedesign>
      <HoneyContent>
        <GovernanceStats
          onGetVeHoneyClick={handleGetVeHoneyClick}
        />
      </HoneyContent>
      <HoneyContent sidebar={
        <HoneySider>{renderSidebar()}</HoneySider>
      }>
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
            <div>
              {MainTitleTable()}
            </div>

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
