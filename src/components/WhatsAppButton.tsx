import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_COMMUNITY_URL } from '../data/mockData';

interface WhatsAppButtonProps {
  channelUrl?: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  channelUrl = WHATSAPP_COMMUNITY_URL,
  className = ''
}) => {
  return (
    <a
      id="whatsapp-channel-float-btn"
      href={channelUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join Our WhatsApp Channel"
      title="Join Our WhatsApp Channel"
      className={`fixed z-[9999] flex items-center justify-center rounded-full bg-[#25D366] text-white animate-heartbeat transition-transform duration-300 hover:scale-110 active:scale-95 ${className}`}
      style={{
        width: '55px',
        height: '55px',
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: '#25D366',
        borderRadius: '50%',
        boxShadow: '0 6px 20px rgba(37,211,102,0.5)',
        animation: 'heartbeat 2s infinite'
      }}
    >
      <FaWhatsapp
        size={32}
        style={{
          width: '32px',
          height: '32px',
          fill: '#ffffff',
          color: '#ffffff'
        }}
      />
    </a>
  );
};

export default WhatsAppButton;
