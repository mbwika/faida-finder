import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3333';

export type Topic = {
  id: string;
  name: string;
  urls?: string[];
  suggestedQuestions?: string[];
};

export async function getTopics(): Promise<Topic[]> {
  const res = await axios.get(`${API_BASE}/topics`);
  return res.data;
}

export async function askTopic(id: string, question: string): Promise<any> {
  const res = await axios.post(`${API_BASE}/topics/${id}/ask`, { question });
  return res.data;
}

export async function refreshTopic(id: string): Promise<any> {
  const res = await axios.post(`${API_BASE}/topics/${id}/refresh`);
  return res.data;
}

const api = { getTopics, askTopic, refreshTopic };
export default api;
