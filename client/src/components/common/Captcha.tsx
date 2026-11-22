import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';

export interface CaptchaRef {
  validate: () => boolean;
  refresh: () => void;
  getValue: () => string;
}

interface CaptchaProps {
  onValidate?: (isValid: boolean) => void;
  className?: string;
  error?: string | null;
}

export const Captcha = forwardRef<CaptchaRef, CaptchaProps>(({ onValidate, className = '', error }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isValidated, setIsValidated] = useState<boolean | null>(null);

  const generateCaptchaText = (length = 5): string => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 160;
    const height = 44;
    canvas.width = width;
    canvas.height = height;

    const styles = getComputedStyle(canvas);
    const bgSubtle = styles.getPropertyValue('--bg-subtle').trim() || 'rgba(232, 230, 220, 1)';
    const textPrimary = styles.getPropertyValue('--text-primary').trim() || 'rgba(20, 20, 19, 1)';
    const midColor = styles.getPropertyValue('--color-mid').trim() || 'rgba(176, 174, 165, 0.4)';

    // Neutral background
    ctx.fillStyle = bgSubtle;
    ctx.fillRect(0, 0, width, height);

    // Background noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = midColor;
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Render characters
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = 20 + i * 26;
      const y = 30 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 20 - 10) * (Math.PI / 180);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.font = 'bold 22px ui-monospace, SFMono-Regular, monospace';
      ctx.fillStyle = textPrimary;
      ctx.fillText(char, 0, 0);

      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newText = generateCaptchaText();
    setCaptchaCode(newText);
    setUserInput('');
    setIsValidated(null);
    drawCaptcha(newText);
    if (onValidate) onValidate(false);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setUserInput(val);
    const valid = val.trim() === captchaCode.trim();
    setIsValidated(valid);
    if (onValidate) onValidate(valid);
  };

  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (isLocalhost) {
        setIsValidated(true);
        if (onValidate) onValidate(true);
        return true;
      }
      const valid = userInput.trim().toUpperCase() === captchaCode.trim().toUpperCase();
      setIsValidated(valid);
      return valid;
    },
    refresh: refreshCaptcha,
    getValue: () => (isLocalhost && !userInput ? captchaCode : userInput),
  }));

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" />
          Anti-Bot Verification
        </label>
        <span className="text-[10px] text-[var(--text-secondary)]">Capital letters & numbers</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Canvas box */}
        <div className="relative border border-[var(--border-default)] rounded-xl overflow-hidden bg-[var(--bg-subtle)] shadow-inner flex items-center shrink-0">
          <canvas ref={canvasRef} className="cursor-not-allowed select-none" />
          <button
            type="button"
            onClick={refreshCaptcha}
            title="Refresh CAPTCHA"
            className="absolute right-1.5 p-1 text-[var(--text-secondary)] hover:text-[var(--orange)] hover:bg-[var(--card-bg)] rounded-lg transition-colors cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Input box */}
        <div className="flex-1">
          <input
            type="text"
            required={!isLocalhost}
            maxLength={6}
            value={userInput}
            onChange={handleInputChange}
            placeholder={isLocalhost ? "DEV BYPASS (OPTIONAL)" : "ENTER CODE"}
            className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold tracking-widest text-[var(--input-text)] bg-[var(--input-bg)] placeholder:text-[var(--input-placeholder)] hover:border-[var(--input-hover-border)] focus:border-[var(--input-focus-border)] focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-[var(--focus-offset)] ${
              isValidated === true
                ? 'border-[var(--green)] bg-[var(--green-tint-80)] dark:bg-[rgba(120,140,93,0.15)]'
                : error || (isValidated === false && userInput.length >= 5)
                ? 'border-[var(--color-error)] bg-[var(--color-error-tint)]'
                : 'border-[var(--input-border)]'
            }`}
          />
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-[var(--color-error)] font-medium">{error}</p>
      )}
    </div>
  );
});

Captcha.displayName = 'Captcha';
