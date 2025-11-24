import React, { useState } from 'react';
import { generateLogoImage, generateLogoAnimation } from '../services/geminiService';
import { ImageSize, VideoAspectRatio, GeneratedImage } from '../types';
import { Button } from './Button';

export const LogoWorkspace: React.FC = () => {
  // State for Generation
  const [logoPrompt, setLogoPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState<ImageSize>(ImageSize.Size1K);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);

  // State for Animation
  const [animPrompt, setAnimPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>(VideoAspectRatio.Landscape);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLogo = async () => {
    if (!logoPrompt.trim()) return;
    setIsGeneratingImage(true);
    setError(null);
    setVideoUrl(null); // Reset video if new logo is generated

    try {
      const result = await generateLogoImage(logoPrompt, selectedSize);
      const url = `data:${result.mimeType};base64,${result.base64}`;
      setGeneratedImage({ ...result, url });
    } catch (e) {
      setError("Failed to generate logo. Please try again.");
      console.error(e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleAnimateLogo = async () => {
    if (!generatedImage) return;
    setIsGeneratingVideo(true);
    setError(null);

    try {
      const url = await generateLogoAnimation(generatedImage.base64, animPrompt, aspectRatio);
      setVideoUrl(url);
    } catch (e) {
      setError("Failed to animate logo. It might take a while or verify your quota.");
      console.error(e);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-slate-950">
      
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-1/3 p-6 overflow-y-auto border-r border-slate-800 flex flex-col gap-8 bg-slate-900/50 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">LogoMotion</h1>
          <p className="text-slate-400 text-sm">AI-Powered Brand Studio</p>
        </div>

        {/* Step 1: Design Logo */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold uppercase text-xs tracking-wider">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">1</span>
            Design Logo
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">Description</label>
            <textarea
              className="w-full bg-slate-800 border-slate-700 rounded-lg text-white p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-24 text-sm"
              placeholder="E.g. A minimalist geometric fox head logo, orange and white, vector style, flat design..."
              value={logoPrompt}
              onChange={(e) => setLogoPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">Resolution</label>
            <div className="grid grid-cols-3 gap-2">
              {[ImageSize.Size1K, ImageSize.Size2K, ImageSize.Size4K].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerateLogo} 
            isLoading={isGeneratingImage} 
            disabled={!logoPrompt.trim()}
            className="w-full"
          >
            Generate Logo
          </Button>
        </section>

        {/* Step 2: Animate (Only visible if image exists) */}
        {generatedImage && (
          <section className="space-y-4 pt-6 border-t border-slate-800 animate-in slide-in-from-left-4 fade-in duration-500">
            <div className="flex items-center gap-2 text-pink-400 font-semibold uppercase text-xs tracking-wider">
              <span className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px]">2</span>
              Animate with Veo
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Motion Style (Optional)</label>
              <input
                type="text"
                className="w-full bg-slate-800 border-slate-700 rounded-lg text-white p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
                placeholder="E.g. Spinning 3D chrome turn, glowing edges..."
                value={animPrompt}
                onChange={(e) => setAnimPrompt(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                {[VideoAspectRatio.Landscape, VideoAspectRatio.Portrait].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 px-3 rounded text-sm font-medium transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {ratio === VideoAspectRatio.Landscape ? 'Landscape (16:9)' : 'Portrait (9:16)'}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleAnimateLogo} 
              isLoading={isGeneratingVideo} 
              variant="secondary"
              className="w-full !bg-pink-600 hover:!bg-pink-500"
            >
              Generate Animation
            </Button>
          </section>
        )}

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Right Panel: Display */}
      <div className="flex-1 bg-slate-950 p-6 lg:p-12 overflow-y-auto flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="max-w-4xl w-full space-y-8 z-10">
          
          {/* Empty State */}
          {!generatedImage && !isGeneratingImage && (
            <div className="text-center text-slate-500 py-20 border-2 border-dashed border-slate-800 rounded-3xl">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg">Your canvas is empty.</p>
              <p className="text-sm">Start by describing a logo on the left.</p>
            </div>
          )}

          {/* Image Loading State */}
          {isGeneratingImage && (
            <div className="w-full aspect-square max-w-md mx-auto bg-slate-900 rounded-3xl animate-pulse flex items-center justify-center">
              <p className="text-indigo-400 font-medium">Drafting your masterpiece...</p>
            </div>
          )}

          {/* Generated Image Display */}
          {generatedImage && !isGeneratingImage && (
            <div className="w-full flex flex-col items-center">
               <div className="relative group">
                <img 
                  src={generatedImage.url} 
                  alt="Generated Logo" 
                  className="rounded-2xl shadow-2xl border border-slate-800 max-h-[50vh] object-contain bg-slate-900" 
                />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={generatedImage.url} download="logo.png" className="bg-slate-900/80 text-white p-2 rounded-full hover:bg-black backdrop-blur-md">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </a>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-xs text-slate-500 uppercase tracking-widest">
                <span>{selectedSize} Resolution</span>
                <span>•</span>
                <span>Gemini 3 Pro</span>
              </div>
            </div>
          )}

          {/* Video Section */}
          {(isGeneratingVideo || videoUrl) && (
             <div className="pt-8 border-t border-slate-800/50 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h3 className="text-xl font-semibold text-white mb-6 text-center">Animation Preview</h3>
                
                {isGeneratingVideo && (
                  <div className="w-full max-w-2xl mx-auto bg-slate-900 rounded-2xl aspect-video flex flex-col items-center justify-center border border-slate-800/50">
                    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-pink-400 font-medium animate-pulse">Rendering video with Veo...</p>
                    <p className="text-slate-500 text-xs mt-2">This may take a minute</p>
                  </div>
                )}

                {videoUrl && !isGeneratingVideo && (
                  <div className="w-full flex flex-col items-center">
                    <video 
                      controls 
                      autoPlay 
                      loop 
                      className="w-full max-w-4xl rounded-2xl shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] border border-slate-800 bg-black"
                      src={videoUrl}
                    />
                    <div className="mt-6">
                      <a 
                        href={videoUrl} 
                        download="logo-motion.mp4"
                        className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                         Download MP4
                      </a>
                    </div>
                  </div>
                )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
};