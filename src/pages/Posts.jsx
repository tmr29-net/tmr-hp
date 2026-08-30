import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { renderWithLinks } from '../utils/linkify';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uiState, setUiState] = useState({});
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [targetPostId, setTargetPostId] = useState(null);

  const [replyInputs, setReplyInputs] = useState({}); 
  const [commentsMap, setCommentsMap] = useState({}); 

  // 管理者かどうか（簡易的にローカルストレージやセッションで判定）
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    // 管理者モードかどうかの確認
    setIsAdmin(localStorage.getItem('tomo_is_admin') === 'true');

    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!postsError) {
      setPosts(postsData || []);

      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      const map = {};
      commentsData?.forEach(comment => {
        if (!map[comment.post_id]) map[comment.post_id] = [];
        map[comment.post_id].push(comment);
      });
      setCommentsMap(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 「返信」ボタンを押したときの処理（初回だけポップアップ、2回目以降はそのまま開く）
  const handleOpenReplyForm = (postId) => {
    const hasAgreed = localStorage.getItem('tomo_rule_agreed');
    
    if (hasAgreed) {
      // すでに同意していればそのまま入力欄を開く
      setUiState(prev => ({
        ...prev,
        [postId]: { ...(prev[postId] || {}), showReplyForm: true }
      }));
    } else {
      // 初回ならポップアップを表示
      setTargetPostId(postId);
      setShowRuleModal(true);
    }
  };

  // ルールに同意したとき
  const agreeRuleAndOpen = () => {
    localStorage.setItem('tomo_rule_agreed', 'true'); // 同意を記憶
    setShowRuleModal(false);
    if (targetPostId) {
      setUiState(prev => ({
        ...prev,
        [targetPostId]: { ...(prev[targetPostId] || {}), showReplyForm: true }
      }));
    }
  };

  // 返信送信
  const handleReplySubmit = async (postId, e) => {
    e.preventDefault();
    const input = replyInputs[postId] || { name: '', content: '' };
    const name = input.name.trim() || '名無しさん';
    const content = input.content.trim();

    if (!content) return;
    if (content.length > 200) {
      alert('返信は200文字以内で入力してください。');
      return;
    }

    const { error } = await supabase.from('comments').insert([
      { post_id: postId, name, content }
    ]);

    if (error) {
      alert('返信の投稿に失敗しました。');
    } else {
      setReplyInputs(prev => ({ ...prev, [postId]: { name: '', content: '' } }));
      setUiState(prev => ({
        ...prev,
        [postId]: { showReplyForm: false, showComments: true }
      }));
      fetchData();
    }
  };

  // 返信の表示切り替え
  const toggleComments = (postId) => {
    setUiState(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || {}),
        showComments: !(prev[postId]?.showComments)
      }
    }));
  };

  // 【管理者用】投稿を削除する
  const handleDeletePost = async (postId) => {
    if (!window.confirm('この投稿を削除しますか？（紐づく返信も一緒に削除されます）')) return;

    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) {
      alert('削除に失敗しました');
    } else {
      fetchData();
    }
  };

  // 【管理者用】個別の返信を削除する
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('この返信を削除しますか？')) return;

    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) {
      alert('削除に失敗しました');
    } else {
      fetchData();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto relative">
      <div className="border-b border-slate-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">投稿</h1>
          <p className="text-sm text-slate-500 mt-1">とぅもろーのつぶやきスペース。気軽にコメントしてね！</p>
        </div>
        {isAdmin && (
          <span className="text-xs bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full font-medium">
            管理者モード中
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-center text-slate-400 py-10">読み込み中...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-slate-400 py-10">まだ投稿はありません。</p>
      ) : (
        posts.map(post => {
          const postComments = commentsMap[post.id] || [];
          const currentUi = uiState[post.id] || {};
          const currentInput = replyInputs[post.id] || { name: '', content: '' };
          const charCount = currentInput.content.length;

          return (
            <div key={post.id} className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 relative group">
              {/* 管理者用：投稿削除ボタン */}
              {isAdmin && (
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  className="absolute top-4 right-4 text-xs bg-red-50 text-red-500 hover:bg-red-100 px-2.5 py-1 rounded-lg transition"
                >
                  投稿を削除
                </button>
              )}

              {/* 投稿本文 */}
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed pr-20">
                {renderWithLinks(post.content)}
              </div>
              <div className="text-xs text-slate-400">
                {new Date(post.created_at).toLocaleString('ja-JP')}
              </div>

              {/* アクションボタン群 */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs">
                <button 
                  onClick={() => handleOpenReplyForm(post.id)}
                  className="text-sky-500 hover:text-sky-600 font-medium flex items-center gap-1 bg-sky-50 px-3 py-1.5 rounded-lg transition"
                >
                  返信する
                </button>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className="text-slate-500 hover:text-slate-700 font-medium transition"
                >
                  {currentUi.showComments ? '▲ 返信を隠す' : `▼ 返信を表示 (${postComments.length})`}
                </button>
              </div>

              {/* 返信入力欄 */}
              {currentUi.showReplyForm && (
                <form onSubmit={(e) => handleReplySubmit(post.id, e)} className="bg-slate-50/80 p-4 rounded-xl space-y-3 border border-slate-200/60 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600">返信を入力</span>
                    <button 
                      type="button" 
                      onClick={() => setUiState(prev => ({ ...prev, [post.id]: { ...currentUi, showReplyForm: false } }))}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕ キャンセル
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="ペンネーム (省略時は名無し)"
                    value={currentInput.name}
                    onChange={(e) => setReplyInputs({
                      ...replyInputs, 
                      [post.id]: { ...currentInput, name: e.target.value }
                    })}
                    className="w-full sm:w-1/2 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400"
                  />
                  <div className="relative">
                    <textarea 
                      rows="2"
                      placeholder="200字以内で入力..."
                      value={currentInput.content}
                      onChange={(e) => setReplyInputs({
                        ...replyInputs, 
                        [post.id]: { ...currentInput, content: e.target.value }
                      })}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-3 focus:outline-none focus:border-sky-400 resize-none"
                    />
                    <div className={`absolute bottom-2 right-2 text-[10px] ${charCount > 200 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      {charCount}/200
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition shadow-sm"
                    >
                      送信する
                    </button>
                  </div>
                </form>
              )}

              {/* 返信一覧 */}
              {currentUi.showComments && (
                <div className="space-y-3 pt-2">
                  {postComments.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">まだ返信はありません。</p>
                  ) : (
                    postComments.map(c => (
                      <div key={c.id} className="bg-slate-50/80 rounded-xl p-3 text-sm space-y-1 border border-slate-100 relative group/comment">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-700 text-xs">{c.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleString('ja-JP')}</span>
                            {isAdmin && (
                              <button 
                                onClick={() => handleDeleteComment(c.id)}
                                className="text-[10px] text-red-400 hover:text-red-600 underline ml-2"
                              >
                                削除
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 text-xs whitespace-pre-wrap">{renderWithLinks(c.content)}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* ⚠️ 初回のみ表示されるルール確認ポップアップ */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-100">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <span>⚠️</span> 初回ご利用時のルール・マナー
            </h3>
            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl leading-relaxed">
              <p>健全なスペースを維持するため、以下のルールをご確認ください（※この確認は初回のみです）。</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>誹謗中傷、荒らし行為、スパムリンクの投稿は禁止です。</li>
                <li>他人が不快に思う言葉遣いは避けましょう。</li>
                <li>文字数は <b>200文字以内</b> までとなります。</li>
              </ul>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowRuleModal(false)}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 font-medium transition"
              >
                やめる
              </button>
              <button 
                onClick={agreeRuleAndOpen}
                className="px-5 py-2 text-xs bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl shadow-sm transition"
              >
                同意して進む
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}