import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';
import { ExpertQuestion } from '../../types';
import {
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const AskExpertPage: React.FC = () => {
  const { currentUser, refreshUserState } = useAuth();
  const questions = storage.getState().questions;

  const [title, setTitle] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState<'crop' | 'market' | 'quality' | 'farming' | 'buying' | 'storage' | 'general'>('crop');
  const [isRecording, setIsRecording] = useState(false);
  const [imageAttached, setImageAttached] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});

  const handleVoiceRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate real-time speech-to-text
      setTimeout(() => {
        setTitle('When is the best harvesting time for Lokwan wheat to ensure maximum grain test weight?');
        setQuestionText('Our standing wheat crop is nearing maturity in western UP. Soil moisture is dropping. Should we apply one light irrigation before harvest?');
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !questionText) return;

    storage.addExpertQuestion({
      title,
      question: questionText,
      category,
    });

    setTitle('');
    setQuestionText('');
    setImageAttached(false);
    refreshUserState();
  };

  const handlePostReply = (questionId: string) => {
    const text = replyInput[questionId];
    if (!text) return;

    storage.answerExpertQuestion(questionId, text);
    setReplyInput((prev) => ({ ...prev, [questionId]: '' }));
    refreshUserState();
  };

  const filteredQuestions = activeTab === 'mine'
    ? questions.filter((q) => q.userId === currentUser.id)
    : questions;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            Agricultural Advisory Council
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
            Ask an Agricultural Specialist
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
            Get verified answers on market timings, crop health, cold storage preservation, and fair transaction benchmarks directly from ICAR-certified agronomy advisors.
          </p>
        </div>
      </div>

      {/* Submit Question Box */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Submit a Question to Expert Panel
        </h2>

        <form onSubmit={handleSubmitQuestion} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Question Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. When to release stored cold-storage potato crop?"
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                Advisory Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white font-medium"
              >
                <option value="crop">Crop Cultivation</option>
                <option value="market">Market & Mandi Price Timing</option>
                <option value="quality">Quality & Grading Test</option>
                <option value="storage">Storage & Warehousing</option>
                <option value="general">General Agri Questions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Detailed Question Context *
            </label>
            <textarea
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Describe your location, crop stage, or the price quotes you are receiving from local buyers..."
              className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVoiceRecordToggle}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'Listening (Simulated)...' : 'Voice Input (बोलकर पूछें)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setImageAttached(!imageAttached)}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  imageAttached
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{imageAttached ? '✓ Crop Photo Attached' : 'Attach Photo'}</span>
              </button>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Expert Panel</span>
            </button>
          </div>
        </form>
      </div>

      {/* Question Threads Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 dark:text-white">
            Community Agri Questions & Expert Consultations
          </h2>

          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg ${
                activeTab === 'all' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              All Inquiries ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-3 py-1 rounded-lg ${
                activeTab === 'mine' ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              My Inquiries
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {q.category}
                    </span>
                    <span className="text-xs text-stone-400">
                      Asked by <strong>{q.userName}</strong> ({q.userRole})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    {q.title}
                  </h3>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    q.status === 'answered'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {q.status === 'answered' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Answered
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" /> Pending Review
                    </>
                  )}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {q.question}
              </p>

              {/* Answers list */}
              {q.answers.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                    Verified Advisory Responses:
                  </span>
                  {q.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 dark:text-white">
                            {ans.expertName}
                          </span>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            • {ans.expertTitle}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {new Date(ans.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-stone-700 dark:text-stone-200 leading-relaxed">
                        {ans.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply field for expert or user */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput[q.id] || ''}
                  onChange={(e) =>
                    setReplyInput((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder="Post an advisory note or verification comment..."
                  className="flex-1 p-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
                <button
                  onClick={() => handlePostReply(q.id)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
