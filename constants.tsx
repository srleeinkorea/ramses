import React from 'react';
import { Agent, AgentCategory, AgentType, MonitoringConfig, ChatbotConfig, ReportingConfig, VentilatorConfig, AgentConfig, KnowledgeSourceType, EMRIntegrationConfig, KnowledgeSource } from './types';

// HeroIcons as React Components
const ChartBarIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.05 1.05 0 0 1-1.485 0l-3.72-3.72a2.11 2.11 0 0 1-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097M16.5 6.75v1.875a1.5 1.5 0 0 1-1.5 1.5h-1.5a1.5 1.5 0 0 1-1.5-1.5V6.75m4.5 0a3 3 0 0 0-3-3h-1.5a3 3 0 0 0-3 3m4.5 0h-4.5m4.5 0a3.003 3.003 0 0 1-1.348 2.596M12 11.25a3.003 3.003 0 0 1-1.348-2.596m0 0a3 3 0 0 0-3-3H6.348a3 3 0 0 0-3 3v1.875a1.5 1.5 0 0 0 1.5 1.5h1.5a1.5 1.5 0 0 0 1.5-1.5V6.75m-3 0h3.852" />
  </svg>
);

const DocumentTextIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const defaultEMRConfig: EMRIntegrationConfig = {
    enabled: false,
    dataPoints: {
        vitals: true,
        labResults: false,
        medications: false,
        allergies: false,
        consultationNotes: false,
        ventilatorData: false,
    }
};

export const INITIAL_KNOWLEDGE_SOURCES: KnowledgeSource[] = [
    { id: 'kb-1', name: '병원 프로토콜', type: KnowledgeSourceType.PROTOCOL, description: '본원 입원 환자 대상 프로토콜', enabled: true, isDeletable: false },
    { id: 'kb-2', name: '소아과 가이드라인', type: KnowledgeSourceType.GUIDELINE, description: 'American Academy of Pediatrics, 2023', enabled: true, isDeletable: false },
    { id: 'kb-3', name: '의학 저널', type: KnowledgeSourceType.CUSTOM, description: 'NEJM 구독 피드', enabled: false, isDeletable: true },
];


export const AGENT_TYPE_DETAILS: Record<AgentType, {
    label: string;
    category: AgentCategory;
    icon: React.ComponentType<{ className?: string }>;
    defaultConfig: AgentConfig;
    defaultDescription: string;
}> = {
    [AgentType.MONITORING_VITAL_SIGNS]: {
        label: '생체 신호 이상 감지기',
        category: AgentCategory.MONITORING,
        icon: ChartBarIcon,
        defaultConfig: {
            parameters: { spo2: true, heartRate: true, respRate: false, ventilatorPressure: false },
            spo2Threshold: 92,
            alertSensitivity: 'medium',
            emrIntegration: defaultEMRConfig,
        } as MonitoringConfig,
        defaultDescription: 'SpO2, 심박수 등 주요 생체 신호를 모니터링하여 이상 징후를 감지합니다.',
    },
    [AgentType.MONITORING_VENTILATOR]: {
        label: '가정용 인공호흡기 이상 감지기',
        category: AgentCategory.MONITORING,
        icon: ChartBarIcon,
        defaultConfig: {
            parameters: { tidalVolume: true, peakInspiratoryPressure: true, respiratoryRate: false, leakPercentage: true },
            tidalVolumeThreshold: 6,
            pipThreshold: 40,
            leakThreshold: 20,
            alertProfile: 'standard',
            knowledgeSourceIds: [],
            emrIntegration: { ...defaultEMRConfig, dataPoints: { ...defaultEMRConfig.dataPoints, ventilatorData: true } },
        } as VentilatorConfig,
        defaultDescription: '가정용 인공호흡기의 주요 지표를 모니터링하여 잠재적인 문제를 조기에 감지합니다.',
    },
    [AgentType.CONVERSATIONAL_CHATBOT]: {
        label: '보호자 Q&A 챗봇',
        category: AgentCategory.CONVERSATIONAL,
        icon: ChatBubbleLeftRightIcon,
        defaultConfig: {
            persona: 'empathetic',
            knowledgeSourceIds: ['kb-1'],
            rules: [],
        } as ChatbotConfig,
        defaultDescription: '승인된 지식 소스를 기반으로 보호자의 질문에 답변합니다.',
    },
    [AgentType.REPORTING_SUMMARY]: {
        label: '일일 요약 생성기',
        category: AgentCategory.REPORTING,
        icon: DocumentTextIcon,
        defaultConfig: {
            frequency: 'daily',
            content: { vitalTrends: true, alertsLog: true, guardianSymptoms: false, medicationAdherence: false },
            format: 'narrative',
            emrIntegration: defaultEMRConfig,
        } as ReportingConfig,
        defaultDescription: '환자의 상태와 주요 이벤트에 대한 일일 요약을 생성합니다.',
    }
};

