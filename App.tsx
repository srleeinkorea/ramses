import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AgentConfigPanel from './components/AgentConfigPanel';
import CreateAgentModal from './components/CreateAgentModal';
import PatientContext from './components/PatientContext';
import KnowledgeBasePanel from './components/KnowledgeBasePanel';
import { INITIAL_AGENTS, AGENT_TYPE_DETAILS, INITIAL_KNOWLEDGE_SOURCES } from './constants';
import { Agent, AgentConfig, AgentTemplate, AgentType, KnowledgeSource } from './types';

const TEMPLATES_STORAGE_KEY = 'ai_agent_templates';

const App: React.FC = () => {
  const [agents, setAgents] = useState<Agent<any>[]>(INITIAL_AGENTS);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(INITIAL_AGENTS.length > 0 ? INITIAL_AGENTS[0].id : 'knowledge-base');
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(INITIAL_KNOWLEDGE_SOURCES);

  useEffect(() => {
    try {
      const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (storedTemplates) {
        setTemplates(JSON.parse(storedTemplates));
      }
    } catch (error) {
      console.error("Failed to load templates from localStorage", error);
    }
  }, []);

  const handleSelectItem = useCallback((id: string) => {
    setSelectedItemId(id);
  }, []);
  
  // Fix: Added `setAgents` to the dependency array for useCallback.
  const handleConfigChange = useCallback((agentId: string, newConfig: AgentConfig, newEnabledState?: boolean) => {
    setAgents(prevAgents =>
      prevAgents.map(agent => {
        if (agent.id === agentId) {
          const updatedAgent = { ...agent, config: newConfig };
          if (typeof newEnabledState === 'boolean') {
            updatedAgent.enabled = newEnabledState;
          }
          return updatedAgent;
        }
        return agent;
      })
    );
  }, [setAgents]);

  // Fix: Added `setTemplates` to the dependency array for useCallback.
  const handleSaveTemplate = useCallback((name: string, agentType: AgentType, config: AgentConfig) => {
    const newTemplate: AgentTemplate = {
      id: `template-${Date.now()}`,
      name,
      agentType,
      config,
    };
    setTemplates(prevTemplates => {
      const updatedTemplates = [...prevTemplates, newTemplate];
      try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedTemplates));
      } catch (error) {
        console.error("Failed to save templates to localStorage", error);
      }
      return updatedTemplates;
    });
  }, [setTemplates]);

  // Fix: Added `setTemplates` to the dependency array for useCallback.
  const handleDeleteTemplate = useCallback((templateId: string) => {
    setTemplates(prevTemplates => {
      const updatedTemplates = prevTemplates.filter(t => t.id !== templateId);
       try {
        localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(updatedTemplates));
      } catch (error) {
        console.error("Failed to save templates to localStorage", error);
      }
      return updatedTemplates;
    });
  }, [setTemplates]);

  // Fix: Added state setters to the dependency array for useCallback.
  const handleCreateAgent = useCallback((name: string, description: string, type: AgentType) => {
    const details = AGENT_TYPE_DETAILS[type];
    if (!details) return;

    const newAgent: Agent<any> = {
      id: `agent-${Date.now()}`,
      name,
      description,
      type,
      category: details.category,
      icon: details.icon,
      config: details.defaultConfig,
      enabled: true,
    };

    setAgents(prev => [...prev, newAgent]);
    setSelectedItemId(newAgent.id);
    setIsCreateModalOpen(false);
  }, [setAgents, setIsCreateModalOpen]);

  // Fix: Wrapped handler in useCallback and added dependency.
  const handleUpdateKnowledgeSources = useCallback((newSources: KnowledgeSource[]) => {
    setKnowledgeSources(newSources);
  }, [setKnowledgeSources]);


  const selectedAgent = agents.find(agent => agent.id === selectedItemId);

  return (
    <>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar
          agents={agents}
          selectedItemId={selectedItemId}
          onSelectItem={handleSelectItem}
          onOpenCreateAgentModal={() => setIsCreateModalOpen(true)}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm p-4 border-b border-gray-200 space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">RAMSES</h1>
                <p className="text-sm text-gray-500">Responsive Agent Management System for Engagement Service</p>
            </div>
            <PatientContext />
          </header>
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {selectedItemId === 'knowledge-base' ? (
                <KnowledgeBasePanel 
                    knowledgeSources={knowledgeSources}
                    onUpdateKnowledgeSources={handleUpdateKnowledgeSources}
                />
            ) : selectedAgent ? (
                <AgentConfigPanel
                  key={selectedAgent.id}
                  agent={selectedAgent}
                  onConfigChange={handleConfigChange}
                  templates={templates}
                  onSaveTemplate={handleSaveTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  allKnowledgeSources={knowledgeSources}
                />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-4">설정을 시작하려면 에이전트를 선택하거나 Knowledge DB를 관리하세요.</p>
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                  >
                    + 새 에이전트 생성
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAgent={handleCreateAgent}
      />
    </>
  );
};

export default App;