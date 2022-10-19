import { ProposalInfo } from 'hooks/tribeca/useProposals';

export type VoteFormProps = {
  proposalInfo: ProposalInfo | undefined | null;
  setSidebarMode: Function;
  hideMobileSidebar: Function;
};
