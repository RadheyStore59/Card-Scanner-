
import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import Button from './Button';

interface ContactCardProps {
  contact: Contact;
  onUpdate: (id: string, updates: Partial<Contact>) => void;
  onDelete: (id: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<Contact>({ ...contact });

  // Sync internal state if the contact prop changes while not editing
  useEffect(() => {
    if (!isEditing) {
      setEdited({ ...contact });
    }
  }, [contact, isEditing]);

  const startEditing = () => {
    setEdited({ ...contact });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEdited({ ...contact }); // Revert to original data
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(contact.id, { ...edited, isEdited: true });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-indigo-500 space-y-4 animate-in fade-in zoom-in duration-200">
        <h4 className="text-sm font-bold text-indigo-600">Edit Contact</h4>
        <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto px-1">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
            <input 
              className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={edited.name || ''}
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
              placeholder="Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
              <input 
                className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={edited.title || ''}
                onChange={(e) => setEdited({ ...edited, title: e.target.value })}
                placeholder="Title"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Company</label>
              <input 
                className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={edited.company || ''}
                onChange={(e) => setEdited({ ...edited, company: e.target.value })}
                placeholder="Company"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
            <input 
              className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
              value={edited.email || ''}
              onChange={(e) => setEdited({ ...edited, email: e.target.value })}
              placeholder="Email"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
            <input 
              className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
              value={edited.phone || ''}
              onChange={(e) => setEdited({ ...edited, phone: e.target.value })}
              placeholder="Phone"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Website</label>
            <input 
              className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
              value={edited.website || ''}
              onChange={(e) => setEdited({ ...edited, website: e.target.value })}
              placeholder="Website URL"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Address</label>
            <textarea 
              className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
              rows={2}
              value={edited.address || ''}
              onChange={(e) => setEdited({ ...edited, address: e.target.value })}
              placeholder="Address"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">LinkedIn / Social</label>
            <input 
              className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
              value={edited.linkedin || ''}
              onChange={(e) => setEdited({ ...edited, linkedin: e.target.value })}
              placeholder="LinkedIn URL"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase">Notes</label>
            <input 
              className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
              value={edited.notes || ''}
              onChange={(e) => setEdited({ ...edited, notes: e.target.value })}
              placeholder="Additional Notes"
            />
          </div>
        </div>
        <div className="flex space-x-2 pt-2">
          <Button variant="primary" size="sm" onClick={handleSave} className="flex-1">Save</Button>
          <Button variant="ghost" size="sm" onClick={cancelEditing}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-indigo-200 transition-all relative group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{contact.name || 'Unnamed Contact'}</h3>
          <p className="text-sm text-indigo-600 font-medium">
            {contact.title} {contact.company ? `• ${contact.company}` : ''}
          </p>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={startEditing}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(contact.id)}>
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </Button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-600">
        {contact.email && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <span>{contact.phone}</span>
          </div>
        )}
        {contact.website && (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
            <span className="truncate text-indigo-500 underline">{contact.website}</span>
          </div>
        )}
      </div>
      
      {contact.isEdited && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-indigo-50 text-[10px] text-indigo-600 font-bold rounded border border-indigo-100 uppercase tracking-tighter">
          Edited
        