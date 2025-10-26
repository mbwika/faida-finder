import React from 'react';

export default function AnswerDisplay({ answer }: { answer: any | null }) {
  if (!answer) return null;

  if (typeof answer === 'string') return <div>{answer}</div>;

  if (answer.error)
    return <div style={{ color: 'crimson' }}>Error: {String(answer.error)}</div>;

  if (answer.info) return <div style={{ color: '#333' }}>{answer.info}</div>;

  // otherwise render object prettily
  return (
    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(answer, null, 2)}</pre>
  );
}
