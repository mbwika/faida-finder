import React, { useEffect, useState } from 'react';
import api, { Topic } from '../services/api';
import TopicCard from './TopicCard';

export default function TopicList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await api.getTopics();
        if (mounted) setTopics(t || []);
      } catch (err) {
        console.error('Failed to load topics', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading topics…</div>;
  if (!topics.length) return <div>No topics available.</div>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {topics.map((t) => (
        <TopicCard key={t.id} topic={t} />
      ))}
    </div>
  );
}
