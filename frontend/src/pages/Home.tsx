import { useEffect, useState } from 'react';
import axios from 'axios';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const editor = useEditor({
    extensions: [StarterKit],
    content: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    await axios.post('/api/documents/upload', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  };

  const handleAsk = async () => {
    const res = await axios.post(
      '/api/ask',
      { question },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    setAnswer(res.data.answer);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <input type="file" onChange={handleUpload} />
      </div>
      <EditorContent editor={editor} className="border p-2" />
      <div className="flex space-x-2">
        <input
          className="border p-2 flex-1"
          placeholder="Pergunte algo..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4" onClick={handleAsk}>
          Perguntar
        </button>
      </div>
      {answer && (
        <div className="p-2 border rounded">
          <strong>Resposta:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
