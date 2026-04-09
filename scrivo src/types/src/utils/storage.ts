import { Agent, SanctionRecord } from "../types";

export const storageUtils = {
  agent: {
    load: (): Agent => {
      try {
        const data = localStorage.getItem('forest_agent');
        return data ? JSON.parse(data) : { name: '', matricola: '', rank: '' };
      } catch {
        return { name: '', matricola: '', rank: '' };
      }
    },
    save: (agent: Agent) => {
      localStorage.setItem('forest_agent', JSON.stringify(agent));
    }
  },
  archive: {
    load: (): SanctionRecord[] => {
      try {
        const data = localStorage.getItem('forest_archive');
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    },
    save: (record: SanctionRecord) => {
      const current = storageUtils.archive.load();
      localStorage.setItem('forest_archive', JSON.stringify([record, ...current]));
    },
    delete: (id: string) => {
      const current = storageUtils.archive.load();
      const updated = current.filter(item => item.id !== id);
      localStorage.setItem('forest_archive', JSON.stringify(updated));
    }
  }
};
