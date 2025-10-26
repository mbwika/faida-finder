import React, { useState } from 'react';
import { Topic } from '../services/api';
import QuestionForm from './QuestionForm';
import AnswerDisplay from './AnswerDisplay';
import api from '../services/api';

export default function TopicCard({ topic }: { topic: Topic }) {
  const [answer, setAnswer] = useState<any | null>(null);
  const [asking, setAsking] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function onAsk(question: string) {
    setAsking(true);
    setAnswer(null);
    try {
      const res = await api.askTopic(topic.id, question);
      setAnswer(res);
    } catch (err: any) {
      setAnswer({ error: err?.message || 'Request failed' });
    } finally {
      setAsking(false);
    }
  }

  async function doRefresh() {
    setRefreshing(true);
    try {
      await api.refreshTopic(topic.id);
      // best-effort: clear answer so user knows scrape happened
      setAnswer({ info: 'Refreshed topic data' });
    } catch (err: any) {
      setAnswer({ error: err?.message || 'Refresh failed' });
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>{topic.name}</strong>
          {topic.suggestedQuestions && (
            <div style={{ marginTop: 6, color: '#555' }}>
              Suggested: {topic.suggestedQuestions.join(' · ')}
            </div>
          )}
        </div>
        <div>
          <button onClick={doRefresh} disabled={refreshing}>
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <QuestionForm onAsk={onAsk} loading={asking} />
      </div>

      <div style={{ marginTop: 12 }}>
        <AnswerDisplay answer={answer} />
      </div>
    </div>
  );
}
