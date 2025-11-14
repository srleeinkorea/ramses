import React from 'react';
import { Agent, VentilatorConfig, EMRDataPoints, KnowledgeSource, KnowledgeSourceType } from '../../types';
import Card from '../common/Card';
import Select from '../common/Select';
import ToggleSwitch from '../common/ToggleSwitch';

interface VentilatorAgentConfigPanelProps {
  agent: Agent<VentilatorConfig>;
  onConfigChange: (agentId: string, newConfig: VentilatorConfig) => void;
  allKnowledgeSources: KnowledgeSource[];
}

const PARAMETER_LABELS: Record<keyof VentilatorConfig['parameters'], string> = {
  tidalVolume: '일회호흡량 (Tidal Volume)',
  peakInspiratoryPressure: '최대 흡기 압력 (PIP)',
  respiratoryRate: '호흡수 (RR)',
  leakPercentage: '누출률 (%)'
};

const EMR_DATA_POINT_LABELS: Record<keyof EMRDataPoints, string> = {
    vitals: '실시간 생체 신호',
    ventilatorData: '인공호흡기 데이터',
    labResults: '최신 검사 결과',
    medications: '투약 기록',
    allergies: '알레르기 정보',
    consultationNotes: '진료 기록 노트',
};

const TYPE_COLORS: Record<string, string> = {
    [KnowledgeSourceType.PROTOCOL]: 'bg-blue-100 text-blue-800',
    [KnowledgeSourceType.GUIDELINE]: 'bg-green-100 text-green-800',
    [KnowledgeSourceType.RECOMMENDATION]: 'bg-yellow-100 text-yellow-800',
    [KnowledgeSourceType.TEXTBOOK]: 'bg-indigo-100 text-indigo-800',
    [KnowledgeSourceType.CUSTOM]: 'bg-gray-200 text-gray-800',
};


const AVAILABLE_EMR_DATA_POINTS: (keyof EMRDataPoints)[] = ['vitals', 'ventilatorData'];

