export type GovernanceTableRow = {
  id: number;
  name: string;
  votes: number;
  against: number;
  votesRequired: number;
  status: ProposalStatus;
};

export type ProposalStatus =
  | 'draft'
  | 'active'
  | 'succeeded'
  | 'queued'
  | 'executed'
  | 'rejected';

export type GovernanceSidebarForm = 'vote' | 'new_proposal' | 'get_vehoney';
