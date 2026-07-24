'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to Nashik Mahakumbh 2027 Portal. I am your AI Journey Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: 'Check Darshan Slots', query: 'Show me available darshan slots' },
    { label: 'Plan My Journey', query: 'Help me plan my itinerary' },
    { label: 'Nearest Snan Ghat', query: 'Which ghat has low crowd?' },
    { label: 'Emergency Help', query: 'emergency services contact' }
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('darshan') || q.includes('slot') || q.includes('shrine') || q.includes('book')) {
      return 'You can book your VIP and General Darshan slots directly on the "Smart Darshan Booking" tab. Currently, Shree Saibaba Sansthan Temple has high crowd with an estimated 180 mins wait time, while other local shrines are moderate.';
    }
    if (q.includes('journey') || q.includes('plan') || q.includes('itinerary')) {
      return 'You can generate a customized day-by-day travel plan using our "AI Journey Planner" tab. Just select your arrival city, devotees count, and target shrines to get a smart queue-optimized route map!';
    }
    if (q.includes('ghat') || q.includes('snan') || q.includes('bath') || q.includes('water')) {
      return 'You can register for a safe bathing slot on the "Smart Snan Booking" tab. Kusha Varta Ghat in Trimbakeshwar has normal water depth (3.2 ft) and safe river flow (0.8 m/s). Avoid critical crowd hours!';
    }
    if (q.includes('emergency') || q.includes('sos') || q.includes('help') || q.includes('police') || q.includes('lost') || q.includes('missing')) {
      return 'For immediate assistance, please trigger the Emergency (SOS) link in your sidebar or dial the National Helpline 112. Lost & Found biometric desks are active at Sector 4.';
    }
    if (q.includes('accommodation') || q.includes('stay') || q.includes('hotel') || q.includes('hostel') || q.includes('dharmashala')) {
      return 'Official Nashik pilgrim shelters and community halls can be booked in the "Bookings -> Accommodation" section. There are clean facilities with filter-water and CCTV security.';
    }

    if (q.includes('weather') || q.includes('temperature') || q.includes('rain')) {
      return 'Check the "Weather Forecast" tab in your sidebar. Currently, Nashik shows 28°C with light thunderstorms predicted in the evening near the Sector 4 region.';
    }
    if (q.includes('shirdi') || q.includes('sai') || q.includes('baba')) {
      return 'Shirdi Shree Saibaba Sansthan Temple is located 85km from Nashik. You can book a direct connect package via "Bookings -> Packages" with premium bus transit included!';
    }
    if (q.includes('maharashtra') || q.includes('discover') || q.includes('places') || q.includes('explore')) {
      return 'Explore all 17 national-grade spiritual, heritage, and temple sites under the "Discover Maharashtra" repository. Check wait times and access maps instantly!';
    }
    return 'I can assist you with Darshan slot bookings, Snan permits, accommodation stays, vehicle passes, custom AI itineraries, and emergency guides. Ask me anything!';
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // User Message
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulated Bot Reply
    setTimeout(() => {
      const replyText = getBotResponse(textToSend);
      const botMsg: Message = {
        sender: 'bot',
        text: replyText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-[450] w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 active:scale-95 cursor-pointer',
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-90 text-white' 
            : 'bg-[#005BAC] hover:bg-[#0F4C81] text-white'
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[450] w-[380px] h-[520px] bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex flex-col overflow-hidden animate-fadeIn text-[#374151]">
          {/* Header */}
          <div className="bg-[#F5F7FA] px-4 py-3.5 flex items-center justify-between text-[#111827] border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                <Bot size={18} className="text-[#005BAC]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1 text-[#111827]">
                  Mahakumbh AI Assistant
                  <Sparkles size={11} className="text-[#005BAC] animate-pulse" />
                </h4>
                <span className="text-[9px] text-[#005BAC] font-bold block">Online & Ready</span>
              </div>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-[#FAFBFC]">
            {messages.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={index}
                  className={cn(
                    'flex gap-2 max-w-[85%] items-start',
                    isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-[10px]',
                      isBot 
                        ? 'bg-white border-[#E5E7EB] text-[#005BAC]' 
                        : 'bg-[#005BAC] border-[#005BAC] text-white'
                    )}
                  >
                    {isBot ? <Bot size={12} /> : <User size={12} />}
                  </div>
                  <div
                    className={cn(
                      'p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm font-medium',
                      isBot
                        ? 'bg-white text-[#374151] border border-[#E5E7EB] rounded-tl-none'
                        : 'bg-[#005BAC] text-white rounded-tr-none'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 items-center text-[10px] text-[#6B7280] mr-auto">
                <Bot size={12} className="animate-bounce text-[#005BAC]" />
                <span>AI is formulating response...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 bg-white border-t border-[#E5E7EB] flex gap-1.5 overflow-x-auto shrink-0 select-none">
            {quickActions.map((act) => (
              <button
                key={act.label}
                onClick={() => handleSend(act.query)}
                className="shrink-0 px-2.5 py-1.5 rounded-full bg-white border border-[#005BAC] text-[#005BAC] hover:bg-[#F5F7FA] text-[10px] transition-colors cursor-pointer"
              >
                {act.label}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-[#E5E7EB] flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Mahakumbh..."
              className="flex-grow px-3 py-2 text-xs rounded border border-[#E5E7EB] bg-white text-[#374151] outline-none focus:border-[#005BAC]"
            />
            <button
              type="submit"
              className="p-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white rounded flex items-center justify-center transition-all cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
