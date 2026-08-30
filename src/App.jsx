import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import Works from './pages/Works';
import Admin from './pages/admin';
import myIcon from './assets/icon.png';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        {/* ヘッダー全体を sticky top-0 z-50 に指定 */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* アイコンとタイトル */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <img 
                src={myIcon} 
                alt="とぅもろーのアイコン" 
                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-sm"
              />
              <h1 className="font-bold text-lg">tmr.web</h1>
            </Link>

            {/* PC用ナビゲーション */}
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link to="/" className="hover:text-sky-500 transition">ホーム</Link>
              <Link to="/posts" className="hover:text-sky-500 transition">投稿</Link>
              <Link to="/profile" className="hover:text-sky-500 transition">プロフィール</Link>
              <Link to="/works" className="hover:text-sky-500 transition">作品紹介</Link>
            </nav>

            {/* スマホ用ハンバーガーボタン */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 text-slate-700 focus:outline-none"
              aria-label="メニュー"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* スマホ用ドロワーメニュー（header内に配置することでスクロールしても追従） */}
          {isOpen && (
            <div className="md:hidden border-t border-slate-100 px-6 py-4 flex flex-col gap-4 text-sm font-medium bg-white/95 backdrop-blur-md shadow-lg">
              <Link to="/" onClick={closeMenu} className="hover:text-sky-500 transition py-1">ホーム</Link>
              <Link to="/posts" onClick={closeMenu} className="hover:text-sky-500 transition py-1">投稿</Link>
              <Link to="/profile" onClick={closeMenu} className="hover:text-sky-500 transition py-1">プロフィール</Link>
              <Link to="/works" onClick={closeMenu} className="hover:text-sky-500 transition py-1">作品紹介</Link>
            </div>
          )}
        </header>

        {/* ページ内容 */}
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