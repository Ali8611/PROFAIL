'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Download, QrCode } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  url: string;
  accentColor?: string;
}

export default function QrModal({
  isOpen,
  onClose,
  username,
  url,
  accentColor = '#00f0ff',
}: QrModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.getElementById('profile-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#0a0a14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const a = document.createElement('a');
        a.download = `${username}-wans-qr.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#10101c] border border-white/10 p-6 shadow-2xl text-center space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex p-2.5 rounded-2xl bg-white/5 border border-white/10 mb-2">
            <QrCode className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          <h3 className="text-base font-bold text-white tracking-wide">Share Profile QR</h3>
          <p className="text-xs text-zinc-400">Scan to visit /{username}</p>
        </div>

        {/* QR Code Container */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 inline-block mx-auto shadow-inner">
          <QRCodeSVG
            id="profile-qr-code"
            value={url}
            size={180}
            bgColor="transparent"
            fgColor="#ffffff"
            level="Q"
            includeMargin={false}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-black transition-transform hover:scale-[1.02]"
            style={{ background: accentColor }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Profile Link!' : 'Copy Profile Link'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download QR PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
