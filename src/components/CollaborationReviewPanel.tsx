import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  Unlock,
  CornerDownRight,
  Send,
  X
} from 'lucide-react';
import { 
  UserRole, 
  ChapterReviewStatus, 
  ReviewComment, 
  BookChapter 
} from '../types/wh40k';
import { playCogitatorClick, playOmnissiahChime } from '../utils/audioEffects';

interface CollaborationReviewPanelProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  chapter: BookChapter;
  onUpdateChapterStatus: (status: ChapterReviewStatus, notes?: string) => void;
  onAddComment: (comment: Omit<ReviewComment, 'id' | 'timestamp' | 'status'>) => void;
  onResolveComment: (commentId: string) => void;
  onApplySuggestedFix: (targetSnippet: string, fixText: string, commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CollaborationReviewPanel: React.FC<CollaborationReviewPanelProps> = ({
  currentRole,
  onRoleChange,
  chapter,
  onUpdateChapterStatus,
  onAddComment,
  onResolveComment,
  onApplySuggestedFix,
  onDeleteComment,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [suggestedFix, setSuggestedFix] = useState('');
  const [targetSnippet, setTargetSnippet] = useState('');

  const status = chapter.reviewStatus || 'DRAFT';
  const comments = chapter.reviewComments || [];
  const openComments = comments.filter(c => c.status === 'open');

  const handleGrantImprimatur = () => {
    playOmnissiahChime();
    onUpdateChapterStatus('IMPRIMATUR');
  };

  const handleRequestChanges = () => {
    playCogitatorClick();
    onUpdateChapterStatus('CHANGES_REQUESTED');
  };

  const handleSubmitForReview = () => {
    playCogitatorClick();
    onUpdateChapterStatus('PENDING_REVIEW');
  };

  const handleUnlockForEditing = () => {
    playCogitatorClick();
    onUpdateChapterStatus('DRAFT');
  };

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    playCogitatorClick();
    onAddComment({
      authorRole: currentRole,
      authorName: currentRole === 'INQUISITOR' ? 'Inkwizytor Cenzor' : 'Skryba Tłumacz',
      text: commentText.trim(),
      suggestedFix: suggestedFix.trim() || undefined,
      targetSnippet: targetSnippet.trim() || undefined,
    });

    setCommentText('');
    setSuggestedFix('');
    setTargetSnippet('');
    setShowAddForm(false);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'IMPRIMATUR':
        return {
          label: 'IMPRIMATUR (PIECZĘĆ CZYSTOŚCI)',
          sub: `Autoryzowano przez ${chapter.imprimaturBy || 'Inkwizytorat'} ${chapter.imprimaturDate || ''}`,
          color: 'bg-emerald-950/80 border-emerald-600 text-emerald-300',
          icon: ShieldCheck,
        };
      case 'CHANGES_REQUESTED':
        return {
          label: 'WYMAGA POPRAWEK / ZGŁOSZONO HEREZJĘ',
          sub: 'Weryfikator naniósł uwagi do poprawy',
          color: 'bg-red-950/80 border-red-600 text-red-300',
          icon: ShieldAlert,
        };
      case 'PENDING_REVIEW':
        return {
          label: 'OCZEKUJE NA WERYFIKACJĘ',
          sub: 'Przekazane do cenzury przez tłumacza',
          color: 'bg-amber-950/80 border-amber-600 text-amber-300',
          icon: AlertTriangle,
        };
      default:
        return {
          label: 'WERSJA ROBOCZA (DRAFT)',
          sub: 'W trakcie tłumaczenia przez Skrybę',
          color: 'bg-neutral-900 border-neutral-700 text-neutral-400',
          icon: UserCheck,
        };
    }
  };

  const badge = getStatusBadge();
  const StatusIcon = badge.icon;

  return (
    <div className="border border-neutral-800 bg-neutral-950/95 rounded-lg overflow-hidden transition-all duration-200">
      
      {/* Collaboration Status Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 border-b border-neutral-800/80">
        
        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-cogitator text-neutral-400 uppercase tracking-wider">
            Aktywny Operator:
          </span>
          <div className="flex rounded border border-neutral-700 overflow-hidden bg-neutral-950 p-0.5">
            <button
              onClick={() => {
                playCogitatorClick();
                onRoleChange('SCRIBE');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-cogitator transition cursor-pointer rounded ${
                currentRole === 'SCRIBE'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/60 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>✍️</span>
              <span>1. SKRYBA (Tłumacz)</span>
            </button>

            <button
              onClick={() => {
                playCogitatorClick();
                onRoleChange('INQUISITOR');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-cogitator transition cursor-pointer rounded ${
                currentRole === 'INQUISITOR'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/60 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>⚜️</span>
              <span>2. INKWIZYTOR (Weryfikator)</span>
            </button>
          </div>
        </div>

        {/* Current Chapter Review Status Badge */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded border text-xs font-cogitator ${badge.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="font-bold">{badge.label}</span>
          </div>

          {/* Toggle Comments Drawer */}
          <button
            onClick={() => {
              playCogitatorClick();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-cogitator transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-theme-accent" />
            <span>Uwagi ({openComments.length})</span>
          </button>
        </div>

        {/* Action Buttons based on Role */}
        <div className="flex items-center gap-2">
          {currentRole === 'SCRIBE' ? (
            <>
              {status !== 'PENDING_REVIEW' && status !== 'IMPRIMATUR' && (
                <button
                  onClick={handleSubmitForReview}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-700/80 hover:bg-amber-600 border border-amber-500 text-white font-gothic text-xs font-bold transition cursor-pointer shadow"
                >
                  <Send className="w-3 h-3" />
                  <span>PRZEKAŻ DO WERYFIKACJI</span>
                </button>
              )}
            </>
          ) : (
            /* INQUISITOR ACTIONS */
            <>
              {status !== 'IMPRIMATUR' ? (
                <>
                  <button
                    onClick={handleRequestChanges}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-gothic text-xs transition cursor-pointer"
                  >
                    <ShieldAlert className="w-3 h-3 text-red-400" />
                    <span>ZGŁOŚ HEREZJĘ / POPRAWKI</span>
                  </button>

                  <button
                    onClick={handleGrantImprimatur}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-gradient-to-r from-emerald-800 to-emerald-700 hover:brightness-110 border border-emerald-500 text-white font-gothic text-xs font-bold transition cursor-pointer shadow-lg"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>NADAJ IMPRIMATUR ⚜️</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleUnlockForEditing}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 font-cogitator text-xs transition cursor-pointer"
                  title="Zdejmij pieczęć, aby umożliwić edycję tekstu"
                >
                  <Unlock className="w-3 h-3 text-amber-400" />
                  <span>ODPIECZĘTUJ DO EDYCJI</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* IMPRIMATUR Decorative Banner if Sealed */}
      {status === 'IMPRIMATUR' && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-emerald-900/40 to-neutral-950 p-3 border-b border-emerald-800/60 flex items-center justify-between text-xs font-reader text-emerald-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚜️</span>
            <div>
              <p className="font-gothic font-bold text-emerald-300 tracking-wider">
                KANONICZNY CERTYFIKAT CZYSTOŚCI DOKTRYNALNEJ — IMPRIMATUR
              </p>
              <p className="text-[11px] text-emerald-400/80">
                Tekst został zweryfikowany pod kątem zgodności z leksykonem Black Library i zatwierdzony przez drugiego tłumacza (Inkwizytora).
              </p>
            </div>
          </div>
          <span className="font-cogitator text-[10px] text-emerald-400 bg-emerald-950/90 border border-emerald-700 px-2 py-0.5 rounded">
            PIECZĘĆ NIEPOWSZEDNIA
          </span>
        </div>
      )}

      {/* Expanded Review & Comments Drawer */}
      {isExpanded && (
        <div className="p-4 bg-neutral-950/90 space-y-3 font-reader border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <h4 className="font-gothic text-sm font-bold text-neutral-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-theme-accent" />
              <span>Dziennik Weryfikacji & Uwagi Recenzenta</span>
              <span className="text-xs font-cogitator text-neutral-500">
                ({comments.length} wpisów)
              </span>
            </h4>

            {!showAddForm && (
              <button
                onClick={() => {
                  playCogitatorClick();
                  setShowAddForm(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-theme-accent font-cogitator text-xs transition cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Dodaj uwagę</span>
              </button>
            )}
          </div>

          {/* Form to add note / suggested fix */}
          {showAddForm && (
            <form onSubmit={handleCreateComment} className="p-3 rounded bg-neutral-900/90 border border-neutral-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-cogitator text-theme-accent font-bold">
                  Nowa uwaga ({currentRole === 'INQUISITOR' ? 'Inkwizytor Cenzor' : 'Skryba'})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-neutral-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-cogitator text-neutral-400 mb-1">
                  Fragment tekstu (opcjonalnie):
                </label>
                <input
                  type="text"
                  placeholder="Zacytuj fragment do poprawy..."
                  value={targetSnippet}
                  onChange={(e) => setTargetSnippet(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-theme-accent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-cogitator text-neutral-400 mb-1">
                  Treść uwagi / zarzutu terminologicznego:
                </label>
                <textarea
                  rows={2}
                  placeholder="Np. Słowo 'Dreadnought' powinno być odmienione w miejscowniku jako 'w Drednocie', a nie 'w Dreadnought'..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-theme-accent resize-none font-reader"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-cogitator text-neutral-400 mb-1">
                  Proponowana korekta (gotowy tekst do podmiany jednym kliknięciem):
                </label>
                <input
                  type="text"
                  placeholder="Np. w pancerzu czcigodnego Drednota"
                  value={suggestedFix}
                  onChange={(e) => setSuggestedFix(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-theme-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1 rounded bg-neutral-800 text-neutral-300 text-xs font-cogitator cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded bg-theme-accent/80 hover:bg-theme-accent text-white text-xs font-gothic font-bold transition cursor-pointer"
                >
                  Zapisz uwagę
                </button>
              </div>
            </form>
          )}

          {/* List of comments */}
          {comments.length === 0 ? (
            <p className="text-xs text-neutral-500 italic py-2">
              Brak zgłoszonych uwag do tego rozdziału. Obaj tłumacze zgadzają się z obecną wersją.
            </p>
          ) : (
            <div className="space-y-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded border text-xs transition ${
                    comment.status === 'resolved'
                      ? 'bg-neutral-950/40 border-neutral-800/50 opacity-60'
                      : comment.authorRole === 'INQUISITOR'
                      ? 'bg-red-950/20 border-red-900/60'
                      : 'bg-neutral-900/80 border-neutral-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-cogitator px-1.5 py-0.2 rounded border ${
                        comment.authorRole === 'INQUISITOR'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                          : 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                      }`}>
                        {comment.authorName}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-cogitator">
                        {comment.timestamp}
                      </span>
                      {comment.status === 'resolved' && (
                        <span className="text-[10px] font-cogitator text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> ROZWIĄZANE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {comment.status === 'open' && (
                        <button
                          onClick={() => onResolveComment(comment.id)}
                          className="text-[10px] font-cogitator px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
                          title="Oznacz jako uwzględnione/rozwiązane"
                        >
                          Rozwiąż
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="p-1 text-neutral-500 hover:text-red-400 transition cursor-pointer"
                        title="Usuń wpis"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {comment.targetSnippet && (
                    <div className="mt-1.5 pl-2.5 border-l-2 border-neutral-700 text-neutral-400 italic text-[11px]">
                      „{comment.targetSnippet}”
                    </div>
                  )}

                  <p className="mt-1.5 text-neutral-200 font-reader">
                    {comment.text}
                  </p>

                  {/* Suggested Fix Action */}
                  {comment.suggestedFix && comment.status === 'open' && (
                    <div className="mt-2 p-2 rounded bg-neutral-950/90 border border-theme-accent/40 flex items-center justify-between gap-2">
                      <div className="text-[11px]">
                        <span className="font-cogitator text-theme-accent mr-1">Propozycja zamiany:</span>
                        <strong className="text-white font-mono">{comment.suggestedFix}</strong>
                      </div>

                      <button
                        onClick={() => {
                          playOmnissiahChime();
                          onApplySuggestedFix(comment.targetSnippet || '', comment.suggestedFix!, comment.id);
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-gothic text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>ZASTOSUJ KOREKTĘ</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
