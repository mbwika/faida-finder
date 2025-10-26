import React, { useState } from 'react';

export default function QuestionForm({
  onAsk,
  loading,
}: {
  onAsk: (question: string) => void;
  loading?: boolean;
}) {
  const [question, setQuestion] = useState('');

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question.trim()) return;
    onAsk(question.trim());
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about this topic"
        style={{ flex: 1, padding: 8 }}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Asking…' : 'Ask'}
      </button>
    </form>
  );
}
