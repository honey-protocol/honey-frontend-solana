export type GovernanceTableRow = {
  id: number;
  name: string;
  votes: number;
  against: number;
  votesRequired: number;
  status: ProposalStatus;
};

export type ProposalStatus = 'draft' | 'processing' | 'approved' | 'rejected';

export type GovernanceSidebarForm = 'vote' | 'new_proposal' | 'get_vehoney';
