import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import Works from './pages/Works';
import Admin from './pages/admin';

function App() {
  // メニューが開いているかどうかを管理する状態
  const [isOpen, setIsOpen] = useState(false);

  // メニューをクリックしたら閉じる関数
  const closeMenu = () => setIsOpen(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        {/* ヘッダー */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h1 className="font-bold text-lg">とぅもろーのウェブ</h1>

          {/* PC用のメニュー（大きい画面のときだけ表示） */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-sky-500 transition">ホーム</Link>
            <Link to="/posts" className="hover:text-sky-500 transition">投稿</Link>
            <Link to="/profile" className="hover:text-sky-500 transition">プロフィール</Link>
            <Link to="/works" className="hover:text-sky-500 transition">作品紹介</Link>
          </nav>

          {/* スマホ用の3本線ボタン（小さい画面のときだけ表示） */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 text-slate-700 focus:outline-none"
            aria-label="メニュー"
          >
            {/* 簡易的な3本線のアイコン（SVG） */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                // バツ印のアイコン
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                // 3本線のアイコン
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {/* スマホ用メニューが開き中のポップダウン */}
        {isOpen && (
          <div className="md:hidden backdrop-blur-md bg-white/90 border-b border-slate-200 px-6 py-4 flex flex-col gap-4 text-sm font-medium shadow-lg transition-all">
            <Link to="/" onClick={closeMenu} className="hover:text-sky-500 transition py-1">ホーム</Link>
            <Link to="/posts" onClick={closeMenu} className="hover:text-sky-500 transition py-1">投稿</Link>
            <Link to="/profile" onClick={closeMenu} className="hover:text-sky-500 transition py-1">プロフィール</Link>
            <Link to="/works" onClick={closeMenu} className="hover:text-sky-500 transition py-1">作品紹介</Link>
          </div>
        )}

        {/* ページの内容を切り替えるエリア */}
        <main className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/works" element={<Works />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;