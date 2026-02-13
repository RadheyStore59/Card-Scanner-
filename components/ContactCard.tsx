
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

  // Reset internal edit state whenever the viewing contact prop changes
  useEffect(() => {
    if (!isEditing) {
      setEdited({ ...contact });
    }
  }, [contact, isEditing]);

  const startEditing = () => {
    // Explicitly clone all properties to ensure inputs are populated
    setEdited({
      ...contact,
      name: contact.name || '',
      title: contact.title || '',
      company: contact.company || '',
      email: contact.email || '',
      phone: contact.phone || '',
      website: contact.website || '',
      address: contact.address || '',
      linkedin: contact.linkedin || '',
      notes: contact.notes || ''
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    // Restore state from the immutable prop
    setEdited({ ...contact });
    setIsEditing(false);
  };

  const handleSave = () => {
    onUpdate(contact.id, { ...edited, isEdited: true });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-xl border-2 border-indigo-500 space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Edit Contact Details</h4>
          <span className="text-[10px] text-gray-400">ID: {contact.id.slice(0, 8)}</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto px-1 pb-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
            <input 
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none form-transition"
              value={edited.name}
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
              placeholder="e.g. Radhey Sharma"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
              <input 
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 form-transition"
                value={edited.title}
                onChange={(e) => setEdited({ ...edited, title: e.target.value })}
                placeholder="CEO"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Company</label>
              <input 
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 form-transition"
                value={edited.company}
                onChange={(e) => setEdited({ ...edited, company: e.target.value })}
                placeholder="Radhey Tech"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
            <input 
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 form-transition"
              value={edited.email}
              onChange={(e) => setEdited({ ...edited, email: e.target.value })}
              placeholder="hello@radhey.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
            <input 
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 form-transition"
              value={edited.phone}
              onChange={(e) => setEdited({ ...edited, phone: e.target.value })}
              placeholder="+91 00000 00000"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Website</label>
            <input 
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 form-transition"
              value={edited.website}
              onChange={(e) => setEdited({ ...edited, website: e.target.value })}
              placeholder="https://radhey.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Physical Address</label>
            <textarea 
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 form-transition"
              rows={2}
              value={edited.address}
              onChange={(e) => setEdited({ ...edited, address: e.target.value })}
              placeholder="Office address..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">LinkedIn / Social</label>
            <input 
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 form-transition"
              value={edited.linkedin}
              onChange={(e) => setEdited({ ...edited, linkedin: e.target.value })}
              placeholder="linkedin.com/in/radhey"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Notes</label>
            <input 
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 form-transition"
              value={edited.notes}
              onChange={(e) => setEdited({ ...edited, notes: e.target.value })}
              placeholder="Additional details..."
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <Button variant="primary" size="md" onClick={handleSave} className="flex-1 py-3">Save Changes</Button>
          <Button variant="secondary" size="md" onClick={cancelEditing} className="flex-1 py-3">Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-indigo-200 transition-all relative group overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {contact.name || 'Unnamed Contact'}
          </h3>
          <p className="text-sm text-indigo-600 font-semibold mt-0.5">
            {contact.title || 'Professional'} {contact.company ? `• ${contact.company}` : ''}
          </p>
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={startEditing} className="h-8 w-8">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(contact.id)} className="h-8 w-8">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </Button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-2.5 text-sm text-gray-600">
        {contact.email && (
          <div className="flex items-center space-x-2.5">
            <div className="w-5 flex justify-center"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
            <span className="truncate font-medium">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center space-x-2.5">
            <div className="w-5 flex justify-center"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
            <span className="font-medium">{contact.phone}</span>
          </div>
        )}
        {contact.website && (
          <div className="flex items-center space-x-2.5">
            <div className="w-5 flex justify-center"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg></div>
            <span className="truncate text-indigo-500 underline decoration-indigo-200 underline-offset-2">{contact.website}</span>
          </div>
        )}
      </div>
      
      {contact.isEdited && (
        <div className="absolute top-0 right-0 pt-2 pr-2">
           <div className="bg-indigo-600 text-[8px] font-black text-white px-2 py-0.5 rounded-bl-lg rounded-tr-md uppercase tracking-[0.2em] shadow-sm">
            Manual Edit
           </div>
        </div>
      )}
    </div>
  );
};

export default ContactCard;
