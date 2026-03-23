import { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, MessageSquare, Megaphone, Gift, Flame, Tag, Star } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProfile } from '../hooks/useProfile';
import api from '../lib/api';

const PHRASE_CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'offer', label: 'Offers', icon: Tag },
  { id: 'new', label: 'New Stock', icon: Star },
  { id: 'festival', label: 'Festival', icon: Gift },
  { id: 'urgency', label: 'Urgency', icon: Flame },
];

const READY_PHRASES = [
  // Offers
  { id: 1, cat: 'offer', text: '🔥 MEGA SALE! Flat 20% OFF on everything this weekend! Don\'t miss out — limited stock! 🛒✨', tags: ['#Sale', '#BestDeals'] },
  { id: 2, cat: 'offer', text: '💰 Buy 2, Get 1 FREE! Yes, you read that right! Hurry, offer valid till stocks last! 🎉', tags: ['#BOGO', '#ShopNow'] },
  { id: 3, cat: 'offer', text: '🎯 Special combo offer just for you! Save more when you buy more. Visit us today! 💸', tags: ['#ComboOffer', '#SaveBig'] },
  { id: 4, cat: 'offer', text: '⚡ Flash Deal! First 50 customers get extra 10% off. Rush now! 🏃‍♂️🏃‍♀️', tags: ['#FlashSale', '#LimitedOffer'] },
  // New Stock
  { id: 5, cat: 'new', text: '📦 NEW ARRIVALS just dropped! Fresh stock, latest collection — be the first to grab! ✨🛍️', tags: ['#NewArrivals', '#FreshStock'] },
  { id: 6, cat: 'new', text: '🆕 Just In! Brand new products added to our collection. Come check them out! 🔥', tags: ['#JustIn', '#NewCollection'] },
  { id: 7, cat: 'new', text: '✨ Fresh stock alert! We\'ve restocked your favorites + added exciting new items! 🎊', tags: ['#Restocked', '#NewStock'] },
  // Festival
  { id: 8, cat: 'festival', text: '🪔 Diwali Special! Celebrate with amazing deals. Up to 30% OFF on selected items! 🎆✨', tags: ['#DiwaliSale', '#FestiveOffer'] },
  { id: 9, cat: 'festival', text: '🎊 Festival Season Sale! Special prices, special gifts, special moments. Shop now! 🎁', tags: ['#FestivalSale', '#Celebration'] },
  { id: 10, cat: 'festival', text: '🌟 This festive season, give the gift of quality! Special festival hampers available now! 🎀', tags: ['#FestiveGifts', '#GiftHamper'] },
  // Urgency
  { id: 11, cat: 'urgency', text: '⏰ LAST 2 DAYS! Sale ending soon. Grab your favorites before they\'re gone! 🔴', tags: ['#LastChance', '#HurryUp'] },
  { id: 12, cat: 'urgency', text: '🚨 Almost SOLD OUT! Only a few pieces left. Don\'t wait — shop NOW! 💨', tags: ['#SoldOut', '#LimitedStock'] },
  { id: 13, cat: 'urgency', text: '⚡ Today Only! Exclusive one-day deal you won\'t find anywhere else! 🏷️', tags: ['#TodayOnly', '#ExclusiveDeal'] },
];

export default function PosterPage() {
  const { profile } = useProfile();
  const [activeCat, setActiveCat] = useState('all');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPhrase, setGeneratedPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const filtered = activeCat === 'all'
    ? READY_PHRASES
    : READY_PHRASES.filter((p) => p.cat === activeCat);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = async () => {
    if (!customPrompt.trim()) return;
    setIsLoading(true);
    setGeneratedPhrase('');
    try {
      const { data } = await api.post('/poster', { description: customPrompt.trim() });
      setGeneratedPhrase(data.poster_text);
    } catch {
      setGeneratedPhrase(
        `🔥 ${customPrompt.trim()} 🔥\n\n✅ Best Quality Guaranteed\n✅ Unbeatable Prices\n\n📍 Visit us today!\n\n#ShopLocal #BestDeals`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 px-4 pb-24 pt-6 lg:px-8 lg:pt-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Megaphone size={20} className="text-emerald-400" />
          <h1 className="text-xl font-bold">Promo Phrases</h1>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Ready-to-share marketing phrases for WhatsApp, Instagram & more
        </p>
      </div>

      {/* AI Custom Generator */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">AI Phrase Generator</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. 30% off on guitars this Diwali"
            className="input flex-1 py-2.5 text-sm"
          />
          <button
            onClick={handleGenerate}
            disabled={!customPrompt.trim() || isLoading}
            className="btn-primary flex shrink-0 items-center gap-1.5 px-4 py-2.5 text-sm"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : <Sparkles size={14} />}
            {isLoading ? '' : 'Generate'}
          </button>
        </div>

        {/* Quick ideas */}
        {!generatedPhrase && (
          <div className="flex flex-wrap gap-1.5">
            {[
              'Weekend special offer',
              'New stock announcement',
              'Festival clearance sale',
              'Customer appreciation day',
            ].map((idea) => (
              <button
                key={idea}
                onClick={() => setCustomPrompt(idea)}
                className="rounded-full bg-gray-800/80 px-2.5 py-1 text-[10px] text-gray-400 transition-colors hover:text-emerald-400"
              >
                {idea}
              </button>
            ))}
          </div>
        )}

        {/* Generated Result */}
        {generatedPhrase && (
          <div className="rounded-xl bg-gray-900 p-3 space-y-2">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {generatedPhrase}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy(generatedPhrase, 'generated')}
                className="flex items-center gap-1 rounded-lg bg-emerald-500/15 px-2.5 py-1.5 text-xs text-emerald-400"
              >
                {copiedId === 'generated' ? <Check size={12} /> : <Copy size={12} />}
                {copiedId === 'generated' ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center gap-1 rounded-lg bg-gray-800 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-200"
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                Regenerate
              </button>
              <button
                onClick={() => setGeneratedPhrase('')}
                className="rounded-lg bg-gray-800 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {PHRASE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCat === cat.id
                  ? 'bg-emerald-500 text-gray-950'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={12} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Ready Phrases */}
      <div>
        <p className="text-xs text-gray-500 mb-3">{filtered.length} phrases</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((phrase) => (
          <div key={phrase.id} className="card space-y-2.5">
            <p className="text-sm leading-relaxed">{phrase.text}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {phrase.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleCopy(phrase.text + '\n\n' + phrase.tags.join(' '), phrase.id)}
                className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                {copiedId === phrase.id ? <Check size={12} /> : <Copy size={12} />}
                {copiedId === phrase.id ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
