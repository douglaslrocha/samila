import React, { useState } from 'react';
import { ATELIER_STEPS } from '../data/mockData';
import { AtelierStep } from '../types';
import { Hammer, Sparkles, ArrowRight } from 'lucide-react';

export const AtelierSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<AtelierStep>(ATELIER_STEPS[0]);

  return (
    <section id="atelier" className="relative w-full border-none outline-none overflow-hidden m-0 p-0 left-0 right-0">
      {/* Full-Bleed Edge-to-Edge Parent Background Container */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=2000&q=90"
          className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-artisan-working-with-clay-on-a-wheel-42284-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Soft Cream Overlay */}
        <div className="absolute inset-0 bg-[#F7F4EF]/92 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 py-24 sm:py-36 max-w-7xl mx-auto px-6 sm:px-8 text-[#3D3229]">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#7A5B43] font-medium">
            <Hammer className="w-3.5 h-3.5" />
            <span>Saber-Fazer Nobre</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#3D3229]">
            O Atelier
          </h2>
          <p className="font-sans text-xs sm:text-sm font-light text-[#3D3229]/70 tracking-widest uppercase">
            Onde os objetos ainda são inteiramente concebidos pelas mãos
          </p>
        </div>

        {/* Process Showcase Tabs & Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Step Selectors */}
          <div className="lg:col-span-5 space-y-4">
            {ATELIER_STEPS.map((step) => {
              const isSelected = activeStep.id === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step)}
                  className={`p-6 border transition-all duration-300 cursor-pointer rounded-xs ${
                    isSelected
                      ? 'bg-[#E8E0D4]/70 border-[#7A5B43] shadow-md pl-8'
                      : 'bg-white/40 border-[#BFAE9C]/25 hover:border-[#7A5B43]/40 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#7A5B43]">
                      {step.tag}
                    </span>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-[#7A5B43]" />}
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#3D3229] font-normal mb-1">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs text-[#3D3229]/70 font-light">
                    {step.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: High Resolution Display Frame */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#241E1A] shadow-2xl border border-[#BFAE9C]/30 group">
              <img
                src={activeStep.image}
                alt={activeStep.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-700 filter brightness-[0.95]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Step Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-3">
                <div className="inline-block px-3 py-1 bg-[#7A5B43]/90 text-[#F7F4EF] text-[10px] uppercase tracking-widest font-medium">
                  {activeStep.subtitle}
                </div>
                <h4 className="font-serif text-2xl sm:text-3xl text-[#F7F4EF]">
                  {activeStep.title}
                </h4>
                <p className="font-sans text-xs sm:text-sm font-light text-white/85 max-w-lg leading-relaxed">
                  {activeStep.description}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
