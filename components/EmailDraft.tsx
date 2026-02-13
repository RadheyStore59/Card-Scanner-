
import React, { useState } from 'react';
import { Contact } from '../types';
import Button from './Button';

interface EmailDraftProps {
  contacts: Contact[];
  onBack: () => void;
}

const EmailDraft: React.FC<EmailDraftProps> = ({ contacts, onBack }) => {
  const [subject, setSubject] = useState("Great meeting you!");
  const [body, setBody] = useState("Hi {name},\n\nIt was a pleasure meeting you recently. I'd love to stay in touch and discuss how we might collaborate.\n\nBest regards,\n[My Name]");
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const previewEmail = contacts.length > 0 ? body.replace("{name}", contacts[0].name.split(' ')[0]) : body;

  const handleSend = () => {
    setIsSending(true);
    // Simulate bulk sending
    let sent = 0;
    const interval = setInterval(() => {
      sent++;
      setSentCount(sent);
      if (sent >= contacts.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSending(false);
          alert(`Successfully sent ${contacts.length} personalized emails!`);
          onBack();
        }, 1000);
      }
    }, 200);
  };

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto pb-24">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </Button>
        <h2 className="text-xl font-bold">Personalized Outreach</h2>
      </div>

      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">Bulk Sender</span>
            <div className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
              {contacts.length} recipients
            </div>
          </div>
          <p className="text-lg font-medium">Sending to {contacts.length} professional contacts from your scan.</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Email Subject</label>
          <input 
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Message Template</label>
          <p className="text-xs text-gray-400 mb-2">Use <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600">{`{name}`}</code> to insert the contact's first name.</p>
          <textarea 
            rows={8}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Preview (First Contact)</label>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="font-bold text-gray-900 text-sm mb-1">{subject}</p>
          <div className="h-px bg-gray-100 w-full my-2"></div>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">{previewEmail}</p>
        </div>
      </div>

      <Button 
        variant="primary" 
        className="w-full py-4 shadow-xl" 
        size="lg"
        onClick={handleSend}
        isLoading={isSending}
      >
        {isSending ? `Sending... ${sentCount}/${contacts.length}` : `Send ${contacts.length} Emails`}
      </Button>
    </div>
  );
};

export default EmailDraft;