export const INITIAL_AGENTS: Agent<any>[] = [
  {
    id: 'agent-monitoring-001',
    name: '생체 신호 이상 감지기',
    description: 'SpO2, 심박수 등 주요 생체 신호를 모니터링하여 이상 징후를 감지합니다.',
    category: AgentCategory.MONITORING,
    type: AgentType.MONITORING_VITAL_SIGNS,
    icon: ChartBarIcon,
    enabled: true,
    config: {
      parameters: {
        spo2: true,
        heartRate: true,
        respRate: true,
        ventilatorPressure: false,
      },
      spo2Threshold: 92,
      alertSensitivity: 'medium',
      emrIntegration: {
        enabled: true,
        dataPoints: {
            vitals: true,
            labResults: true,
        }
      }
    } as MonitoringConfig,
  },
  {
    id: 'agent-chatbot-002',
    name: '보호자 Q&A 챗봇',
    description: '승인된 지식 소스를 기반으로 보호자의 질문에 답변합니다.',
    category: AgentCategory.CONVERSATIONAL,
    type: AgentType.CONVERSATIONAL_CHATBOT,
    icon: ChatBubbleLeftRightIcon,
    enabled: true,
    config: {
      persona: 'empathetic',
      knowledgeSourceIds: ['kb-1', 'kb-2', 'kb-3'],
      rules: [
        { id: 'rule-1', condition: '만약 보호자가 불안해 보이면', action: '안심시키고 간호사 호출을 제안하세요' },
        { id: 'rule-2', condition: '만약 특정 수치에 대해 질문하면', action: '정확한 수치와 함께 의미를 쉽게 설명해주세요' },
        { id: 'rule-3', condition: '만약 "숨쉬기 힘들어해요", "의식이 없어요" 등 긴급 상황 관련 단어가 포함되면', action: '즉시 119에 전화하고 의료진에게 알리도록 안내하세요' },
        { id: 'rule-4', condition: '만약 약물 부작용에 대해 질문하면', action: '일반적인 정보를 제공하고, 반드시 의사/약사와 상의하도록 강조하세요' },
        { id: 'rule-5', condition: '만약 질문을 이해하지 못하면', action: '정중하게 다시 질문해달라고 요청하고, 구체적인 예시를 들어주세요' },
      ],
    } as ChatbotConfig,
  },
  {
    id: 'agent-reporting-003',
    name: '일일 요약 생성기',
    description: '환자의 상태와 주요 이벤트에 대한 일일 요약을 생성합니다.',
    category: AgentCategory.REPORTING,
    type: AgentType.REPORTING_SUMMARY,
    icon: DocumentTextIcon,
    enabled: false,
    config: {
      frequency: 'daily',
      content: {
        vitalTrends: true,
        alertsLog: true,
        guardianSymptoms: true,
        medicationAdherence: false,
      },
      format: 'narrative',
      emrIntegration: {
        enabled: false,
        dataPoints: {
            vitals: true,
            labResults: true,
            medications: true,
            allergies: true,
            consultationNotes: false,
        }
      }
    } as ReportingConfig,
  },
  {
    id: 'agent-monitoring-004',
    name: '가정용 인공호흡기 이상 감지기',
    description: '가정용 인공호흡기의 주요 지표(일회호흡량, 최대흡기압력, 누출)를 모니터링하여 잠재적인 문제를 조기에 감지합니다.',
    category: AgentCategory.MONITORING,
    type: AgentType.MONITORING_VENTILATOR,
    icon: ChartBarIcon,
    enabled: true,
    config: {
      parameters: {
        tidalVolume: true,
        peakInspiratoryPressure: true,
        respiratoryRate: false,
        leakPercentage: true,
      },
      tidalVolumeThreshold: 6,
      pipThreshold: 40,
      leakThreshold: 20,
      alertProfile: 'standard',
      knowledgeSourceIds: [],
      emrIntegration: {
        enabled: false,
        dataPoints: {
            vitals: true,
            ventilatorData: true,
        }
      }
    } as VentilatorConfig,
  },
];