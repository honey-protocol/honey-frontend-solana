import { Proposal } from '../../../contexts/GovernanceProvider';

export type VoteFormProps = {
  proposalInfo: Proposal;
  setSidebarMode: Function;
  onClose: Function;
};
