// frontend/app/services/api.ts

// Pega do .env ou usa localhost:3001 como padrão
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const api = {
  structures: {
    list: async () => {
      const res = await fetch(`${API_BASE}/structures`);
      return res.json();
    },
    getById: async (id: number) => {
      const res = await fetch(`${API_BASE}/structures/${id}`);
      return res.json();
    },
    create: async (data: { name: string }) => {
      await fetch(`${API_BASE}/structures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
    delete: async (id: number) => {
      await fetch(`${API_BASE}/structures/${id}`, { method: 'DELETE' });
    }
  }
};