const VentilatorAgentConfigPanel: React.FC<VentilatorAgentConfigPanelProps> = ({ agent, onConfigChange, allKnowledgeSources }) => {
  const { config } = agent;

  const handleParamChange = (param: keyof VentilatorConfig['parameters']) => {
    const newConfig = {
      ...config,
      parameters: {
        ...config.parameters,
        [param]: !config.parameters[param],
      },
    };
    onConfigChange(agent.id, newConfig);
  };

  const handleConfigValueChange = (field: keyof VentilatorConfig, value: string | number) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(agent.id, newConfig);
  };

  const handleEmrIntegrationChange = (field: 'enabled' | 'dataPoints', value: any) => {
    const newConfig = {
        ...config,
        emrIntegration: {
            ...config.emrIntegration,
            [field]: value,
        }
    };
    onConfigChange(agent.id, newConfig);
  };
  
  const handleEmrDataPointChange = (point: keyof EMRDataPoints) => {
    const currentPoints = config.emrIntegration.dataPoints || {};
    handleEmrIntegrationChange('dataPoints', {
        ...currentPoints,
        [point]: !currentPoints[point],
    });
  };

  const handleToggleSourceReference = (sourceId: string) => {
    const currentIds = config.knowledgeSourceIds || [];
    const newIds = currentIds.includes(sourceId)
        ? currentIds.filter(id => id !== sourceId)
        : [...currentIds, sourceId];
    onConfigChange(agent.id, { ...config, knowledgeSourceIds: newIds });
  };


  return (
    <div className="space-y-6">
      <Card title="모니터링 항목" description="이 에이전트가 인공호흡기에서 능동적으로 모니터링할 지표를 선택하세요.">
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(config.parameters).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <input
                id={key}
                name={key}
                type="checkbox"
                checked={value}
                onChange={() => handleParamChange(key as keyof VentilatorConfig['parameters'])}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={key} className="ml-3 block text-sm font-medium text-gray-700">
                {PARAMETER_LABELS[key as keyof VentilatorConfig['parameters']]}
              </label>
            </div>
          ))}
        </div>
      </Card>

      <Card title="알림 규칙" description="환자의 상태에 맞춰 알림을 트리거할 임계값과 프로필을 정의하세요.">
        <div className="space-y-6 mt-4">
          <div>
            <label htmlFor="tidalVolumeThreshold" className="block text-sm font-medium text-gray-700">
              최소 일회호흡량 (mL/kg)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <input
                    type="number"
                    name="tidalVolumeThreshold"
                    id="tidalVolumeThreshold"
                    className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={config.tidalVolumeThreshold}
                    onChange={(e) => handleConfigValueChange('tidalVolumeThreshold', parseInt(e.target.value, 10) || 0)}
                />
            </div>
             <p className="mt-2 text-sm text-gray-500">일회호흡량이 이 값 아래로 떨어지면 알림을 보냅니다.</p>
          </div>
           <div>
            <label htmlFor="pipThreshold" className="block text-sm font-medium text-gray-700">
              최대 흡기 압력 (cmH2O)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <input
                    type="number"
                    name="pipThreshold"
                    id="pipThreshold"
                    className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={config.pipThreshold}
                    onChange={(e) => handleConfigValueChange('pipThreshold', parseInt(e.target.value, 10) || 0)}
                />
            </div>
             <p className="mt-2 text-sm text-gray-500">최대 흡기 압력이 이 값을 초과하면 알림을 보냅니다.</p>
          </div>
           <div>
            <label htmlFor="leakThreshold" className="block text-sm font-medium text-gray-700">
              누출 임계값 (%)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <input
                    type="number"
                    name="leakThreshold"
                    id="leakThreshold"
                    className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={config.leakThreshold}
                    onChange={(e) => handleConfigValueChange('leakThreshold', parseInt(e.target.value, 10) || 0)}
                />
            </div>
             <p className="mt-2 text-sm text-gray-500">누출률이 이 값을 초과하면 알림을 보냅니다.</p>
          </div>
          <Select
            label="알림 프로필"
            value={config.alertProfile}
            onChange={(value) => handleConfigValueChange('alertProfile', value)}
            options={[
              { value: 'standard', label: '표준' },
              { value: 'pediatric', label: '소아용 (더 엄격한 기준 적용)' },
              { value: 'sensitive', label: '민감 (사소한 변화에도 알림)' },
            ]}
            description="환자 유형에 맞는 사전 설정된 알림 민감도를 선택합니다."
          />
        </div>
      </Card>
       <Card title="참조 지식 기반" description="고급 분류 및 결정 지원을 위해 에이전트가 참조할 지식 소스를 선택하세요.">
        <div className="space-y-2 mt-4">
            {allKnowledgeSources.map(source => {
                const isSelected = config.knowledgeSourceIds.includes(source.id);
                const isEnabledInKB = source.enabled;
                const typeColor = TYPE_COLORS[source.type as KnowledgeSourceType] || TYPE_COLORS[KnowledgeSourceType.CUSTOM];
                
                return (
                    <div key={source.id} className={`flex items-center justify-between p-3 rounded-lg border ${!isEnabledInKB ? 'bg-gray-100 opacity-60' : 'bg-gray-50'}`}>
                        <div className="flex items-start flex-1 pr-4">
                            <input
                                id={`ks-ref-vent-${source.id}`}
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSourceReference(source.id)}
                                disabled={!isEnabledInKB}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                            />
                            <div className="ml-3">
                                <label htmlFor={`ks-ref-vent-${source.id}`} className={`text-sm font-medium ${!isEnabledInKB ? 'text-gray-500' : 'text-gray-800'}`}>{source.name}</label>
                                <div className="flex items-center gap-x-2 mt-1">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColor}`}>
                                        {source.type}
                                    </span>
                                </div>
                                {!isEnabledInKB && <p className="text-xs text-red-500 mt-1">이 소스는 전체 지식 기반에서 비활성화되어 있습니다.</p>}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </Card>
      
      <Card title="EMR 실시간 데이터 연동" description="에이전트가 EMR 시스템의 최신 환자 데이터에 안전하게 접근하도록 허용합니다.">
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">EMR 연동 활성화</label>
                <ToggleSwitch enabled={config.emrIntegration.enabled} setEnabled={(e) => handleEmrIntegrationChange('enabled', e)} />
            </div>

            {config.emrIntegration.enabled && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700">접근 가능 데이터</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {AVAILABLE_EMR_DATA_POINTS.map(point => (
                             <div key={point} className="flex items-center">
                                <input
                                    id={`emr-ventilator-${point}`}
                                    type="checkbox"
                                    checked={!!config.emrIntegration.dataPoints?.[point]}
                                    onChange={() => handleEmrDataPointChange(point)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`emr-ventilator-${point}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {EMR_DATA_POINT_LABELS[point]}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             <div className="mt-4 flex items-start p-3 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs text-gray-600">
                    <strong>보안 및 규정 준수:</strong> 모든 데이터는 HIPAA 규정을 준수하여 암호화된 채널을 통해 안전하게 전송됩니다.
                </p>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default VentilatorAgentConfigPanel;