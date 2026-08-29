import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // 画面を開いたときにすでにログインしているかチェック
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) localStorage.setItem('tomo_is_admin', 'true');
    });

    // ログイン状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem('tomo_is_admin', 'true');
      } else {
        localStorage.removeItem('tomo_is_admin');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ログイン処理
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert('ログインに失敗しました: ' + error.message);
    } else {
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  };

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('tomo_is_admin');
  };

  // 投稿作成処理
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('posts').insert([{ content }]);

    if (error) {
      alert('投稿に失敗しました');
    } else {
      alert('投稿しました！');
      setContent('');
    }
    setLoading(false);
  };

  // ログインしていない場合：ログイン画面
  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-lg font-bold mb-4 text-slate-800">管理者ログイン（Supabase Auth）</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-400"
            required
          />
          <input 
            type="password" 
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-400"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-800 text-white text-sm py-2 rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    );
  }

  // ログインしている場合：投稿フォーム
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">管理者投稿フォーム</h1>
          <p className="text-xs text-slate-400 mt-0.5">ログイン中: {user.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg transition"
        >
          ログアウト
        </button>
      </div>

      <form onSubmit={handlePostSubmit} className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <textarea 
          rows="5"
          placeholder="いま何してる？（リンクや改行も使えます）"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-sky-400"
        />
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-5 py-2 rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {loading ? '投稿中...' : '新しく投稿する'}
          </button>
        </div>
      </form>
    </div>
  );
}