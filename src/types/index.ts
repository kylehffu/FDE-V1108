export type ProductNodeType = 'instrument' | 'service' | 'kit' | 'software';

export type ProductRelation = 
  | 'DownstreamValidationOf'
  | 'SpatialComplementOf'
  | 'ScaleBreakthroughOf'
  | 'OpExAlternativeOf'
  | 'RiskMitigationOf';

export interface ProductNode {
  id: string;
  name: string;
  brand: string;
  category: string;
  type: ProductNodeType;
  tier: 'CapEx' | 'OpEx';
  priceDisplay: string;
  priceValueRMB: number;
  highlightTag: string;
  summary: string;
  keySpecs: string[];
  scientificValue: string;
  lockInParams: string[];
  competitorWeakness: string;
  x: number;
  y: number;
}

export interface ProductEdge {
  id: string;
  source: string;
  target: string;
  relationship: ProductRelation;
  relationLabel: string;
  causalStory: string;
  salesPitch: string;
}

export type ScholarRole = 'PI' | 'ClinicalDirector' | 'PlatformGatekeeper' | 'Postdoc' | 'Dean';

export type ScholarRelation = 'CoAuthorWith' | 'SameMentorAs' | 'PlatformGatekeeperOf' | 'JointGrantPartner';

export interface ScholarNode {
  id: string;
  name: string;
  title: string;
  institution: string;
  department: string;
  role: ScholarRole;
  researchField: string;
  fundingLevel: 'CapEx_High' | 'OpEx_Mid' | 'Low_Funds';
  fundingAmountRMB: string;
  fundingSource: string;
  recentPaperTitle: string;
  journal: string;
  impactFactor: number;
  paperDefect: string;
  installedBase: string[];
  personalWin: string;
  avatarSeed: string;
  x: number;
  y: number;
}

export interface ScholarEdge {
  id: string;
  source: string;
  target: string;
  relationship: ScholarRelation;
  relationLabel: string;
  description: string;
  leverageScript: string;
}

export interface IntelSignal {
  id: string;
  level: 1 | 2 | 3 | 4;
  levelName: string;
  leadTime: string;
  title: string;
  institution: string;
  sourceDoc: string;
  sourceType: 'EIA_PDF' | 'Talent_Notice' | 'Clinical_ChiCTR' | 'Procurement_Gov';
  detectedDate: string;
  extractedNeeds: string[];
  estimatedBudget: string;
  targetEquipment: string[];
  actionRecommendation: string;
  extractedSnippet: string;
}

export interface VisitCaseState {
  scholarId: string;
  currentStep: 'pre' | 'in' | 'post';
  selectedOptionTier?: 'A' | 'B' | 'C';
  notesTranscript: string;
  isVoiceRecording: boolean;
  jointDocGenerated: boolean;
  dealWon: boolean;
}
