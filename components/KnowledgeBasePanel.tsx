import React, { useState } from 'react';
import { KnowledgeSource, KnowledgeSourceType } from '../types';
import Card from './common/Card';
import Select from './common/Select';
import ToggleSwitch from './common/ToggleSwitch';

interface KnowledgeBasePanelProps {
  knowledgeSources: KnowledgeSource[];
  onUpdateKnowledgeSources: (newSources: KnowledgeSource[]) => void;
}

const KNOWLEDGE_SOURCE_TYPE_OPTIONS = Object.entries(KnowledgeSourceType).map(([_, value]) => ({ value, label: value }));

const TYPE_COLORS: Record<string, string> = {
    [KnowledgeSourceType.PROTOCOL]: 'bg-blue-100 text-blue-800',
    [KnowledgeSourceType.GUIDELINE]: 'bg-green-100 text-green-800',
    [KnowledgeSourceType.RECOMMENDATION]: 'bg-yellow-100 text-yellow-800',
    [KnowledgeSourceType.TEXTBOOK]: 'bg-indigo-100 text-indigo-800',
    [KnowledgeSourceType.CUSTOM]: 'bg-gray-200 text-gray-800',
};

const KnowledgeBasePanel: React.FC<KnowledgeBasePanelProps> = ({ knowledgeSources, onUpdateKnowledgeSources }) => {
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSource, setNewSource] = useState<Omit<KnowledgeSource, 'id' | 'enabled' | 'isDeletable'>>({
      name: '',
      type: KnowledgeSourceType.GUIDELINE,
      description: '',
  });
  const [customTypeName, setCustomTypeName] = useState('');

  const handleToggleSource = (sourceId: string) => {
    const newKnowledgeBase = knowledgeSources.map(source =>
      source.id === sourceId ? { ...source, enabled: !source.enabled } : source
    );
    onUpdateKnowledgeSources(newKnowledgeBase);
  };
  
  const handleAddSource = () => {
    const isCustom = newSource.type === KnowledgeSourceType.CUSTOM;
    if (newSource.name.trim() && (!isCustom || (isCustom && customTypeName.trim()))) {
      const sourceToAdd: KnowledgeSource = {
        id: `kb-${Date.now()}`,
        name: newSource.name.trim(),
        description: newSource.description?.trim(),
        type: isCustom ? customTypeName.trim() : newSource.type,
        enabled: true,
        isDeletable: true,
      };
      onUpdateKnowledgeSources([...knowledgeSources, sourceToAdd]);
      setNewSource({ name: '', type: KnowledgeSourceType.GUIDELINE, description: '' });
      setCustomTypeName('');
      setIsAddingSource(false);
    }
  };

  const handleRemoveSource = (sourceId: string) => {
    const newKnowledgeBase = knowledgeSources.filter(source => source.id !== sourceId);
    onUpdateKnowledgeSources(newKnowledgeBase);
  };

  return (
    <Card title="전체 Knowledge DB 관리" description="모든 AI 에이전트가 참조할 수 있는 공통 지식 소스(Knowledge Source)를 관리합니다.">
        <div className="space-y-2 mt-4">
        {knowledgeSources.map(source => {
            const typeColor = TYPE_COLORS[source.type as KnowledgeSourceType] || TYPE_COLORS[KnowledgeSourceType.CUSTOM];
            return (
            <div key={source.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 pr-4">
                    <div className="flex items-center gap-x-2">
                        <span className="text-sm font-medium text-gray-800">{source.name}</span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${typeColor}`}>
                            {source.type}
                        </span>
                    </div>
                    {source.description && <p className="text-xs text-gray-500 mt-1">{source.description}</p>}
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0">
                <ToggleSwitch enabled={source.enabled} setEnabled={() => handleToggleSource(source.id)} />
                {source.isDeletable && (
                    <button 
                    onClick={() => handleRemoveSource(source.id)} 
                    className="text-gray-400 hover:text-red-600 p-1"
                    aria-label={`'${source.name}' 소스 삭제`}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    </button>
                )}
                </div>
            </div>
            )
        })}
        </div>
        
        {!isAddingSource && (
            <button onClick={() => setIsAddingSource(true)} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800">
            + 새 지식 소스 추가
        </button>
        )}

        {isAddingSource && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border space-y-4">
            <Select
                label="소스 유형"
                value={newSource.type}
                onChange={(v) => setNewSource(s => ({...s, type: v}))}
                options={KNOWLEDGE_SOURCE_TYPE_OPTIONS}
            />
            {newSource.type === KnowledgeSourceType.CUSTOM && (
                <div>
                <label htmlFor="customTypeName" className="block text-sm font-medium text-gray-700">사용자 정의 유형 이름</label>
                <input
                    type="text"
                    id="customTypeName"
                    value={customTypeName}
                    onChange={(e) => setCustomTypeName(e.target.value)}
                    placeholder="예: 내부 위키, 학회 발표 자료"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700">이름 / 제목</label>
                <input
                    type="text"
                    value={newSource.name}
                    onChange={(e) => setNewSource(s => ({ ...s, name: e.target.value }))}
                    placeholder="예: 최신 감염병 가이드라인"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
            </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">설명 / 출처 (선택 사항)</label>
                <input
                    type="text"
                    value={newSource.description}
                    onChange={(e) => setNewSource(s => ({ ...s, description: e.target.value }))}
                    placeholder="예: 질병관리청, 2024년 3월판"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button onClick={() => {
                    setIsAddingSource(false);
                    setCustomTypeName('');
                }} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm">
                    취소
                </button>
                <button onClick={handleAddSource} disabled={!newSource.name.trim() || (newSource.type === KnowledgeSourceType.CUSTOM && !customTypeName.trim())} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">
                    저장
                </button>
            </div>
        </div>
        )}
    </Card>
  );
};

export default KnowledgeBasePanel;