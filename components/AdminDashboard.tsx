
import React, { useState, useEffect, useRef } from 'react';
import { WebinarData, Speaker, FormField } from '../types';
import { 
  Trash2, FileText, Calendar as CalendarIcon, 
  LogOut, Plus, 
  Palette, 
  ExternalLink,
  Settings,
  Upload,
  Link as LinkIcon,
  Users,
  Clock,
  Mail,
  Phone,
  Briefcase,
  Video,
  GripVertical
} from 'lucide-react';

interface AdminDashboardProps {
  webinars: WebinarData[];
  activeId: string;
  onUpdate: (updatedList: WebinarData[]) => void;
  onSelect: (id: string) => void;
  onViewLive: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  webinars, activeId, onUpdate, onSelect, onViewLive, onLogout 
}) => {
  const activeWebinar = webinars.find(w => w.id === activeId) || webinars[0];
  const [formData, setFormData] = useState<WebinarData>(activeWebinar);
  const [activeTab, setActiveTab] = useState<'content' | 'speakers' | 'attendees' | 'logistics' | 'visuals' | 'form'>('content');
  
  const logoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(activeWebinar);
  }, [activeId, activeWebinar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (!selectedDate) return;
    const dateObj = new Date(selectedDate);
    const dateWithOffset = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
    const formattedDate = dateWithOffset.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setFormData(prev => ({ ...prev, date: formattedDate }));
  };

  const handleSpeakerChange = (index: number, field: keyof Speaker, value: any) => {
    const updatedSpeakers = [...formData.speakers];
    updatedSpeakers[index] = { ...updatedSpeakers[index], [field]: value };
    setFormData(prev => ({ ...prev, speakers: updatedSpeakers }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof WebinarData | string, speakerIndex?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (speakerIndex !== undefined) {
          const updatedSpeakers = [...formData.speakers];
          updatedSpeakers[speakerIndex] = { ...updatedSpeakers[speakerIndex], image: result };
          setFormData(prev => ({ ...prev, speakers: updatedSpeakers }));
        } else {
          setFormData(prev => ({ ...prev, [fieldName]: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const newList = webinars.map(w => w.id === formData.id ? formData : w);
    onUpdate(newList);
    alert('Event configuration saved successfully.');
  };

  const handleAddEvent = () => {
    const newId = (Math.max(...webinars.map(w => parseInt(w.id)), 0) + 1).toString();
    const newEvent: WebinarData = { 
      ...activeWebinar, 
      id: newId, 
      title: 'NEW STRATEGY SESSION', 
      registrations: 0, 
      attendees: [],
      formFields: [
        { id: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Jane Cooper', required: true },
        { id: 'email', label: 'Business Email', type: 'email', placeholder: 'jane@company.com', required: true }
      ]
    };
    onUpdate([...webinars, newEvent]);
    onSelect(newId);
  };

  const handleDelete = (id: string) => {
    if (webinars.length <= 1) return alert("System requires at least one active configuration.");
    if (confirm("Destroy this configuration?")) {
      const newList = webinars.filter(w => w.id !== id);
      onUpdate(newList);
      onSelect(newList[0].id);
    }
  };

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    const updatedFields = formData.formFields.map(f => f.id === id ? { ...f, ...updates } : f);
    setFormData(prev => ({ ...prev, formFields: updatedFields }));
  };

  const removeFormField = (id: string) => {
    if (formData.formFields.length <= 1) return alert("At least one field is required for registration.");
    const updatedFields = formData.formFields.filter(f => f.id !== id);
    setFormData(prev => ({ ...prev, formFields: updatedFields }));
  };

  const addFormField = () => {
    const newField: FormField = {
      id: Math.random().toString(36).substr(2, 9),
      label: 'New Field',
      type: 'text',
      placeholder: 'Enter details...',
      required: false
    };
    setFormData(prev => ({ ...prev, formFields: [...prev.formFields, newField] }));
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden font-['Poppins']">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col p-8 shadow-sm z-30">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 bg-[#007bff] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-base font-black text-slate-900 leading-tight">Control Panel</div>
            <div className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Executive Systems</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide space-y-3 mb-8">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Webinar Instances</div>
          {webinars.map((w) => (
            <button
              key={w.id}
              onClick={() => onSelect(w.id)}
              className={`w-full group text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                w.id === activeId ? 'bg-blue-50 border-blue-100' : 'bg-transparent border-transparent hover:bg-slate-50'
              }`}
            >
              <div className="overflow-hidden pr-2">
                <div className={`text-xs font-black truncate ${w.id === activeId ? 'text-blue-700' : 'text-slate-900'}`}>
                  {w.title.replace(/<[^>]*>?/gm, '')}
                </div>
                <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Registrations: {w.attendees?.length || 0}</div>
              </div>
              {w.id !== activeId && (
                <Trash2 onClick={(e) => { e.stopPropagation(); handleDelete(w.id); }} className="w-4 h-4 text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
              )}
            </button>
          ))}
          <button onClick={handleAddEvent} className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all text-xs font-black">
            <Plus className="w-4 h-4" /> New configuration
          </button>
        </nav>

        <button onClick={onLogout} className="flex items-center gap-4 p-5 bg-slate-50 text-slate-500 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.15em] hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm">
          <LogOut className="w-4 h-4" /> Terminate Session
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
        <header className="h-20 px-10 flex items-center justify-between border-b border-slate-200 bg-white z-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-hide">
               <button onClick={() => setActiveTab('content')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'content' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Content</button>
               <button onClick={() => setActiveTab('speakers')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'speakers' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Speakers</button>
               <button onClick={() => setActiveTab('form')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'form' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Signup Form</button>
               <button onClick={() => setActiveTab('attendees')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'attendees' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Attendees</button>
               <button onClick={() => setActiveTab('logistics')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'logistics' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Logistics</button>
               <button onClick={() => setActiveTab('visuals')} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'visuals' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Visuals</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onViewLive} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-900 text-xs font-black rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <ExternalLink className="w-4 h-4 text-[#007bff]" /> Preview Site
            </button>
            <button onClick={handleSave} className="px-10 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-500/25 transition-all">
              Save Edits
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 scrollbar-hide">
          <div className="max-w-5xl mx-auto space-y-12 pb-32">
            
            {activeTab === 'form' && (
              <div className="animate-in fade-in duration-300 space-y-8">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
                  <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-black text-slate-900 text-xs tracking-widest uppercase">Registration Form Builder</h3>
                    </div>
                    <button onClick={addFormField} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">
                      <Plus className="w-3.5 h-3.5" /> Add Field
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.formFields.map((field, idx) => (
                      <div key={field.id} className="flex items-center gap-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 group">
                        <GripVertical className="w-5 h-5 text-slate-300" />
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Field Label</label>
                            <input 
                              value={field.label} 
                              onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10" 
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Type</label>
                            <select 
                              value={field.type}
                              onChange={(e) => updateFormField(field.id, { type: e.target.value as any })}
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                            >
                              <option value="text">Short Text</option>
                              <option value="email">Email Address</option>
                              <option value="tel">Phone Number</option>
                            </select>
                          </div>
                          <div className="flex items-end gap-2">
                             <div className="flex-1">
                               <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Required</label>
                               <div className="flex items-center h-10">
                                 <input 
                                   type="checkbox" 
                                   checked={field.required}
                                   onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                                   className="w-5 h-5 accent-blue-600"
                                 />
                               </div>
                             </div>
                             <button onClick={() => removeFormField(field.id)} className="p-2.5 text-slate-300 hover:text-rose-500 transition-all">
                               <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendees' && (
              <div className="animate-in fade-in duration-300">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="font-black text-slate-900 text-xs tracking-widest uppercase">Verified Registration List</h3>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-full uppercase tracking-widest">
                      {formData.attendees?.length || 0} Total Attendees
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-50">
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendee Profile</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Role</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                          <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {formData.attendees && formData.attendees.length > 0 ? (
                          formData.attendees.map((attendee) => (
                            <tr key={attendee.id} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="py-6 pr-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs uppercase">
                                    {(attendee.fullName || 'A').charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{attendee.fullName || 'N/A'}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {attendee.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-6 px-4">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="w-3.5 h-3.5 text-slate-300" />
                                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{attendee.title || 'N/A'}</span>
                                </div>
                              </td>
                              <td className="py-6 px-4 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                  <Mail className="w-3.5 h-3.5" /> {attendee.email || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                  <Phone className="w-3.5 h-3.5" /> {attendee.phone || 'N/A'}
                                </div>
                              </td>
                              <td className="py-6 pl-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-400 uppercase">
                                  <Clock className="w-3.5 h-3.5" />
                                  {new Date(attendee.timestamp).toLocaleDateString()}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-20 text-center">
                              <div className="flex flex-col items-center">
                                <Users className="w-12 h-12 text-slate-100 mb-4" />
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No attendee data available</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-slate-900 text-xs tracking-widest uppercase">Messaging Control</h3>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Top Small Label</label>
                      <input name="topLabel" value={formData.topLabel} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" />
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                      <div className="col-span-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Headline (Supports HTML)</label>
                        <input name="title" value={formData.title} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Title Size (px)</label>
                        <input type="number" name="titleFontSize" value={formData.titleFontSize} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                      <div className="col-span-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Subtitle Description</label>
                        <textarea name="subtitle" value={formData.subtitle} onChange={handleInputChange} rows={3} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black resize-none focus:bg-white transition-all outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Sub Size (px)</label>
                        <input type="number" name="subtitleFontSize" value={formData.subtitleFontSize} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'speakers' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {formData.speakers.map((speaker, sIdx) => (
                  <div key={sIdx} className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="font-black text-slate-900 text-xs tracking-widest uppercase">{speaker.label || 'Speaker'} Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Display Name</label>
                          <input value={speaker.name} onChange={(e) => handleSpeakerChange(sIdx, 'name', e.target.value.toUpperCase())} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none uppercase" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Professional Bio / Credentials</label>
                          <textarea 
                            value={speaker.bio || ''} 
                            onChange={(e) => handleSpeakerChange(sIdx, 'bio', e.target.value)} 
                            rows={4}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none resize-none" 
                            placeholder="Professional background as seen on the card layout..."
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                           <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Label</label>
                            <input value={speaker.label} onChange={(e) => handleSpeakerChange(sIdx, 'label', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Accent Color</label>
                            <input type="color" value={speaker.badgeBg} onChange={(e) => handleSpeakerChange(sIdx, 'badgeBg', e.target.value)} className="w-full h-14 rounded-2xl cursor-pointer border-0 p-0" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Text Color</label>
                            <input type="color" value={speaker.badgeColor} onChange={(e) => handleSpeakerChange(sIdx, 'badgeColor', e.target.value)} className="w-full h-14 rounded-2xl cursor-pointer border-0 p-0" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50">
                         <div className="w-40 aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-4 border-4 border-white shadow-lg relative group">
                            <img src={speaker.image} className="w-full h-full object-cover" alt="Speaker" />
                         </div>
                         <input 
                           type="file" 
                           className="hidden" 
                           id={`speaker-upload-${sIdx}`}
                           accept="image/*"
                           onChange={(e) => handleFileUpload(e, 'image', sIdx)} 
                         />
                         <button onClick={() => document.getElementById(`speaker-upload-${sIdx}`)?.click()} className="text-[10px] font-black bg-white border border-slate-200 px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm text-slate-900">
                            <Upload className="w-3.5 h-3.5" /> Change Portrait
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'logistics' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
                  <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-slate-900 text-xs tracking-widest uppercase">Scheduling & Data</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Zoom Meeting Link (Included in Calendar invites)</label>
                      <div className="relative group">
                        <Video className="w-4 h-4 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                        <input 
                          name="zoomLink"
                          value={formData.zoomLink || ''}
                          onChange={handleInputChange}
                          placeholder="https://zoom.us/j/..."
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Event Date</label>
                      <div className="relative group">
                        <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                        <input 
                          type="date" 
                          onChange={handleDateChange}
                          className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" 
                        />
                      </div>
                      <div className="mt-3 px-2">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Output:</div>
                        <div className="text-xs font-bold text-blue-600 truncate">{formData.date}</div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Time Range</label>
                      <input name="timeRange" value={formData.timeRange} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Total Capacity (Ref only)</label>
                      <input type="number" name="registrations" value={formData.registrations} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Event Type</label>
                      <input name="formatType" value={formData.formatType} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visuals' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
                   <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                    <Palette className="w-5 h-5 text-blue-600" />
                    <h3 className="font-black text-slate-900 text-xs tracking-widest uppercase">Global Branding</h3>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Enterprise Logo Configuration</label>
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-48 h-32 bg-white rounded-2xl border border-slate-200 flex items-center justify-center p-4 shadow-inner overflow-hidden">
                           <img src={formData.logoImage} className="max-w-full max-h-full object-contain" alt="Current Logo" />
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex flex-wrap gap-3">
                            <input 
                              type="file" 
                              className="hidden" 
                              ref={logoFileRef}
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'logoImage')} 
                            />
                            <button 
                              onClick={() => logoFileRef.current?.click()} 
                              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                            >
                               <Upload className="w-3.5 h-3.5" /> Upload File
                            </button>
                            <button 
                              onClick={() => {
                                const url = prompt("Enter Logo Image URL:");
                                if (url) setFormData(prev => ({ ...prev, logoImage: url }));
                              }}
                              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
                            >
                               <LinkIcon className="w-3.5 h-3.5" /> Direct URL
                            </button>
                          </div>
                          <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Logo Display Height ({formData.logoHeight}px)</label>
                            </div>
                            <input 
                              type="range" 
                              name="logoHeight" 
                              min="20" 
                              max="120" 
                              value={formData.logoHeight} 
                              onChange={handleInputChange}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Theme Accent Color</label>
                        <div className="flex items-center gap-4">
                          <input type="color" name="themeColor" value={formData.themeColor} onChange={handleInputChange} className="w-14 h-14 rounded-2xl cursor-pointer border-0 p-0 shadow-sm" />
                          <input value={formData.themeColor} onChange={handleInputChange} name="themeColor" className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-black outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">CTA Button Text</label>
                        <input name="ctaText" value={formData.ctaText} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-black focus:bg-white transition-all outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
