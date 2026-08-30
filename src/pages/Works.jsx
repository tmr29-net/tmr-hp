import { useEffect, useState } from 'react';

// ① ピックアップしたい作品（改行を含めることも可能です）
const PICKUP_PROJECT_IDS = [
  { id: '1374961866', comment: 'ともクラⅣ第10話!\n暑い夏にはやっぱり怪談!?' },
  { id: '1374682469', comment: 'え、そこの君、\nScratchでけいふぉんとを表示させたい?' },
];

export default function Works() {
  const [activeTab, setActiveTab] = useState('all');
  const [allProjects, setAllProjects] = useState([]);
  const [pickupProjects, setPickupProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const SCRATCH_USERNAME = 'tomo_piyo';
  const LIMIT = 20;

  // 作品データを取得する共通関数
  const fetchProjects = async (currentOffset) => {
    try {
      const res = await fetch(
        `https://api.scratch.mit.edu/users/${SCRATCH_USERNAME}/projects?limit=${LIMIT}&offset=${currentOffset}`
      );
      if (!res.ok) return [];
      const data = await res.json();

      if (Array.isArray(data)) {
        return data.map((p) => ({
          id: String(p.id),
          title: p.title,
          image: p.image || p.images?.['282x218'] || `https://uploads.scratch.mit.edu/projects/thumbnails/${p.id}.png`,
          views: p.stats?.views ?? 0,
          loves: p.stats?.loves ?? 0,
          favorites: p.stats?.favorites ?? 0,
        }));
      }
      return [];
    } catch (error) {
      console.error('取得エラー:', error);
      return [];
    }
  };

  // 初回読み込み
  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      const initialProjects = await fetchProjects(0);
      setAllProjects(initialProjects);

      if (initialProjects.length < LIMIT) {
        setHasMore(false);
      }

      await fetchPickupProjects(initialProjects);
      setLoading(false);
    };

    initFetch();
  }, []);

  // ピックアップ作品の取得処理
  const fetchPickupProjects = async (loadedProjects) => {
    const promises = PICKUP_PROJECT_IDS.map(async (item) => {
      const found = loadedProjects.find((p) => p.id === String(item.id));
      if (found) {
        return { ...found, pickupComment: item.comment };
      }

      try {
        const res = await fetch(`/api/scratch/projects/${item.id}`);
        if (!res.ok) throw new Error();
        const p = await res.json();
        return {
          id: String(p.id),
          title: p.title,
          image: p.image || p.images?.['282x218'] || `https://uploads.scratch.mit.edu/projects/thumbnails/${p.id}.png`,
          views: p.stats?.views ?? 0,
          loves: p.stats?.loves ?? 0,
          favorites: p.stats?.favorites ?? 0,
          pickupComment: item.comment,
        };
      } catch {
        return {
          id: String(item.id),
          title: `作品 ID: ${item.id}`,
          image: `https://uploads.scratch.mit.edu/projects/thumbnails/${item.id}.png`,
          views: 0,
          loves: 0,
          favorites: 0,
          pickupComment: item.comment,
        };
      }
    });

    const results = await Promise.all(promises);
    setPickupProjects(results);
  };

  // 「もっと読み込む」処理
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextOffset = offset + LIMIT;
    const newProjects = await fetchProjects(nextOffset);

    if (newProjects.length < LIMIT) {
      setHasMore(false);
    }

    if (newProjects.length > 0) {
      setAllProjects((prev) => [...prev, ...newProjects]);
      setOffset(nextOffset);
    }

    setLoadingMore(false);
  };

  // タブに応じたリストを選択
  const currentTabProjects = activeTab === 'all' ? allProjects : pickupProjects;

  // 検索フィルタリング（タイトルで検索）
  const displayProjects = currentTabProjects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">作品紹介</h1>
        <p className="text-sm text-slate-500 mt-1">Scratchで公開中の作品一覧!ぜひ見てください!</p>
      </div>

      {/* タブ ＆ 検索ボックス */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'all'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white/70 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            すべて ({allProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('pickup')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeTab === 'pickup'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white/70 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            ピックアップ ({pickupProjects.length})
          </button>
        </div>

        {/* 検索入力ボックス */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="作品を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 pl-8 text-xs bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-slate-700 placeholder-slate-400"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-slate-400 py-12">Scratchから作品を取得中...</p>
      ) : displayProjects.length === 0 ? (
        <p className="text-center text-slate-400 py-12">該当する作品が見つかりませんでした。</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {displayProjects.map((project) => (
              <a
                key={project.id}
                href={`https://scratch.mit.edu/projects/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200 flex flex-col group"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = 'https://scratch.mit.edu/images/scratch-og.png';
                    }}
                  />
                </div>

                <div className="p-3 flex flex-col flex-1 justify-between space-y-2">
                  <div>
                    <h2 className="font-bold text-slate-800 text-xs group-hover:text-sky-500 transition line-clamp-2 leading-snug">
                      {project.title}
                    </h2>

                    {/* ピックアップのコメント（絵文字削除・whitespace-pre-wrapで改行対応） */}
                    {activeTab === 'pickup' && project.pickupComment && (
                      <p className="text-[11px] text-sky-600 bg-sky-50 p-1.5 rounded-md mt-1.5 border border-sky-100 leading-tight whitespace-pre-wrap">
                        {project.pickupComment}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-100">
                    <span title="参照数">👁️ {project.views}</span>
                    <div className="flex gap-2">
                      <span title="星">⭐ {project.loves}</span>
                      <span title="お気に入り">❤️ {project.favorites}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* 検索中でなく、「すべて」タブで続きがある場合にボタンを表示 */}
          {activeTab === 'all' && searchQuery === '' && hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
              >
                {loadingMore ? '読み込み中...' : 'もっと読み込む'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}