import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Gamepad2, FileText, User, Sparkles, Megaphone, Compass, ArrowRight } from 'lucide-react';

// SupabaseとURLリンク化のユーティリティをインポート
import { supabase } from '../supabase';
import { renderWithLinks } from '../utils/linkify';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home() {
  const [pickupProjects, setPickupProjects] = useState([]);
  const [latestPost, setLatestPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // カルーセルに表示したい Scratch 作品の ID リスト
  const SLIDE_PROJECT_IDS = ['1374961866', '1365423687', '813444488'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // ① Scratch 作品データの取得
      try {
        const promises = SLIDE_PROJECT_IDS.map(async (id) => {
          const res = await fetch(`/api/scratch/projects/${id}`);
          if (!res.ok) throw new Error();
          return await res.json();
        });
        const projects = await Promise.all(promises);
        setPickupProjects(projects);
      } catch (e) {
        setPickupProjects(
          SLIDE_PROJECT_IDS.map((id) => ({
            id,
            title: `Scratch Project ${id}`,
            image: `https://uploads.scratch.mit.edu/projects/thumbnails/${id}.png`,
          }))
        );
      }

      // ② Supabaseから一番新しい投稿を1件だけ取得
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          setLatestPost(data[0]);
        }
      } catch (err) {
        console.error('投稿の取得に失敗しました:', err);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-8">
      {/* ヒーローエリア / Scratch作品カルーセル（4:3対応） */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>PICKUP</span>
        </h2>

        {loading ? (
          <div className="w-full aspect-[4/3] max-h-[420px] bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-slate-400 text-xs mx-auto">
            読み込み中...
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900 max-w-2xl mx-auto">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={true}
              className="w-full aspect-[4/3]"
            >
              {pickupProjects.map((project) => (
                <SwiperSlide key={project.id}>
                  <a
                    href={`https://scratch.mit.edu/projects/${project.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full h-full block group"
                  >
                    <img
                      src={
                        project.image ||
                        project.images?.['282x218'] ||
                        `https://uploads.scratch.mit.edu/projects/thumbnails/${project.id}.png`
                      }
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                      <div className="text-white space-y-1">
                        <span className="bg-sky-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                          Scratch Project
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold group-hover:text-sky-300 transition">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </section>

      {/* 最新の投稿（Supabaseから動的表示） */}
      {latestPost && (
        <section className="space-y-3">
          <div className="flex justify-between items-end">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-sky-500" />
              <span>POST</span>
            </h2>
            <Link to="/posts" className="text-xs font-semibold text-sky-500 hover:underline flex items-center gap-1">
              一覧を見る <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <span className="text-[11px] font-semibold text-slate-400">
              {new Date(latestPost.created_at).toLocaleString('ja-JP')}
            </span>
            <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed line-clamp-3 mt-2">
              {renderWithLinks(latestPost.content)}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <Link
                to="/posts"
                className="text-xs font-bold text-sky-500 hover:text-sky-600 inline-flex items-center gap-1"
              >
                投稿ページで返信を見る・コメントする <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ナビゲーションカード */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-500" />
          <span>MENU</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/posts"
            className="group bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-500 transition">投稿</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                開発ログやちょっとした日常のメモなどを綴っています。
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-500 mt-4 flex items-center gap-1">
              読む <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </span>
          </Link>

          <Link
            to="/profile"
            className="group bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-purple-500 transition">プロフィール</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                とぅもろーの経歴やアカウントリンクなどをまとめています。
              </p>
            </div>
            <span className="text-xs font-bold text-purple-500 mt-4 flex items-center gap-1">
              知る <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </span>
          </Link>

          <Link
            to="/works"
            className="group bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-sky-500 transition">作品紹介</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scratchで作ったゲームや便利ツールなどを公開しています。
              </p>
            </div>
            <span className="text-xs font-bold text-sky-500 mt-4 flex items-center gap-1">
              見る <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}