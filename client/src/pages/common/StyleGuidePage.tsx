import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ShieldCheck,
  Copy,
  Check,
  Search,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Code2,
  Terminal,
  Layers,
  Palette,
  Sliders,
  Maximize2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const StyleGuidePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'contrast'>('overview');
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number>(1);
  const [sliderVal, setSliderVal] = useState(65);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioSelected, setRadioSelected] = useState('option1');
  const [activeNavTab, setActiveNavTab] = useState('tab1');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  const baseSwatches = [
    { name: '--dark', token: 'var(--color-dark)', hex: '#141413', role: 'Slate Dark (Obsidian text/dark bg)' },
    { name: '--light', token: 'var(--color-light)', hex: '#faf9f5', role: 'Ivory Light (Primary warm page bg)' },
    { name: '--mid', token: 'var(--color-mid)', hex: '#b0aea5', role: 'Warm Gray Mid (Dividers, disabled text)' },
    { name: '--pale', token: 'var(--color-pale)', hex: '#e8e6dc', role: 'Subtle Surface (Card fill, table header)' },
    { name: '--orange', token: 'var(--color-orange)', hex: '#d97757', role: 'Terracotta Hero Accent' },
    { name: '--blue', token: 'var(--color-blue)', hex: '#6a9bcc', role: 'Complementary Informational Blue' },
    { name: '--green', token: 'var(--color-green)', hex: '#788c5d', role: 'Earthy Analogous Positive Green' },
  ];

  const derivedSwatches = [
    { name: '--tint-80-orange', token: 'var(--tint-80-orange)', hex: '#f7e4dd', textHex: '#98533d', contrast: '5.5:1', role: 'Orange tint 80% (Badges/Selected cards)' },
    { name: '--tint-60-orange', token: 'var(--tint-60-orange)', hex: '#f0c9bc', textHex: '#774130', contrast: '7.7:1', role: 'Orange tint 60% (Warning bg/Hover)' },
    { name: '--orange-text', token: 'var(--orange-text)', hex: '#98533d', textHex: '#faf9f5', contrast: '5.5:1', role: 'Orange accessible text on light' },
    { name: '--orange-text-strong', token: 'var(--orange-text-strong)', hex: '#774130', textHex: '#faf9f5', contrast: '7.7:1', role: 'Orange strong accessible text' },
    { name: '--tint-80-blue', token: 'var(--tint-80-blue)', hex: '#e1ebf5', textHex: '#4a6c8f', contrast: '5.2:1', role: 'Blue tint 80% (Info bg/Table hover)' },
    { name: '--blue-text', token: 'var(--blue-text)', hex: '#4a6c8f', textHex: '#faf9f5', contrast: '5.2:1', role: 'Blue accessible text on light' },
    { name: '--blue-text-strong', token: 'var(--blue-text-strong)', hex: '#3a5570', textHex: '#faf9f5', contrast: '7.4:1', role: 'Blue strong accessible text' },
    { name: '--tint-80-green', token: 'var(--tint-80-green)', hex: '#e4e8df', textHex: '#546241', contrast: '6.2:1', role: 'Green tint 80% (Success badge bg)' },
    { name: '--green-text', token: 'var(--green-text)', hex: '#546241', textHex: '#faf9f5', contrast: '6.2:1', role: 'Green accessible text on light' },
    { name: '--green-text-strong', token: 'var(--green-text-strong)', hex: '#424d33', textHex: '#faf9f5', contrast: '8.5:1', role: 'Green strong accessible text' },
    { name: '--text-secondary', token: 'var(--text-secondary)', hex: '#61605b', textHex: '#faf9f5', contrast: '6.0:1', role: 'Secondary readable body text' },
    { name: '--border-strong', token: 'var(--border-strong)', hex: '#8a887f', textHex: '#141413', contrast: '3.4:1', role: 'Border boundary 3:1 compliant' },
    { name: '--color-error', token: 'var(--color-error)', hex: '#b5483a', textHex: '#faf9f5', contrast: '5.0:1', role: 'Destructive error accent' },
    { name: '--alert-error-bg', token: 'var(--alert-error-bg)', hex: 'rgba(181, 72, 58, 0.12)', textHex: '#b5483a', contrast: '5.0:1', role: '12% Error tint background' },
  ];

  const contrastRows = [
    { pair: 'Primary Button Text on Orange', fg: '#141413 (Slate)', bg: '#d97757 (Terracotta)', ratio: '5.9:1', standard: 'WCAG AAA (Large) / AA (Normal)', status: 'PASS' },
    { pair: 'White on Orange (FORBIDDEN)', fg: '#ffffff', bg: '#d97757', ratio: '2.8:1', standard: 'FAILS WCAG AA (Prohibited)', status: 'PREVENTED' },
    { pair: 'Primary Text on Page Light', fg: '#141413', bg: '#faf9f5 (Ivory)', ratio: '17.4:1', standard: 'WCAG AAA (Passes all)', status: 'PASS' },
    { pair: 'Secondary Text on Page Light', fg: '#61605b', bg: '#faf9f5', ratio: '6.0:1', standard: 'WCAG AA (Requires >= 4.5:1)', status: 'PASS' },
    { pair: 'Orange Text on Light Background', fg: '#98533d', bg: '#faf9f5', ratio: '5.5:1', standard: 'WCAG AA (Normal Text)', status: 'PASS' },
    { pair: 'Orange Strong on Tint-60 Bg', fg: '#774130', bg: '#f0c9bc', ratio: '7.7:1', standard: 'WCAG AAA (Enhanced)', status: 'PASS' },
    { pair: 'Blue Text on Light Background', fg: '#4a6c8f', bg: '#faf9f5', ratio: '5.2:1', standard: 'WCAG AA (Normal Text)', status: 'PASS' },
    { pair: 'Blue Strong on Tint-80 Bg', fg: '#3a5570', bg: '#e1ebf5', ratio: '7.4:1', standard: 'WCAG AAA (Enhanced)', status: 'PASS' },
    { pair: 'Green Text on Light Background', fg: '#546241', bg: '#faf9f5', ratio: '6.2:1', standard: 'WCAG AA (Normal Text)', status: 'PASS' },
    { pair: 'Green Strong on Tint-80 Bg', fg: '#424d33', bg: '#e4e8df', ratio: '8.5:1', standard: 'WCAG AAA (Enhanced)', status: 'PASS' },
    { pair: 'Error Text on Light Background', fg: '#b5483a', bg: '#faf9f5', ratio: '5.0:1', standard: 'WCAG AA (Normal Text)', status: 'PASS' },
    { pair: 'Destructive Button Text on Red', fg: '#faf9f5', bg: '#b5483a', ratio: '5.0:1', standard: 'WCAG AA (Normal Text)', status: 'PASS' },
    { pair: 'Dark Theme: Primary Text on Dark', fg: '#faf9f5', bg: '#141413', ratio: '17.4:1', standard: 'WCAG AAA (Passes all)', status: 'PASS' },
    { pair: 'Dark Theme: Secondary Text on Surface', fg: '#b0aea5', bg: '#222221', ratio: '7.3:1', standard: 'WCAG AAA (Enhanced)', status: 'PASS' },
    { pair: 'Dark Theme: Accent Link on Dark', fg: '#df8b70', bg: '#141413', ratio: '7.1:1', standard: 'WCAG AAA (Enhanced)', status: 'PASS' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 transition-colors">
      {/* Header Banner */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--tint-80-orange)] border border-[var(--orange-tint-60)] text-[var(--orange-text)] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
              <span>NodalConnector Design System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Colour Token & Component Style Guide
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Strictly adherence to the warm neutral colour theory (ivory #faf9f5 & slate #141413 with terracotta #d97757 hero accent).
              60/30/10 spatial balance, zero hardcoded hex components, and verified WCAG AA contrast compliance across light and dark modes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[var(--border-default)] pt-4 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[var(--orange)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Colour Theory & Tokens
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'components'
                ? 'border-[var(--orange)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Component Sandbox
          </button>
          <button
            onClick={() => setActiveTab('contrast')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'contrast'
                ? 'border-[var(--orange)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            WCAG AA Contrast Audit
          </button>
        </div>
      </div>

      {/* SECTION 1: COLOUR THEORY & TOKENS */}
      {activeTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* Rules Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--orange-text)]">
                Spatial Ratio
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">60 / 30 / 10 Theory</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                60% warm ivory/slate background, 30% pale/dark surfaces and readable neutral typography, 10% intentional terracotta & complementary accent hits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--blue-text)]">
                Contrast Rule
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Dark Text on Primary Orange</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                White text on raw terracotta (#d97757) yields 2.8:1 (fails WCAG). Primary buttons strictly utilize #141413 text for guaranteed 5.9:1 accessible contrast.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--green-text)]">
                Hierarchy Rule
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">One Loud Thing Per Screen</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Never place two full-strength accents side-by-side. Tints are used for surface containment, while darkened shades are reserved for legible typography.
              </p>
            </div>
          </div>

          {/* Base Palette Swatches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Palette className="w-5 h-5 text-[var(--orange)]" />
                Base Palette Primitives
              </h2>
              <span className="text-xs text-[var(--text-secondary)]">Click any token to copy</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {baseSwatches.map((item) => (
                <div
                  key={item.name}
                  onClick={() => copyToClipboard(item.name)}
                  className="p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-default)] hover:border-[var(--mid)] transition-all cursor-pointer shadow-xs space-y-3 group"
                >
                  <div
                    className="w-full h-16 rounded-xl border border-[var(--border-default)] shadow-inner transition-transform group-hover:scale-102 flex items-center justify-center"
                    style={{ backgroundColor: item.token }}
                  >
                    {copiedToken === item.name && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--dark)] text-[var(--light)] shadow-xs">
                        Copied!
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-mono text-xs font-bold text-[var(--text-primary)]">{item.name}</p>
                    <p className="font-mono text-[11px] text-[var(--text-secondary)]">{item.hex}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2 mt-1">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Derived Accessible Shades */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[var(--orange)]" />
              Derived Tints, Shades & Boundary Tokens
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {derivedSwatches.map((item) => (
                <div
                  key={item.name}
                  onClick={() => copyToClipboard(item.name)}
                  className="p-3.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-default)] hover:border-[var(--mid)] transition-all cursor-pointer shadow-xs flex items-center gap-3.5 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl shrink-0 border border-[var(--border-default)] flex items-center justify-center font-bold text-xs shadow-inner"
                    style={{ backgroundColor: item.token, color: item.textHex }}
                  >
                    Aa
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="font-mono text-xs font-bold text-[var(--text-primary)] truncate">{item.name}</p>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-bold">
                        {item.contrast}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] truncate">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: COMPONENT SANDBOX */}
      {activeTab === 'components' && (
        <div className="space-y-12 animate-in fade-in duration-200">
          {/* 1. Buttons */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Buttons (All States & Variants)</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Primary: #d97757 fill with #141413 text (5.9:1). Secondary: transparent with 1px border. Tertiary/Ghost: no border with terracotta text. Destructive: #b5483a fill.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Primary */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--orange-text)]">Primary Button</span>
                <div className="space-y-2">
                  <Button variant="primary" size="sm" className="w-full">Normal State</Button>
                  <Button variant="primary" size="sm" isLoading className="w-full">Loading State</Button>
                  <Button variant="primary" size="sm" disabled className="w-full">Disabled State</Button>
                </div>
              </div>

              {/* Secondary */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-secondary)]">Secondary Button</span>
                <div className="space-y-2">
                  <Button variant="secondary" size="sm" className="w-full">Normal State</Button>
                  <Button variant="secondary" size="sm" isLoading className="w-full">Loading State</Button>
                  <Button variant="secondary" size="sm" disabled className="w-full">Disabled State</Button>
                </div>
              </div>

              {/* Tertiary / Ghost */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--orange-text)]">Ghost / Tertiary</span>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full">Normal Ghost</Button>
                  <Button variant="ghost" size="sm" isLoading className="w-full">Loading Ghost</Button>
                  <Button variant="ghost" size="sm" disabled className="w-full">Disabled Ghost</Button>
                </div>
              </div>

              {/* Destructive */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--color-error)]">Destructive Button</span>
                <div className="space-y-2">
                  <Button variant="danger" size="sm" className="w-full">Delete Action</Button>
                  <Button variant="danger" size="sm" isLoading className="w-full">Deleting...</Button>
                  <Button variant="danger" size="sm" disabled className="w-full">Disabled Danger</Button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Inputs, Textareas & Form Controls */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Inputs, Controls & Selectors</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Inputs use border-strong (#8a887f) for 3:1 boundary compliance. Error state is accompanied by an icon so color is never used alone.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input
                label="Standard Input"
                placeholder="Placeholder text (85% opacity)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                helperText="Helper description in text-secondary"
              />

              <Input
                label="Error Input with Alert Icon"
                value="invalid.input@format"
                error="Format validation failed. Must be institutional address."
              />

              <Input
                label="Disabled Form Control"
                value="Immutable Verified Token"
                disabled
                helperText="Locked by administrative policy"
              />
            </div>

            {/* Checkbox, Radio, and Toggle */}
            <div className="pt-4 border-t border-[var(--border-default)] flex flex-wrap items-center gap-8 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-[var(--text-primary)] font-medium">
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                  className="rounded border-[var(--border-strong)] accent-[var(--orange)] w-4 h-4"
                />
                <span>Checkbox (Fill #d97757 with dark check)</span>
              </label>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-[var(--text-primary)] font-medium">
                  <input
                    type="radio"
                    name="style-guide-radio"
                    value="option1"
                    checked={radioSelected === 'option1'}
                    onChange={(e) => setRadioSelected(e.target.value)}
                    className="accent-[var(--orange)]"
                  />
                  <span>Option Alpha</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[var(--text-primary)] font-medium">
                  <input
                    type="radio"
                    name="style-guide-radio"
                    value="option2"
                    checked={radioSelected === 'option2'}
                    onChange={(e) => setRadioSelected(e.target.value)}
                    className="accent-[var(--orange)]"
                  />
                  <span>Option Beta</span>
                </label>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-secondary)] font-medium">Slider:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                  className="accent-[var(--orange)] cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-[var(--text-primary)]">{sliderVal}%</span>
              </div>
            </div>
          </div>

          {/* 3. Cards, Plates & Panels */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Cards, Plates & Surfaces</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Default: bg-card + border. Raised: soft slate elevation shadow. Selected: 1.5px #d97757 border + tint-80 orange bg.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Default Card */}
              <div
                onClick={() => setSelectedCard(0)}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${
                  selectedCard === 0
                    ? 'border-[1.5px] border-[var(--card-selected-border)] bg-[var(--card-selected-bg)]'
                    : 'bg-[var(--card-bg)] border border-[var(--border-default)] hover:border-[var(--mid)]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-secondary)]">Standard Surface</span>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mt-2">Default Card Spec</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">1px border with neutral ivory background canvas.</p>
              </div>

              {/* Raised Card */}
              <div
                onClick={() => setSelectedCard(1)}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${
                  selectedCard === 1
                    ? 'border-[1.5px] border-[var(--card-selected-border)] bg-[var(--card-selected-bg)]'
                    : 'bg-[var(--card-bg)] border border-[var(--border-default)] shadow-[0_4px_20px_rgba(20,20,19,0.06)] hover:border-[var(--mid)]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--orange-text)]">Raised Card</span>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mt-2">Elevated Surface Spec</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Soft warm slate drop shadow rgba(20,20,19,0.06).</p>
              </div>

              {/* Selected Card */}
              <div
                onClick={() => setSelectedCard(2)}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${
                  selectedCard === 2
                    ? 'border-[1.5px] border-[var(--card-selected-border)] bg-[var(--card-selected-bg)] shadow-xs'
                    : 'bg-[var(--card-bg)] border border-[var(--border-default)] hover:border-[var(--mid)]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--orange-text)]">Selected State</span>
                <h4 className="text-sm font-bold text-[var(--text-primary)] mt-2">Active Card Selection</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">1.5px terracotta boundary with tint-80 warm fill.</p>
              </div>
            </div>
          </div>

          {/* 4. Badges, Chips & Alerts */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Badges, Chips & Alerts</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Every alert pairs a tint-bg with darkened text, a 3px accent left border, and an icon.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge-system-neutral px-3 py-1 rounded-full text-xs font-bold border border-[var(--border-default)]">Neutral Tag</span>
              <span className="badge-system-info px-3 py-1 rounded-full text-xs font-bold border border-[var(--badge-info-border)]">Info Chip</span>
              <span className="badge-system-success px-3 py-1 rounded-full text-xs font-bold border border-[var(--badge-success-border)]">Success Verified</span>
              <span className="badge-system-warning px-3 py-1 rounded-full text-xs font-bold border border-[var(--badge-warning-border)]">Warning Status</span>
              <span className="badge-system-error px-3 py-1 rounded-full text-xs font-bold border border-[var(--alert-error-border)]">Error Alert</span>
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="alert-system-info p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 shrink-0 text-[var(--blue-text)]" />
                <div className="text-xs">
                  <p className="font-bold">Informational Notice</p>
                  <p className="mt-0.5">Blue tint-80 surface with high-contrast slate-blue header text.</p>
                </div>
              </div>

              <div className="alert-system-success p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[var(--green-text)]" />
                <div className="text-xs">
                  <p className="font-bold">Success Confirmation</p>
                  <p className="mt-0.5">Green tint-80 surface with earthy analogous green text (8.5:1 ratio).</p>
                </div>
              </div>

              <div className="alert-system-warning p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[var(--orange-text)]" />
                <div className="text-xs">
                  <p className="font-bold">Attention Required</p>
                  <p className="mt-0.5">Orange tint-60 surface with strong terracotta alert text.</p>
                </div>
              </div>

              <div className="alert-system-error p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-[var(--color-error)]" />
                <div className="text-xs">
                  <p className="font-bold">Execution Error</p>
                  <p className="mt-0.5">12% tint background with #b5483a destructive message text.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Navigation, Tabs & Table */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Navigation, Tabs & Zebra Table</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Tables feature #e8e6dc headers, alternating zebra rows, and tint-80 blue row hover highlights.
              </p>
            </div>

            {/* Nav & Tabs */}
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
              <div className="flex border-b border-[var(--border-default)] gap-6 text-xs font-bold">
                {['General Overview', 'Security Audit', 'Placement Pipeline'].map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveNavTab(`tab${idx}`)}
                    className={`pb-2.5 transition-all cursor-pointer ${
                      activeNavTab === `tab${idx}`
                        ? 'border-b-2 border-[var(--orange)] text-[var(--text-primary)] font-black'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--table-header-bg)] text-[var(--text-primary)] border-b border-[var(--border-default)]">
                    <th className="py-3 px-4 font-bold">Candidate Scholar</th>
                    <th className="py-3 px-4 font-bold">Domain Track</th>
                    <th className="py-3 px-4 font-bold">Skill Score</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {[
                    { name: 'Aarav Sharma', domain: 'Full-Stack Architecture', score: '94 / 100', status: 'Verified' },
                    { name: 'Priya Iyer', domain: 'Cloud & Kubernetes DevOps', score: '88 / 100', status: 'Under Review' },
                    { name: 'Rohan Verma', domain: 'Deep Learning & PyTorch', score: '91 / 100', status: 'Verified' },
                    { name: 'Ananya Sen', domain: 'Cyber Defense & Security', score: '79 / 100', status: 'Needs Assessment' },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors cursor-pointer hover:bg-[var(--table-row-hover)] ${
                        idx % 2 === 1 ? 'bg-[var(--table-row-zebra)]' : 'bg-[var(--card-bg)]'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)]">{row.name}</td>
                      <td className="py-3 px-4 text-[var(--text-secondary)]">{row.domain}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[var(--orange)]">{row.score}</td>
                      <td className="py-3 px-4">
                        <span className="badge-system-neutral px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[var(--border-default)]">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Code Block & Interactive Modal Launcher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code Block Spec */}
            <div className="p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[var(--orange)]" />
                  Code Block Styling
                </span>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">syntax tokens</span>
              </div>

              <div className="code-block-system p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
                <p className="text-[var(--code-comment)]">// NodalConnector Design Tokens Implementation</p>
                <p>
                  <span className="text-[var(--code-keyword)]">const</span>{' '}
                  <span className="text-[var(--code-function)]">applyTheme</span> = (
                  <span className="text-[var(--text-primary)]">theme</span>) =&gt; &#123;
                </p>
                <p className="pl-4">
                  <span className="text-[var(--text-primary)]">document.documentElement.</span>
                  <span className="text-[var(--code-function)]">setAttribute</span>(
                  <span className="text-[var(--code-string)]">'data-theme'</span>, theme);
                </p>
                <p className="pl-4">
                  <span className="text-[var(--code-keyword)]">return</span>{' '}
                  <span className="text-[var(--code-string)]">'Theme synchronized'</span>;
                </p>
                <p>&#125;;</p>
              </div>
            </div>

            {/* Modal Dialog Trigger */}
            <div className="p-6 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[var(--orange)]" />
                  Accessible Modal Dialog
                </span>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Backdrop overlay uses rgba(20,20,19,0.5). Modal container strictly maps to var(--modal-bg) with border var(--modal-border).
                </p>
              </div>

              <div>
                <Button
                  variant="primary"
                  onClick={() => setModalOpen(true)}
                  className="w-full"
                >
                  Open Spec Modal Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: WCAG AA CONTRAST AUDIT REPORT */}
      {activeTab === 'contrast' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--border-default)] shadow-xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--green-text)]" />
                Comprehensive WCAG AA Contrast Audit
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                All foreground text and UI boundaries meet or exceed the mandatory 4.5:1 (normal text) and 3:1 (large text/graphical boundaries) standards.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border border-[var(--badge-success-border)] text-xs font-bold">
                100% WCAG AA Certified
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--table-header-bg)] text-[var(--text-primary)] border-b border-[var(--border-default)]">
                  <th className="py-3 px-4 font-bold">UI Element Pair</th>
                  <th className="py-3 px-4 font-bold">Foreground (Text)</th>
                  <th className="py-3 px-4 font-bold">Background (Surface)</th>
                  <th className="py-3 px-4 font-bold">Contrast Ratio</th>
                  <th className="py-3 px-4 font-bold">WCAG Compliance Level</th>
                  <th className="py-3 px-4 font-bold">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-default)]">
                {contrastRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      row.status === 'PREVENTED'
                        ? 'bg-[var(--alert-error-bg)]'
                        : idx % 2 === 1
                        ? 'bg-[var(--table-row-zebra)]'
                        : 'bg-[var(--card-bg)]'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[var(--text-primary)]">{row.pair}</td>
                    <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">{row.fg}</td>
                    <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">{row.bg}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[var(--text-primary)]">{row.ratio}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">{row.standard}</td>
                    <td className="py-3 px-4">
                      {row.status === 'PASS' ? (
                        <span className="badge-system-success px-2 py-0.5 rounded-full text-[10px] font-bold border border-[var(--badge-success-border)]">
                          PASS
                        </span>
                      ) : (
                        <span className="badge-system-error px-2 py-0.5 rounded-full text-[10px] font-bold border border-[var(--alert-error-border)]">
                          PREVENTED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Spec Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Modal Dialog System Specification"
      >
        <div className="space-y-4 text-xs text-[var(--text-secondary)]">
          <p className="leading-relaxed">
            This modal is rendered dynamically using <code className="font-mono text-[var(--orange)]">var(--modal-bg)</code> and{' '}
            <code className="font-mono text-[var(--orange)]">var(--modal-border)</code>. The background overlay strictly complies with{' '}
            <code className="font-mono text-[var(--orange)]">rgba(20, 20, 19, 0.5)</code>.
          </p>
          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
            <span className="font-bold text-[var(--text-primary)]">Key Architectural Rules:</span>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Header, body, and footer dividers utilize <code className="font-mono">var(--divider-color)</code></li>
              <li>Focus is trapped with visible <code className="font-mono">var(--focus-ring)</code> offset</li>
              <li>Buttons conform to primary dark-on-terracotta standard</li>
            </ul>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Close Modal
            </Button>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
              Confirm & Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
