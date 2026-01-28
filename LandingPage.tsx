
import React, { useState } from 'react';
import { WebinarData, Speaker, Registration } from '../types';
import { 
  Calendar, 
  Clock, 
  ArrowRight,
  X,
  CheckCircle,
  ShieldCheck,
  Settings,
  Plus
} from 'lucide-react';

interface LandingPageProps {
  data: WebinarData;
  onAdminClick: () => void;
  onRegister: (reg: Registration) => void;
}

const SpeakerCard: React.FC<{ speaker: Speaker; side: 'left' | 'right' }> = ({ speaker, side }) => {
  if (!speaker) return null;
  const nameParts = speaker.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className={`
      flex flex-col items-center justify-center animate-in fade-in duration-1000
      ${side === 'left' ? 'slide-in-from-left-10' : 'slide-in-from-right-10'}
      w-full max-w-[180px] sm:max-w-[240px] lg:max-w-[320px] xl:max-w-[380px]
    `}>
      <div className="relative w-full bg-[#0f2b46] rounded-[1.5rem] lg:rounded-[2.5rem] p-4 lg:p-6 xl:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col items-center text-center">
        <div className="w-full aspect-[4/5] rounded-[1rem] lg:rounded-[1.5rem] overflow-hidden mb-4 lg:mb-8 border border-white/10">
          <img 
            src={speaker.image} 
            alt={speaker.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-4">
          <span 
            className="px-1.5 lg:px-3 py-0.5 lg:py-1 rounded-sm text-[10px] sm:text-sm lg:text-lg xl:text-2xl font-black text-white"
            style={{ backgroundColor: speaker.badgeBg || '#f39c12' }}
          >
            {firstName}
          </span>
          <span className="text-[10px] sm:text-sm lg:text-lg xl:text-2xl font-black text-white">
            {lastName}
          </span>
        </div>
        <p className="text-white/90 text-[8px] sm:text-[9px] xl:text-[12px] leading-relaxed font-medium hidden sm:block">
          {speaker.bio || speaker.title}
        </p>
        <div 
          className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 px-2 lg:px-4 py-1 rounded-full text-[6px] lg:text-[8px] font-black tracking-widest text-white shadow-lg border border-white/20 uppercase"
          style={{ backgroundColor: speaker.badgeBg || '#f39c12' }}
        >
          {speaker.label}
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ data, onAdminClick, onRegister }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newReg: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: form['fullName'] || 'Attendee',
      title: form['title'] || 'Executive',
      email: form['email'] || '',
      phone: form['phone'] || '',
      formData: form,
      timestamp: new Date().toISOString()
    };
    onRegister(newReg);
    setIsSuccess(true);
  };

  const handleCTAClick = () => {
    if (data.ctaLink && data.ctaLink.trim() !== '') {
      window.open(data.ctaLink, '_blank', 'noopener,noreferrer');
    } else {
      setIsModalOpen(true);
    }
  };

  const addToGoogleCalendar = () => {
    const title = data.title.replace(/<[^>]*>?/gm, '');
    const details = `${data.subtitle}\n\nJoin Zoom Meeting: ${data.zoomLink}\n\nHost: ${data.speakers[0].name}\nSpecial Guest: ${data.speakers[1].name}`;
    
    const dateParts = data.date.split(',');
    const cleanDateStr = dateParts.length > 1 ? dateParts.slice(1).join(',').trim() : data.date;
    const parsedDate = new Date(cleanDateStr);
    
    const dateToUse = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    
    const yyyy = dateToUse.getFullYear();
    const mm = String(dateToUse.getMonth() + 1).padStart(2, '0');
    const dd = String(dateToUse.getDate()).padStart(2, '0');
    
    const dateStamp = `${yyyy}${mm}${dd}`;
    const dates = `${dateStamp}T180000Z/${dateStamp}T190000Z`;
    
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const url = `${baseUrl}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(data.zoomLink || '')}&dates=${dates}`;
    window.open(url, '_blank');
  };

  const host = data.speakers[0];
  const guest = data.speakers[1];

  return (
    <div className="flex flex-col h-screen w-full bg-[#fffbf5] font-['Poppins'] text-[#1a1a1a] overflow-hidden">
      {/* Header - Flowing container to prevent overlap */}
      <header className="w-full px-6 md:px-12 py-6 sm:py-8 lg:py-10 flex items-center justify-center shrink-0 relative bg-transparent z-30">
        <div className="flex items-center overflow-hidden" style={{ height: `${data.logoHeight}px` }}>
          <img src={data.logoImage} alt="Brand Logo" className="h-full w-auto object-contain" />
        </div>
        <div className="absolute right-6 md:right-12">
          <button onClick={onAdminClick} className="p-2 text-slate-300 hover:text-slate-900 transition-all opacity-40 hover:opacity-100">
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </header>

      {/* Main content - Flex column on mobile, Grid on desktop */}
      <main className="flex-1 overflow-y-auto lg:overflow-hidden px-4 sm:px-8 lg:px-12 pb-12 lg:pb-0">
        <div className="h-full w-full flex flex-col lg:grid lg:grid-cols-[1fr_1.6fr_1fr] lg:gap-4 xl:gap-8 items-center max-w-[1920px] mx-auto">
          
          {/* Order logic for Mobile */}
          
          {/* 1. Labels & Description (Mobile Order 1) */}
          <div className="order-1 lg:col-start-2 lg:row-start-1 lg:self-end flex flex-col items-center text-center space-y-4 lg:space-y-6 pt-4 lg:pt-0">
             <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-slate-400 block animate-in fade-in duration-700">
                {data.topLabel}
              </span>
              <h1 
                className="font-black leading-[1.05] tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 uppercase"
                style={{ fontSize: `clamp(28px, 4vw, ${data.titleFontSize}px)` }}
                dangerouslySetInnerHTML={{ __html: data.title }}
              />
              <p 
                className="text-slate-500 font-medium leading-relaxed max-w-[640px] animate-in fade-in slide-in-from-bottom-6 duration-1000 px-2 sm:px-4 lg:px-0"
                style={{ fontSize: `clamp(13px, 1.2vw, ${data.subtitleFontSize}px)` }}
              >
                {data.subtitle}
              </p>
          </div>

          {/* 2. Date & Time (Mobile Order 2) */}
          <div className="order-2 lg:col-start-2 lg:row-start-2 flex flex-wrap justify-center gap-3 lg:gap-4 mt-6 lg:mt-0 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-2 bg-white px-4 sm:px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-sm border border-slate-100/60">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" style={{ color: data.themeColor }} />
              <span className="text-slate-800 text-[9px] sm:text-[10px] lg:text-xs font-black whitespace-nowrap uppercase">{data.date}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 sm:px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-sm border border-slate-100/60">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" style={{ color: data.themeColor }} />
              <span className="text-slate-800 text-[9px] sm:text-[10px] lg:text-xs font-black whitespace-nowrap uppercase">{data.timeRange}</span>
            </div>
          </div>

          {/* 3. Speaker Photos (Mobile Order 3) */}
          <div className="order-3 lg:col-start-1 lg:row-start-1 lg:row-span-3 flex justify-center mt-8 lg:mt-0">
            <SpeakerCard speaker={host} side="left" />
          </div>

          <div className="order-4 lg:col-start-3 lg:row-start-1 lg:row-span-3 flex justify-center mt-6 sm:mt-8 lg:mt-0">
            <SpeakerCard speaker={guest} side="right" />
          </div>

          {/* Special logic for "side-by-side" images on small screens but not very small ones */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media (min-width: 421px) and (max-width: 1023px) {
              .order-3, .order-4 {
                display: inline-flex;
                width: auto;
                margin: 2rem 1rem 0 1rem;
              }
              .speakers-container {
                display: flex;
                flex-direction: row;
                justify-content: center;
                width: 100%;
              }
            }
            @media (max-width: 420px) {
              .order-3, .order-4 {
                width: 100%;
                margin-top: 1.5rem;
              }
            }
          `}} />

          {/* 4. Signup Button (Mobile Order 4) */}
          <div className="order-5 lg:col-start-2 lg:row-start-3 lg:self-start flex justify-center w-full mt-10 lg:mt-8 pb-4 lg:pb-0 animate-in zoom-in duration-700 delay-300">
            <button 
              onClick={handleCTAClick}
              className="group relative inline-flex items-center justify-center px-10 sm:px-14 lg:px-20 py-4 sm:py-5 font-black tracking-[0.2em] text-white uppercase transition-all duration-300 rounded-full shadow-xl hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: data.themeColor, 
                fontSize: `clamp(12px, 1vw, ${data.ctaFontSize}px)`,
                boxShadow: `0 16px 32px -8px ${data.themeColor}50`
              }}
            >
              <span className="mr-3">{data.ctaText}</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 transition-transform group-hover:translate-x-2" />
            </button>
          </div>

        </div>
      </main>

      {/* Registration Modal (Unchanged functionality) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 modal-backdrop animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-lg shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-300 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-8 md:p-14 overflow-y-auto scrollbar-hide">
              {!isSuccess ? (
                <>
                  <div className="flex items-center justify-between mb-8 md:mb-10">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">Register Now</h2>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Elite Executive Workshop Session</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-slate-900 transition-all">
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                  <form onSubmit={handleSignup} className="space-y-4">
                    {data.formFields.map((field) => (
                      <div key={field.id} className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                        <input 
                          required={field.required} 
                          type={field.type} 
                          value={form[field.id] || ''} 
                          onChange={e => setForm({...form, [field.id]: e.target.value})} 
                          placeholder={field.placeholder} 
                          className="w-full px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" 
                        />
                      </div>
                    ))}
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100/50 mt-4">
                       <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                       <p className="text-[9px] font-bold leading-relaxed text-slate-500 uppercase">
                         Enterprise-grade encryption secures your information. Your details will be processed exclusively for this executive session.
                       </p>
                    </div>
                    <button 
                      type="submit" 
                      className="w-full text-white font-black py-4 md:py-5 rounded-xl shadow-xl transition-all hover:brightness-110 active:scale-95 text-base md:text-lg tracking-[0.1em] uppercase mt-4" 
                      style={{ backgroundColor: data.themeColor, boxShadow: `0 16px 32px -8px ${data.themeColor}30` }}
                    >
                      SECURE MY SPOT
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 md:py-8">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Thank You!</h3>
                  <p className="text-slate-500 font-bold mb-4 leading-relaxed uppercase">
                    Your spot is secured for {data.date}.
                  </p>
                  <p className="text-slate-400 text-xs font-medium mb-10 leading-relaxed uppercase">
                    Please check your email for further details and session prerequisites.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3 mb-10">
                    <button 
                      onClick={addToGoogleCalendar}
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-blue-100 transition-all group"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100">
                        <Plus className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Add to Google Calendar</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => { setIsModalOpen(false); setIsSuccess(false); setForm({}); }} 
                    className="w-full bg-slate-900 text-white font-black py-4 rounded-xl transition-all hover:bg-slate-800 shadow-2xl uppercase"
                  >
                    CONTINUE
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
