import type { NextPage } from 'next';
import HoneyContent from '../../components/HoneyContent/HoneyContent';
import LayoutRedesign from '../../components/LayoutRedesign/LayoutRedesign';
import HoneySider from '../../components/HoneySider/HoneySider';
import GovernanceSidebar from '../../components/GovernanceSidebar/GovernanceSidebar';
import HoneyTable from '../../components/HoneyTable/HoneyTable';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GovernanceSidebarForm,
  GovernanceTableRow,
  ProposalStatus
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
import { GovernanceStats } from '../../components/GovernanceStats/GovernanceStats';
import { useGovernor } from 'hooks/tribeca/useGovernor';
import { useProposals } from 'hooks/tribeca/useProposals';
import { ProposalState } from 'helpers/dao';

const { format: f, formatShortName: fsn } = formatNumber;

const Governance: NextPage = () => {
  // const [tableData, setTableData] = useState<GovernanceTableRow[]>([]);
  const [isDraftFilterEnabled, setIsDraftFilterEnabled] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(10);
  const [tableData, setTableData] = useState<GovernanceTableRow[]>();

  const [sidebarMode, setSidebarMode] =
    useState<GovernanceSidebarForm>('get_vehoney');

  const proposals = useProposals();

  console.log({ proposals });

  const getStatus = (state: ProposalState): ProposalStatus => {
    // if(!state) return 'approved';
    switch (state) {
      case ProposalState.Active:
        return 'approved';
      case ProposalState.Succeeded:
        return 'approved';
      case ProposalState.Draft:
        return 'draft';
      case ProposalState.Queued:
        return 'processing';
      case ProposalState.Canceled:
        return 'rejected';
      case ProposalState.Defeated:
        return 'rejected';
    }
  };

  const getTableData = useCallback(() => {
    const data = proposals.map((proposal, i) => ({
      id: proposal.data?.index || 0,
      name: proposal.data?.proposalMetaData?.title || '',
      votes: proposal.data?.proposalData.forVotes.toNumber() || 0,
      against: proposal.data?.proposalData.againstVotes.toNumber() || 0,
      votesRequired: 0,
      status:
        proposal.data?.status.state !== undefined
          ? getStatus(proposal.data?.status.state)
          : 'approved'
    }));
    if (!data || !data[0]?.id || data.length === tableData?.length) return;
    console.log({ data });
    setTableData(data);
  }, [proposals]);

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
    [isDraftFilterEnabled]
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
    setSidebarMode('get_vehoney');
  };

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
      <HoneyContent hasNoSider={true}>
        <GovernanceStats onGetVeHoneyClick={handleGetVeHoneyClick} />
      </HoneyContent>
      <HoneyContent>
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
        <div className={style.create}>
          <div className={style.nameCell}>
            <div className={style.logoWrapper}>
              <div className={style.collectionLogo}>
                <HexaBoxContainer borderColor="gray">
                  <div className={style.lampIconStyle} />
                </HexaBoxContainer>
              </div>
            </div>
            <div className={style.collectionName}>
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
      <HoneySider page={'governance'}>{renderSidebar()}</HoneySider>
    </LayoutRedesign>
  );
};

export default Governance;
