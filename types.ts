export enum AgentCategory {
  MONITORING = "환자 모니터링",
  CONVERSATIONAL = "대화형 지원",
  REPORTING = "데이터 및 보고",
}

export enum AgentType {
  MONITORING_VITAL_SIGNS = "MONITORING_VITAL_SIGNS",
  MONITORING_VENTILATOR = "MONITORING_VENTILATOR",
  CONVERSATIONAL_CHATBOT = "CONVERSATIONAL_CHATBOT",
  REPORTING_SUMMARY = "REPORTING_SUMMARY",
}

export interface BehavioralRule {
  id: string;
  condition: string;
  matchType: 'any' | 'all';
  responses: string[];
  escalation: 'none' | 'nurse_alert' | 'doctor_review';
  tags?: string[];
}

export interface EMRDataPoints {
  vitals: boolean;
  ventilatorData: boolean;
  labResults: boolean;
  medications: boolean;
  allergies: boolean;
  consultationNotes: boolean;
}

export interface EMRIntegrationConfig {
  enabled: boolean;
  dataPoints: Partial<EMRDataPoints>;
}

export interface MedicalLiteratureSearchConfig {
  enabled: boolean;
  databases: {
    pubmed: boolean;
    medline: boolean;
    cochrane: boolean;
  };
  searchScope: 'abstracts' | 'full_text';
  recency: '1y' | '5y' | 'all';
}

export interface MonitoringConfig {
  parameters: {
    spo2: boolean;
    heartRate: boolean;
    respRate: boolean;
    ventilatorPressure: boolean;
  };
  spo2Threshold: number;
  alertSensitivity: 'low' | 'medium' | 'high';
  emrIntegration: EMRIntegrationConfig;
}

export interface VentilatorConfig {
  parameters: {
    tidalVolume: boolean;
    peakInspiratoryPressure: boolean;
    respiratoryRate: boolean;
    leakPercentage: boolean;
  };
  tidalVolumeThreshold: number; // in mL/kg
  pipThreshold: number; // in cmH2O
  leakThreshold: number; // in %
  alertProfile: 'standard' | 'pediatric' | 'sensitive';
  knowledgeSourceIds: string[];
  emrIntegration: EMRIntegrationConfig;
  literatureSearch: MedicalLiteratureSearchConfig;
}

export enum KnowledgeSourceType {
  PROTOCOL = "병원 프로토콜",
  GUIDELINE = "임상 가이드라인",
  RECOMMENDATION = "임상 진료 권장사항",
  TEXTBOOK = "의학 교과서",
  CUSTOM = "사용자 정의",
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: string;
  description?: string;
  enabled: boolean;
  isDeletable: boolean;
}

export interface ChatbotConfig {
  persona: 'clinical' | 'empathetic' | 'direct';
  knowledgeSourceIds: string[];
  rules: BehavioralRule[];
  literatureSearch: MedicalLiteratureSearchConfig;
}

export interface ReportingConfig {
  frequency: 'daily' | 'twice_daily' | 'on_demand';
  content: {
    vitalTrends: boolean;
    alertsLog: boolean;
    guardianSymptoms: boolean;
    medicationAdherence: boolean;
  };
  format: 'bullet' | 'narrative' | 'table';
  emrIntegration: EMRIntegrationConfig;
  literatureSearch: MedicalLiteratureSearchConfig;
}

export type AgentConfig = MonitoringConfig | ChatbotConfig | ReportingConfig | VentilatorConfig;

export interface Agent<T extends AgentConfig> {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  type: AgentType;
  icon: React.ComponentType<{ className?: string }>;
  config: T;
  enabled: boolean;
}

export interface AgentTemplate {
  id: string;
  name: string;
  agentType: AgentType;
  config: AgentConfig;
}