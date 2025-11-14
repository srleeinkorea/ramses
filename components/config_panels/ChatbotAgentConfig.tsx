import React from 'react';
import { Agent, ChatbotConfig, BehavioralRule, KnowledgeSource, KnowledgeSourceType } from '../../types';
import Card from '../common/Card';
import Select from '../common/Select';
import ToggleSwitch from '../common/ToggleSwitch';

interface ChatbotAgentConfigPanelProps {
  agent: Agent<ChatbotConfig>;
  onConfigChange: (agentId: string, newConfig: ChatbotConfig) => void;
  allKnowledgeSources: KnowledgeSource[];
}

const TYPE_COLORS: Record<string, string> = {
    [KnowledgeSourceType.PROTOCOL]: 'bg-blue-100 text-blue-800',
    [KnowledgeSourceType.GUIDELINE]: 'bg-green-100 text-green-800',
    [KnowledgeSourceType.RECOMMENDATION]: 'bg-yellow-100 text-yellow-800',
    [KnowledgeSourceType.TEXTBOOK]: 'bg-indigo-100 text-indigo-800',
    [KnowledgeSourceType.CUSTOM]: 'bg-gray-200 text-gray-800',
};

const ChatbotAgentConfigPanel: React.FC<ChatbotAgentConfigPanelProps> = ({ agent, onConfigChange, allKnowledgeSources }) => {
  const { config } = agent;

  const handlePersonaChange = (value: 'clinical' | 'empathetic' | 'direct') => {
    onConfigChange(agent.id, { ...config, persona: value });
  };

  const handleToggleSourceReference = (sourceId: string) => {
    const currentIds = config.knowledgeSourceIds || [];
    const newIds = currentIds.includes(sourceId)
        ? currentIds.filter(id => id !== sourceId)
        : [...currentIds, sourceId];
    onConfigChange(agent.id, { ...config, knowledgeSourceIds: newIds });
  };

  const handleRuleChange = (ruleId: string, field: 'condition' | 'action', value: string) => {
    const newRules = config.rules.map(rule => rule.id === ruleId ? {...rule, [field]: value} : rule);
    onConfigChange(agent.id, { ...config, rules: newRules });
  };
  
  const addRule = () => {
    const newRule: BehavioralRule = { id: `rule-${Date.now()}`, condition: '', action: '' };
    onConfigChange(agent.id, { ...config, rules: [...config.rules, newRule] });
  };

  const removeRule = (ruleId: string) => {
    const newRules = config.rules.filter(rule => rule.id !== ruleId);
    onConfigChange(agent.id, { ...config, rules: newRules });
  };

  return (
    <div className="space-y-6">
      <Card title="챗봇 페르소나" description="챗봇의 소통 스타일을 정의하세요.">
         <div className="mt-4">
            <Select
                label="소통 톤"
                value={config.persona}
                onChange={handlePersonaChange}
                options={[
                { value: 'clinical', label: '전문적 & 격식체' },
                { value: 'empathetic', label: '공감적 & 지지적' },
                { value: 'direct', label: '간결 & 직접적' },
                ]}
                description="챗봇 응답의 전반적인 톤을 설정합니다."
            />
         </div>
      </Card>
      
      <Card title="참조 지식 기반" description="챗봇이 답변을 위해 참조할 지식 소스를 선택하세요. 전체 지식 기반은 화면 상단에서 관리할 수 있습니다.">
        <div className="space-y-2 mt-4">
            {allKnowledgeSources.map(source => {
                const isSelected = config.knowledgeSourceIds.includes(source.id);
                const isEnabledInKB = source.enabled;
                const typeColor = TYPE_COLORS[source.type as KnowledgeSourceType] || TYPE_COLORS[KnowledgeSourceType.CUSTOM];
                
                return (
                    <div key={source.id} className={`flex items-center justify-between p-3 rounded-lg border ${!isEnabledInKB ? 'bg-gray-100 opacity-60' : 'bg-gray-50'}`}>
                        <div className="flex items-start flex-1 pr-4">
                            <input
                                id={`ks-ref-${source.id}`}
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSourceReference(source.id)}
                                disabled={!isEnabledInKB}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                            />
                            <div className="ml-3">
                                <label htmlFor={`ks-ref-${source.id}`} className={`text-sm font-medium ${!isEnabledInKB ? 'text-gray-500' : 'text-gray-800'}`}>{source.name}</label>
                                <div className="flex items-center gap-x-2 mt-1">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColor}`}>
                                        {source.type}
                                    </span>
                                    {source.description && <p className="text-xs text-gray-500 hidden sm:block">{source.description}</p>}
                                </div>
                                {!isEnabledInKB && <p className="text-xs text-red-500 mt-1">이 소스는 전체 지식 기반에서 비활성화되어 있습니다.</p>}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </Card>

      <Card title="행동 규칙" description="'조건-행동' 규칙을 직접 만들어 특정 상황에 대한 챗봇의 응답을 맞춤 설정하세요. 이를 통해 고도로 개인화된 대응이 가능합니다.">
        <div className="space-y-4 mt-4">
          {config.rules.map((rule) => (
            <div key={rule.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-sm font-medium text-gray-700">조건 (IF)</label>
                  <input
                    type="text"
                    value={rule.condition}
                    onChange={(e) => handleRuleChange(rule.id, 'condition', e.target.value)}
                    placeholder="예: 보호자가 SpO2에 대해 질문"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">행동 (THEN)</label>
                  <input
                    type="text"
                    value={rule.action}
                    onChange={(e) => handleRuleChange(rule.id, 'action', e.target.value)}
                    placeholder="예: 먼저 쉬운 설명 제공"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
               <div className="flex justify-end mt-3">
                    <button onClick={() => removeRule(rule.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                        삭제
                    </button>
               </div>
            </div>
          ))}
          <button onClick={addRule} className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
            + 새 규칙 추가
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotAgentConfigPanel;