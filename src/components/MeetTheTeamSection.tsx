import React, { useState, useRef } from 'react';
import { TeamSettings, TeamMemberSettings } from '../types';
import { uploadImageToSupabase } from '../lib/supabase';
import {
  Sparkles,
  Camera,
  Type,
  Sliders,
  X,
  Upload,
  Check,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Users
} from 'lucide-react';

// ============================================================================
// ÍCONES VETORIAIS LEVES DE CROCHÊ, FIOS & BOTÂNICA
// ============================================================================

const YarnHeartIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="36" cy="38" r="22" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <path d="M18 30 C 26 24, 46 24, 54 30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M16 38 C 24 32, 48 32, 56 38" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M18 46 C 26 40, 46 40, 54 46" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M26 20 C 32 30, 32 46, 26 56" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M36 16 C 42 28, 42 48, 36 60" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M46 20 C 40 30, 40 46, 46 56" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path 
      d="M54 46 C 62 50, 68 56, 65 62 C 63 65, 59 66, 61 70 C 63 74, 69 74, 71 70 C 73 66, 69 63, 67 61 C 65 59, 74 53, 72 47 C 70 42, 64 43, 61 47 C 58 43, 52 42, 50 47 C 48 53, 57 59, 61 63" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

const CrochetHookYarnIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M72 12 L70 20 L68 76 C 68 79, 65 82, 62 82 C 59 82, 56 79, 56 76 L58 20 L56 12 C 56 9, 60 8, 62 10 C 63 11, 64 12, 66 12 C 68 12, 69 10, 71 10 C 73 10, 73 11, 72 12 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
    <path d="M58 35 C 50 30, 44 38, 48 45 C 52 52, 45 60, 38 58 C 30 55, 32 45, 25 42 C 18 40, 14 46, 18 52 C 22 58, 20 66, 26 70" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M26 70 C 24 67, 21 66, 19 68 C 17 70, 18 73, 22 76 C 26 73, 27 70, 25 68 C 23 66, 20 67, 18 70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

const CloverHeartIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 26 C 24 18, 16 20, 18 28 C 20 34, 30 38, 30 38 C 30 38, 40 34, 42 28 C 44 20, 36 18, 30 26 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 30 C 18 24, 20 16, 28 18 C 34 20, 38 30, 38 30 C 38 30, 34 40, 28 42 C 20 44, 18 36, 26 30 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M30 38 C 30 46, 26 52, 22 54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M25 45 C 22 44, 20 46, 21 49" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const BotanicalBranchIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 58 Q 32 46 56 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M30 46 C 25 40, 24 33, 29 34 C 34 35, 34 43, 30 46 Z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.3" />
    <path d="M36 41 C 41 36, 48 37, 46 42 C 44 47, 37 45, 36 41 Z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.3" />
    <path d="M42 32 C 37 26, 37 20, 42 21 C 47 22, 46 29, 42 32 Z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.3" />
    <path d="M48 26 C 53 21, 60 22, 58 27 C 56 32, 49 30, 48 26 Z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.3" />
    <path d="M56 16 C 54 9, 61 10, 62 14 C 63 18, 58 19, 56 16 Z" fill="currentColor" fillOpacity="0.22" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export interface MeetTheTeamSectionProps {
  settings?: TeamSettings;
  isEditorMode?: boolean;
  onUpdateSettings?: (newSettings: TeamSettings) => void;
}

type TeamPopoverType = 'member-0' | 'member-1' | 'member-2' | 'titles' | 'panorama' | 'section' | null;

const DEFAULT_MEMBERS: TeamMemberSettings[] = [
  {
    id: "member-1",
    name: "Yusuf O.",
    role: "Head Of Engineering",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=85",
    imageAlt: "Yusuf O. - Head Of Engineering",
    isGrayscale: false
  },
  {
    id: "member-2",
    name: "Kemal O.",
    role: "Founder & CEO",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85",
    imageAlt: "Kemal O. - Founder & CEO",
    isGrayscale: false
  },
  {
    id: "member-3",
    name: "Berkay K.",
    role: "Developer",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=85",
    imageAlt: "Berkay K. - Developer",
    isGrayscale: true
  }
];

