export type LocalGovCategory =
  | 'ALL'
  | 'PAO' // อบจ.
  | 'CITY_MUNICIPALITY' // เทศบาลนคร
  | 'TOWN_MUNICIPALITY' // เทศบาลเมือง
  | 'SUBDISTRICT_MUNICIPALITY' // เทศบาลตำบล
  | 'TAO'; // อบต.

export type ElectionResultType =
  | 'ALL'
  | 'ELECTED' // ได้รับเลือกตั้ง
  | 'NOT_ELECTED' // ไม่ได้รับเลือกตั้ง
  | 'PENDING_CERTIFICATION' // รอการรับรองผล
  | 'DISQUALIFIED'; // ขาดคุณสมบัติ

export type LegalFilterType =
  | 'ALL'
  | 'COURT_HEARING' // มีคดีไต่สวน / คำพิพากษาศาลฎีกา
  | 'QUALIFIED' // คุณสมบัติครบถ้วน
  | 'REVOKED' // เพิกถอนสิทธิ
  | 'PENDING_INQUIRY'; // อยู่ระหว่างไต่สวน

export interface CourtCaseDetail {
  caseBlackNo: string;
  caseRedNo: string;
  courtName: string;
  judgmentDate: string;
  petitioner: string;
  respondent: string;
  chargesSummary: {
    issue: string;
    allegation: string;
    investigationRef: string;
  };
  judgmentSummary: {
    rulingQuote: string;
    candidacyStatus: string;
    electionResultEffect: string;
    ecEndorsement: string;
  };
  certifiedBy: {
    name: string;
    position: string;
  };
  docRef: string;
  pdfPageCount: number;
}

export interface PollingStationResult {
  stationNo: number;
  stationName: string;
  subdistrict: string;
  eligibleVoters: number;
  ballotsCast: number;
  candidateVotes: number;
  noVotes: number;
  invalidBallots: number;
}

export interface Candidate {
  id: string; // e.g. REG-68-01-0001
  candidateNumber: number;
  name: string;
  positionBadge?: string; // e.g. นายกเทศมนตรี
  politicalGroup: string;
  citizenIdMasked: string;
  citizenIdFull: string;
  registrationDate: string;
  localGovName: string;
  localGovType: LocalGovCategory;
  localGovTypeLabel: string;
  constituency: string; // เขตเลือกตั้ง
  district: string; // อำเภอ
  votesReceived: number;
  votePercentage: number;
  rankNote?: string;
  electionResult: 'ELECTED' | 'NOT_ELECTED' | 'PENDING_CERTIFICATION' | 'DISQUALIFIED';
  electionResultLabel: string;
  legalStatus: {
    type: 'SUPREME_COURT_DISMISSED' | 'QUALIFIED' | 'UNDER_INVESTIGATION' | 'QUALIFIED_CERTIFIED' | 'SUPREME_COURT_REVOKED';
    badgeText: string;
    subText?: string;
    tone: 'gold' | 'green' | 'amber' | 'red' | 'gray';
  };
  courtCase?: CourtCaseDetail;
  pollingStations?: PollingStationResult[];
  campaignExpenses?: {
    limit: number;
    spent: number;
    submissionDate: string;
    status: string;
    breakdown: { item: string; cost: number }[];
  };
  avatarUrl?: string;
}

export interface DistrictInfo {
  id: string;
  name: string;
  shortName: string;
  orgCount: number;
  totalVoters: number;
  turnoutPercentage: number;
}

export interface ElectionSummaryKPI {
  totalOrganizations: number; // 103
  completedDistricts: number; // 9
  orgBreakdown: string; // อบจ. 1 • ทน. 1 • ทม. 1 • ทต. 23 • อบต. 77
  totalConstituencies: number; // 684
  totalPollingUnits: number; // 1248
  totalCandidates: number; // 2418
  mayorCandidates: number; // 284
  councilCandidates: number; // 2134
  endorsedWinners: number; // 620
  pendingCertification: number; // 64
  pendingPercentage: number; // 9.3%
  complaintsAndCases: number; // 18
  supremeCourtRevocations: number; // 3
}