export const MeetTheTeamSection: React.FC<MeetTheTeamSectionProps> = ({
  settings,
  isEditorMode = false,
  onUpdateSettings
}) => {
  const [activePopover, setActivePopover] = useState<TeamPopoverType>(null);
  const memberFileInputRef = useRef<HTMLInputElement>(null);
  const panoramaFileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadMemberIndex, setActiveUploadMemberIndex] = useState<number>(0);

  const isEnabled = true;
  const headline = settings?.headline ?? "EVOLUA A SUA CASA";
  const subtitle = settings?.subtitle ?? "ARTE BOTÂNICA, VELAS PURAS & CRIAÇÕES MANUAIS";
  const showCraftIcons = settings?.showCraftIcons !== false;
  const members = (settings?.members && settings.members.length === 3) ? settings.members : DEFAULT_MEMBERS;
  const panorama = settings?.panorama ?? {
    enabled: true,
    imageUrl: "/images/mansoes-luxo-panoramica.png",
    alt: "Panorama de Mansões Modernas de Luxo"
  };

  const updateSection = (partial: Partial<TeamSettings>) => {
    if (!onUpdateSettings) return;
    const current: TeamSettings = {
      headline,
      subtitle,
      showCraftIcons,
      members,
      panorama,
      ...partial,
      enabled: true
    };
    onUpdateSettings(current);
  };

  const updateMember = (index: number, updates: Partial<TeamMemberSettings>) => {
    const updated = [...members];
    updated[index] = { ...updated[index], ...updates };
    updateSection({ members: updated });
  };

  const handleMemberPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageToSupabase(file, 'team-members');
      updateMember(index, { imageUrl });
    } catch (err) {
      console.warn('Erro ao enviar imagem do integrante para o Supabase:', err);
    }
    e.target.value = '';
  };

  const handlePanoramaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImageToSupabase(file, 'panoramas');
      updateSection({
        panorama: {
          ...panorama,
          imageUrl
        }
      });
    } catch (err) {
      console.warn('Erro ao enviar panorama para o Supabase:', err);
    }
    e.target.value = '';
  };

  return (
    <section 
      id="meet-the-team"
      className="relative w-full bg-gradient-to-b from-[#FAF8F5] via-[#FAF6F0] to-[#FAF6F0] text-[#111111] overflow-hidden pt-8 pb-0 sm:pt-12 sm:pb-0 md:pt-14 md:pb-0 select-none border-none"
    >
      {/* Inputs ocultos para upload de imagens */}
      <input
        ref={memberFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleMemberPhotoUpload(e, activeUploadMemberIndex)}
      />
      <input
        ref={panoramaFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePanoramaUpload}
      />

      {/* Botão de Configurações Gerais da Seção (Modo Editor) */}
      {isEditorMode && (
        <div className="absolute top-3 right-3 sm:top-5 sm:right-6 z-30">
          <button
            onClick={() => setActivePopover(activePopover === 'section' ? null : 'section')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE6DC] hover:bg-[#E2D8CC] text-[#3D3229] text-[9px] sm:text-[10.5px] font-medium tracking-wide transition-colors cursor-pointer border border-[#BFAE9C]/50 shadow-xs"
            title="Configurações da Seção (Ícones & Elementos)"
          >
            <span className="lottie-beacon-dot">
              <span className="lottie-beacon-wave" />
              <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core" />
            </span>
            <Sliders className="w-3 h-3 text-[#7A5B43]" />
            <span>Configurar Seção</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FUNDO ARTESANAL COM ÍCONES LEVES NAS LATERAIS                             */}
      {/* ========================================================================= */}
      {showCraftIcons && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden text-[#8C735D] z-0">
          {/* Topo Esquerdo */}
          <div className="absolute left-2 sm:left-8 top-6 sm:top-10 opacity-20 transform -rotate-12">
            <YarnHeartIcon className="w-10 h-10 sm:w-14 sm:h-14" />
          </div>

          {/* Topo Direito */}
          <div className="absolute right-3 sm:right-10 top-6 sm:top-10 opacity-22 transform rotate-12">
            <BotanicalBranchIcon className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>

          {/* Lateral Esquerda Média */}
          <div className="absolute -left-1 sm:left-6 top-1/2 -translate-y-1/2 opacity-18 transform rotate-6">
            <CloverHeartIcon className="w-9 h-9 sm:w-12 sm:h-12" />
          </div>

          {/* Lateral Direita Média */}
          <div className="absolute -right-1 sm:right-6 top-1/2 -translate-y-1/2 opacity-20 transform -rotate-6">
            <CrochetHookYarnIcon className="w-11 h-11 sm:w-15 sm:h-15" />
          </div>

          {/* Suave vinheta ambiente */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#EDE4D8]/30" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONTAINER PRINCIPAL: CARDS COM TRIO DE INTEGRANTES E BALÕES FLUTUANTES    */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 flex flex-col items-center">
        
        {/* Trio com Placa Traseira e Proporções Perfeitas */}
        <div className="relative w-full max-w-lg pt-7 pb-3 sm:pt-9 sm:pb-4 flex items-center justify-center">
          
          {/* Placa Traseira Escura Central */}
          <div className="absolute w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56 bg-[#211E1B] rounded-[28px] sm:rounded-[38px] shadow-[0_18px_36px_rgba(33,30,27,0.35)] z-0 border border-[#3E3833]" />

          {/* Cards Group - Trio com sobreposição harmônica */}
          <div className="relative z-10 flex items-center justify-center -space-x-3.5 sm:-space-x-6 md:-space-x-8">
            
            {/* 1. Left Card: Yusuf O. (Head Of Engineering) */}
            <div 
              onClick={() => isEditorMode && setActivePopover(activePopover === 'member-0' ? null : 'member-0')}
              className={`relative z-10 group transition-transform duration-300 hover:scale-[1.02] hover:z-30 ${
                isEditorMode ? 'cursor-pointer' : ''
              }`}
            >
              {/* Floating Pill Badge Top-Left */}
              <div className="absolute -top-5 -left-2 sm:-top-7 sm:-left-5 z-30 bg-gradient-to-b from-[#FFFDF9] to-[#F3EDE4] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#EAE2D5] shadow-[0_5px_14px_rgba(61,50,41,0.12)] text-left leading-none transition-transform duration-300 group-hover:-translate-y-0.5">
                <span className="block text-[8px] sm:text-[10px] text-[#7A695B] font-normal tracking-tight mb-0.5 whitespace-nowrap">
                  {members[0]?.role || "Head Of Engineering"}
                </span>
                <span className="block text-[10px] sm:text-[12px] text-[#2C241E] font-semibold tracking-tight whitespace-nowrap">
                  {members[0]?.name || "Yusuf O."}
                </span>
              </div>

              {/* Beacon de Edição no Card 1 */}
              {isEditorMode && (
                <div className="absolute -top-2 -right-1 z-40">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopover(activePopover === 'member-0' ? null : 'member-0');
                    }}
                    className="lottie-beacon-dot cursor-pointer"
                    title="Editar Yusuf O. (Foto, Nome, Cargo)"
                  >
                    <span className="lottie-beacon-wave" />
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                  </button>
                </div>
              )}

              {/* Moldura da Foto */}
              <div className="w-26 h-26 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl sm:rounded-[26px] overflow-hidden bg-[#E2D8CC] border-[2.5px] sm:border-[3px] border-white shadow-[0_10px_26px_rgba(61,50,41,0.16)]">
                <img
                  src={members[0]?.imageUrl}
                  alt={members[0]?.imageAlt || members[0]?.name}
                  className={`w-full h-full object-cover object-top ${
                    members[0]?.isGrayscale ? 'grayscale contrast-110' : ''
                  }`}
                />
              </div>
            </div>

            {/* 2. Center Card: Kemal O. (Founder & CEO) - Ponto Focal */}
            <div 
              onClick={() => isEditorMode && setActivePopover(activePopover === 'member-1' ? null : 'member-1')}
              className={`relative z-20 group transition-transform duration-300 hover:scale-[1.03] ${
                isEditorMode ? 'cursor-pointer' : ''
              }`}
            >
              {/* Floating Pill Badge Top-Center */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 sm:-top-7 z-30 bg-gradient-to-b from-[#FFFDF9] to-[#F3EDE4] px-3.5 sm:px-4.5 py-1 sm:py-1.5 rounded-full border border-[#EAE2D5] shadow-[0_6px_16px_rgba(61,50,41,0.14)] text-center leading-none transition-transform duration-300 group-hover:-translate-y-0.5 whitespace-nowrap">
                <span className="block text-[8px] sm:text-[10px] text-[#7A695B] font-normal tracking-tight mb-0.5 whitespace-nowrap">
                  {members[1]?.role || "Founder & CEO"}
                </span>
                <span className="block text-[10px] sm:text-[12px] text-[#2C241E] font-semibold tracking-tight whitespace-nowrap">
                  {members[1]?.name || "Kemal O."}
                </span>
              </div>

              {/* Beacon de Edição no Card 2 */}
              {isEditorMode && (
                <div className="absolute -top-2 right-2 z-40">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopover(activePopover === 'member-1' ? null : 'member-1');
                    }}
                    className="lottie-beacon-dot cursor-pointer"
                    title="Editar Kemal O. (Foto, Nome, Cargo)"
                  >
                    <span className="lottie-beacon-wave" />
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                  </button>
                </div>
              )}

              {/* Moldura da Foto */}
              <div className="w-30 h-30 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-2xl sm:rounded-[28px] overflow-hidden bg-[#181614] border-[2.5px] sm:border-[3px] border-white shadow-[0_14px_32px_rgba(0,0,0,0.28)]">
                <img
                  src={members[1]?.imageUrl}
                  alt={members[1]?.imageAlt || members[1]?.name}
                  className={`w-full h-full object-cover object-top ${
                    members[1]?.isGrayscale ? 'grayscale contrast-110' : ''
                  }`}
                />
              </div>
            </div>

            {/* 3. Right Card: Berkay K. (Developer) */}
            <div 
              onClick={() => isEditorMode && setActivePopover(activePopover === 'member-2' ? null : 'member-2')}
              className={`relative z-10 group transition-transform duration-300 hover:scale-[1.02] hover:z-30 ${
                isEditorMode ? 'cursor-pointer' : ''
              }`}
            >
              {/* Beacon de Edição no Card 3 */}
              {isEditorMode && (
                <div className="absolute -top-2 -left-1 z-40">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePopover(activePopover === 'member-2' ? null : 'member-2');
                    }}
                    className="lottie-beacon-dot cursor-pointer"
                    title="Editar Berkay K. (Foto, Nome, Cargo)"
                  >
                    <span className="lottie-beacon-wave" />
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                  </button>
                </div>
              )}

              {/* Moldura da Foto */}
              <div className="w-26 h-26 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-2xl sm:rounded-[26px] overflow-hidden bg-[#242220] border-[2.5px] sm:border-[3px] border-white shadow-[0_10px_26px_rgba(61,50,41,0.16)]">
                <img
                  src={members[2]?.imageUrl}
                  alt={members[2]?.imageAlt || members[2]?.name}
                  className={`w-full h-full object-cover object-center ${
                    members[2]?.isGrayscale !== false ? 'grayscale contrast-110' : ''
                  }`}
                />
              </div>

              {/* Floating Pill Badge Bottom-Right */}
              <div className="absolute -bottom-4 -right-1 sm:-bottom-6 sm:-right-4 z-30 bg-gradient-to-b from-[#FFFDF9] to-[#F3EDE4] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#EAE2D5] shadow-[0_5px_14px_rgba(61,50,41,0.12)] text-left leading-none transition-transform duration-300 group-hover:translate-y-0.5 whitespace-nowrap">
                <span className="block text-[8px] sm:text-[10px] text-[#7A695B] font-normal tracking-tight mb-0.5 whitespace-nowrap">
                  {members[2]?.role || "Developer"}
                </span>
                <span className="block text-[10px] sm:text-[12px] text-[#2C241E] font-semibold tracking-tight whitespace-nowrap">
                  {members[2]?.name || "Berkay K."}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Tipografia da Seção: Título e Subtítulo Editáveis com Beacon */}
        <div className="relative text-center mt-4 sm:mt-6 group">
          <div 
            onClick={() => isEditorMode && setActivePopover(activePopover === 'titles' ? null : 'titles')}
            className={`inline-flex flex-col items-center ${isEditorMode ? 'cursor-pointer hover:opacity-90' : ''}`}
          >
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-serif text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-semibold sm:font-bold tracking-normal sm:tracking-tight text-[#1F1914] uppercase leading-tight">
                {headline}
              </h2>
              {isEditorMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePopover(activePopover === 'titles' ? null : 'titles');
                  }}
                  className="lottie-beacon-dot cursor-pointer shrink-0"
                  title="Editar Título e Subtítulo"
                >
                  <span className="lottie-beacon-wave" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core shadow-[0_0_8px_rgba(212,175,55,0.95)]" />
                </button>
              )}
            </div>

            <p className="mt-1.5 sm:mt-2.5 text-[8.5px] sm:text-[11px] md:text-xs font-semibold tracking-[0.22em] text-[#786657] uppercase">
              {subtitle}
            </p>
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* LINHA DE SEPARAÇÃO: PANORAMA DE MANSÕES DE LUXO (COLADO NAS LATERAIS)  */}
      {/* ===================================================================== */}
      {panorama.enabled && (
        <div className="relative z-10 w-full mt-4 sm:mt-6 overflow-hidden leading-none select-none group">
          <img
            src={panorama.imageUrl}
            alt={panorama.alt}
            referrerPolicy="no-referrer"
            className="w-full h-auto max-h-[190px] sm:max-h-[250px] md:max-h-[300px] object-cover object-bottom mix-blend-multiply opacity-85 sm:opacity-95 pointer-events-none select-none block"
          />

          {/* Beacon / Atalho para editar o Panorama no Modo Editor */}
          {isEditorMode && (
            <div className="absolute bottom-3 right-4 sm:bottom-5 sm:right-8 z-20">
              <button
                type="button"
                onClick={() => setActivePopover(activePopover === 'panorama' ? null : 'panorama')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 hover:bg-white text-[#3D3229] text-[9.5px] sm:text-[11px] font-medium tracking-wide shadow-md backdrop-blur-xs transition-all cursor-pointer border border-[#BFAE9C]/50"
                title="Editar Imagem Panorâmica"
              >
                <span className="lottie-beacon-dot">
                  <span className="lottie-beacon-wave" />
                  <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F5E0A3] lottie-beacon-core" />
                </span>
                <ImageIcon className="w-3 h-3 text-[#7A5B43]" />
                <span>Editar Panorama</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Se o panorama estiver desativado no modo editor, permite reativar com beacon */}
      {!panorama.enabled && isEditorMode && (
        <div className="relative z-10 w-full mt-4 py-3 bg-[#EDE6DC]/60 border-t border-[#BFAE9C]/40 text-center">
          <button
            onClick={() => setActivePopover('panorama')}
            className="inline-flex items-center gap-1.5 text-xs text-[#7A5B43] hover:text-[#2C241E] font-medium cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Imagem panorâmica inferior está oculta (Clique para configurar)</span>
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL / POPOVER DE EDIÇÃO INTERATIVA DA SEÇÃO                         */}
      {/* ===================================================================== */}
      {activePopover && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePopover(null);
          }}
        >
          <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#BFAE9C] rounded-xs shadow-2xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto text-left">
            
            {/* Botão Fechar no Topo */}
            <button
              type="button"
              onClick={() => setActivePopover(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-[#7A5B43] hover:text-[#2C231C] hover:bg-[#EDE6DC] transition-colors cursor-pointer"
              aria-label="Fechar edição"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER: MEMBRO 0 (YUSUF O. - ESQUERDA)                           */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'member-0' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Users className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      Equipe • Integrante Esquerdo
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Editar Perfil: {members[0]?.name}
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Personalize a foto, nome, cargo e estilo do integrante da esquerda.
                  </p>
                </div>

                {/* Prévia da Foto + Botão Upload */}
                <div className="flex items-center gap-4 p-3 bg-white rounded-xs border border-[#BFAE9C]/40">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#EDE6DC] shadow-xs border border-white">
                    <img
                      src={members[0]?.imageUrl}
                      alt={members[0]?.name}
                      className={`w-full h-full object-cover object-top ${
                        members[0]?.isGrayscale ? 'grayscale contrast-110' : ''
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#2C231C] block truncate">
                      {members[0]?.name}
                    </span>
                    <span className="text-[11px] text-[#7A5B43] block truncate">
                      {members[0]?.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveUploadMemberIndex(0);
                        memberFileInputRef.current?.click();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Carregar Foto do Aparelho</span>
                    </button>
                  </div>
                </div>

                {/* URL da Foto */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Ou cole o link da imagem (URL)
                  </label>
                  <input
                    type="url"
                    value={members[0]?.imageUrl || ''}
                    onChange={(e) => updateMember(0, { imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full text-xs font-mono bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Nome e Cargo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Nome do Integrante
                    </label>
                    <input
                      type="text"
                      value={members[0]?.name || ''}
                      onChange={(e) => updateMember(0, { name: e.target.value })}
                      placeholder="Ex: Yusuf O."
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Cargo ou Função
                    </label>
                    <input
                      type="text"
                      value={members[0]?.role || ''}
                      onChange={(e) => updateMember(0, { role: e.target.value })}
                      placeholder="Ex: Head Of Engineering"
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                </div>

                {/* Toggle Preto e Branco */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-[#3D3229] block">
                      Filtro Preto e Branco (Monocromático)
                    </span>
                    <span className="text-[11px] text-[#7A5B43]">
                      Aplica um elegante efeito monocromático com alto contraste na fotografia.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(members[0]?.isGrayscale)}
                    onChange={(e) => updateMember(0, { isGrayscale: e.target.checked })}
                    className="w-4 h-4 accent-[#7A5B43] rounded"
                  />
                </label>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER: MEMBRO 1 (KEMAL O. - CENTRO / FOCAL)                     */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'member-1' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      Equipe • Integrante Central (Foco)
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Editar Perfil Central: {members[1]?.name}
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Personalize o protagonista central da equipe (Founder & CEO ou Liderança).
                  </p>
                </div>

                {/* Prévia da Foto + Botão Upload */}
                <div className="flex items-center gap-4 p-3 bg-white rounded-xs border border-[#BFAE9C]/40">
                  <div className="w-18 h-18 rounded-2xl overflow-hidden shrink-0 bg-[#181614] shadow-md border-2 border-white">
                    <img
                      src={members[1]?.imageUrl}
                      alt={members[1]?.name}
                      className={`w-full h-full object-cover object-top ${
                        members[1]?.isGrayscale ? 'grayscale contrast-110' : ''
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#2C231C] block truncate">
                      {members[1]?.name}
                    </span>
                    <span className="text-[11px] text-[#7A5B43] block truncate">
                      {members[1]?.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveUploadMemberIndex(1);
                        memberFileInputRef.current?.click();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Carregar Foto do Aparelho</span>
                    </button>
                  </div>
                </div>

                {/* URL da Foto */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Ou cole o link da imagem (URL)
                  </label>
                  <input
                    type="url"
                    value={members[1]?.imageUrl || ''}
                    onChange={(e) => updateMember(1, { imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/foto-lider.jpg"
                    className="w-full text-xs font-mono bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Nome e Cargo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Nome do Integrante
                    </label>
                    <input
                      type="text"
                      value={members[1]?.name || ''}
                      onChange={(e) => updateMember(1, { name: e.target.value })}
                      placeholder="Ex: Kemal O."
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Cargo ou Função
                    </label>
                    <input
                      type="text"
                      value={members[1]?.role || ''}
                      onChange={(e) => updateMember(1, { role: e.target.value })}
                      placeholder="Ex: Founder & CEO"
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                </div>

                {/* Toggle Preto e Branco */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-[#3D3229] block">
                      Filtro Preto e Branco (Monocromático)
                    </span>
                    <span className="text-[11px] text-[#7A5B43]">
                      Aplica um elegante efeito monocromático na fotografia central.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(members[1]?.isGrayscale)}
                    onChange={(e) => updateMember(1, { isGrayscale: e.target.checked })}
                    className="w-4 h-4 accent-[#7A5B43] rounded"
                  />
                </label>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER: MEMBRO 2 (BERKAY K. - DIREITA)                           */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'member-2' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Users className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      Equipe • Integrante Direito
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Editar Perfil: {members[2]?.name}
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Personalize a foto, nome e cargo do integrante da direita.
                  </p>
                </div>

                {/* Prévia da Foto + Botão Upload */}
                <div className="flex items-center gap-4 p-3 bg-white rounded-xs border border-[#BFAE9C]/40">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#242220] shadow-xs border border-white">
                    <img
                      src={members[2]?.imageUrl}
                      alt={members[2]?.name}
                      className={`w-full h-full object-cover object-center ${
                        members[2]?.isGrayscale !== false ? 'grayscale contrast-110' : ''
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#2C231C] block truncate">
                      {members[2]?.name}
                    </span>
                    <span className="text-[11px] text-[#7A5B43] block truncate">
                      {members[2]?.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveUploadMemberIndex(2);
                        memberFileInputRef.current?.click();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Carregar Foto do Aparelho</span>
                    </button>
                  </div>
                </div>

                {/* URL da Foto */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Ou cole o link da imagem (URL)
                  </label>
                  <input
                    type="url"
                    value={members[2]?.imageUrl || ''}
                    onChange={(e) => updateMember(2, { imageUrl: e.target.value })}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="w-full text-xs font-mono bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>

                {/* Nome e Cargo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Nome do Integrante
                    </label>
                    <input
                      type="text"
                      value={members[2]?.name || ''}
                      onChange={(e) => updateMember(2, { name: e.target.value })}
                      placeholder="Ex: Berkay K."
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                      Cargo ou Função
                    </label>
                    <input
                      type="text"
                      value={members[2]?.role || ''}
                      onChange={(e) => updateMember(2, { role: e.target.value })}
                      placeholder="Ex: Developer"
                      className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                    />
                  </div>
                </div>

                {/* Toggle Preto e Branco */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-[#3D3229] block">
                      Filtro Preto e Branco (Monocromático)
                    </span>
                    <span className="text-[11px] text-[#7A5B43]">
                      Ativa o visual preto e branco com contraste artístico.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={members[2]?.isGrayscale !== false}
                    onChange={(e) => updateMember(2, { isGrayscale: e.target.checked })}
                    className="w-4 h-4 accent-[#7A5B43] rounded"
                  />
                </label>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER: TÍTULOS E SUBTÍTULOS DA SEÇÃO                            */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'titles' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Type className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      Tipografia da Seção
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Título Principal e Subtítulo
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Altere o texto principal e a frase de apresentação da seção.
                  </p>
                </div>

                {/* Título Principal */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Título Principal (Maiúsculo)
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => updateSection({ headline: e.target.value })}
                    placeholder="EVOLUA A SUA CASA"
                    className="w-full text-sm font-serif uppercase tracking-wide bg-white border border-[#BFAE9C]/60 rounded-xs p-2.5 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                  {/* Sugestões de Título */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['EVOLUA A SUA CASA', 'A ARTE DO BEM-VIVER', 'TRANSFORME SEU REFÚGIO', 'NOSSA HISTÓRIA & ALMA', 'CRIAÇÃO & SABER-FAZER'].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => updateSection({ headline: sug })}
                        className={`text-[9.5px] px-2 py-0.5 rounded-xs border transition-colors cursor-pointer ${
                          headline === sug
                            ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                            : 'bg-white text-[#5C4D41] border-[#BFAE9C]/40 hover:bg-[#EDE6DC]'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtítulo Poético */}
                <div className="space-y-1 pt-2 border-t border-[#BFAE9C]/30">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Subtítulo ou Manifesto
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => updateSection({ subtitle: e.target.value })}
                    placeholder="ARTE BOTÂNICA, VELAS PURAS & CRIAÇÕES MANUAIS"
                    className="w-full text-xs bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                  {/* Sugestões de Subtítulo */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      'ARTE BOTÂNICA, VELAS PURAS & CRIAÇÕES MANUAIS',
                      'DESIGN AUTORAL, ESSÊNCIAS NOBRES & TOQUE HUMANO',
                      'O ENCONTRO ENTRE A MATÉRIA-PRIMA E A SENSIBILIDADE',
                      'PEÇAS ÚNICAS FEITAS COM AFETO E TEMPO'
                    ].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => updateSection({ subtitle: sug })}
                        className={`text-[9px] px-2 py-0.5 rounded-xs border transition-colors cursor-pointer ${
                          subtitle === sug
                            ? 'bg-[#7A5B43] text-white border-[#7A5B43]'
                            : 'bg-white text-[#5C4D41] border-[#BFAE9C]/40 hover:bg-[#EDE6DC]'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER: PANORAMA DE MANSÕES DE LUXO                              */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'panorama' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      Base da Seção • Imagem Panorâmica
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Panorama de Mansões e Arquitetura
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Configure ou substitua a ilustração panorâmica que serve de base escultural à seção.
                  </p>
                </div>

                {/* Toggle de Visibilidade do Panorama */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-[#3D3229] block">
                      Exibir Panorama na Base
                    </span>
                    <span className="text-[11px] text-[#7A5B43]">
                      Renderiza a silhueta escultural colada às margens da página.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={panorama.enabled !== false}
                    onChange={(e) => updateSection({
                      panorama: { ...panorama, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#7A5B43] rounded"
                  />
                </label>

                {/* Prévia da Imagem Panorâmica */}
                <div className="p-3 bg-white rounded-xs border border-[#BFAE9C]/40 space-y-2">
                  <div className="w-full h-24 rounded-xs overflow-hidden bg-[#FAF6F0] border border-[#BFAE9C]/40 flex items-center justify-center">
                    <img
                      src={panorama.imageUrl}
                      alt={panorama.alt}
                      className="w-full h-full object-cover object-bottom mix-blend-multiply"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => panoramaFileInputRef.current?.click()}
                    className="w-full py-2 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Carregar Novo Panorama do Aparelho</span>
                  </button>
                </div>

                {/* URL da Imagem */}
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider font-semibold text-[#7A5B43]">
                    Ou informe o link da imagem (URL)
                  </label>
                  <input
                    type="text"
                    value={panorama.imageUrl}
                    onChange={(e) => updateSection({
                      panorama: { ...panorama, imageUrl: e.target.value }
                    })}
                    placeholder="/images/mansoes-luxo-panoramica.png"
                    className="w-full text-xs font-mono bg-white border border-[#BFAE9C]/60 rounded-xs p-2 text-[#3D3229] focus:outline-none focus:border-[#7A5B43]"
                  />
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* POPOVER: CONFIGURAÇÕES GERAIS DA SEÇÃO                            */}
            {/* ----------------------------------------------------------------- */}
            {activePopover === 'section' && (
              <div className="space-y-4">
                <div className="border-b border-[#BFAE9C]/30 pb-3">
                  <div className="flex items-center gap-2 text-[#7A5B43]">
                    <Sliders className="w-4 h-4" />
                    <span className="text-[10.5px] uppercase tracking-widest font-semibold">
                      Configurações da Seção
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-[#2C231C] font-semibold mt-0.5">
                    Elementos de Fundo & Detalhes
                  </h4>
                  <p className="text-xs text-[#7A5B43]">
                    Esta seção de saber-fazer e equipe é fixa e sempre visível na vitrine da Maison.
                  </p>
                </div>

                {/* Ícones Artesanais e Botânicos no Fundo */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xs border border-[#BFAE9C]/40 cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-[#3D3229] block">
                      Exibir Ícones de Crochê & Ramos no Fundo
                    </span>
                    <span className="text-[11px] text-[#7A5B43]">
                      Ilustrações sutis de novelos, corações e botânica nas margens.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showCraftIcons}
                    onChange={(e) => updateSection({ showCraftIcons: e.target.checked })}
                    className="w-4 h-4 accent-[#7A5B43] rounded"
                  />
                </label>
              </div>
            )}

            {/* Botão Concluir Edição */}
            <div className="pt-4 border-t border-[#BFAE9C]/30 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePopover(null)}
                className="px-4 py-2 bg-[#7A5B43] hover:bg-[#6F775C] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Pronto</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
