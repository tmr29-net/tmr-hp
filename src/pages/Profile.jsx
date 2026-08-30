import { Link } from 'react-router-dom';
import myIcon from '../assets/icon.png';

export default function Profile() {
  // ① メイン自己紹介文（改行対応）
  const bio = `こんにちは、とぅもろーです！
ゲーム実況やちょっとした便利ツール、
あとはよくわからないものなどをのんびりと作っている
Scratch歴5年の老害です！笑
暇つぶしにでもぜひご覧ください！`;

  // ② フリースペース（長文用・改行対応）
  const aboutMeDetail = `《とぅもろーってどんな奴なの？》

  〇年齢　　　　　高校2年生
  〇好きなゲーム　マイクラ　にゃんこ　プロセカ
  〇趣味　　　　　Geminiと一緒にくだらないものを作って遊ぶこと
  〇好きな実況者　ドズル社　からぴち
  　　　　　　　　(何気にグループ実況者のほうが好きだったり？)
  〇特技　　　　　パソコン
  〇好きな場所　　ハードオフ

  〇好きな飲食店　サイゼリヤ・なか卯
  〇好きな食べ物　ラーメン・まぜそば・豚汁
  〇得意料理　　　親子丼

  〇スマホ　　　　iPhone17
  〇タブレット　　iPad A16
  〇パソコン　　　自作 (i5-13400F&RTX3060ti)


  ドズル社はぼんさんとおんりー
  からぴちはシヴァさんとるなさんが推しです！

  休日は基本家にいます
  体動かせって怒られます笑
  最近は勉強がとにかく嫌です

  最近はカラオケにハマってます！
  最高点はJOYSOUNDで98.894点、ミセスの「春愁」です

  ちなみにこのサイトもGeminiと作りました！
`;

  // 経歴・歴史のデータ
  const history = [
    {
      date: '2021年 4月',
      title: 'Scratchに降臨',
      description: 'はじめて出したのは「しかっくんの大冒険」だったかな？',
    },
    {
      date: '2021年 11月',
      title: 'プログラミング大会で優秀賞受賞',
      description: '何気に知られてないよね。だってもう非共有だし。',
    },
    {
      date: '2021年 11月',
      title: 'Platformer Athletic公開',
      description: '現存最古のとぅもろー作品。',
    },
    {
      date: '2022年 7月',
      title: '初代ともクラシリーズ公開',
      description: 'たぶんこの時期だったと思う。',
    },
    {
      date: '2022年 7月',
      title: 'サブ垢誕生',
      description: '何気に参照数伸びてるんよなぁ。',
    },
    {
      date: '2023年 2月',
      title: 'ともクラⅡ(ともクラ for Java版)公開',
      description: 'パソコンの買い替えがきっかけ。',
    },
    {
      date: '2023年 2月',
      title: 'Minecraftクリッカー公開',
      description: '今でも一番人気の作品！',
    },
    {
      date: '2023年 3月',
      title: 'Minecraft Ultimate Edition公開',
      description: 'この頃が一番ちゃんとScratchしてたなぁ...',
    },
    {
      date: '2023年 4月',
      title: '「キャト民」加入',
      description: 'マネージャーとして。2回くらい撮影にも参加した希ガス',
    },
    {
      date: '2023年 後半',
      title: '...この時期何やってたんだろう？',
      description: 'この頃から「ともぴよ」ではなく「とぅもろー」を名乗り始めた気がする。',
    },
    {
      date: '2024年 2月',
      title: '「ゆにふるプロダクション」創設',
      description: '実は2/29設立。なので記念日は4年に一度しか来ません(笑)',
    },
    {
      date: '2024年 3月',
      title: 'ともクラⅢ(SEREISE-N 統合版)公開',
      description: '歴史は何度でも繰り返す。',
    },
    {
      date: '2024年 5月',
      title: '「キャト民」解散',
      description: '短かったけど楽しかったよ。ありがとう！',
    },
    {
      date: '2024年 後半',
      title: '...この時期何やってたんだろう？(2回目)',
      description: '受験勉強...かな？でも普通にゆにふるのオーディションとかしてた気が...',
    },
    {
      date: '2025年 4月',
      title: '高校入学',
      description: '受かって本当に良かった。本当に。',
    },
    {
      date: '2025年 4月',
      title: '初のにゃんこ実況公開',
      description: 'その後も何本か投稿したね',
    },
    {
      date: '2025年 後半',
      title: '...この時期何やってt(以下略)',
      description: '年の後半は目立った何かがないんだよね。誕生日とかあるのになぁ',
    },
    {
      date: '2026年 1月',
      title: 'ゆにふるプロダクション活動休止',
      description: '運営が持たない...そして過疎化がハンパない...いつか復活させるからな！',
    },
    {
      date: '2026年 3月',
      title: 'Scratch Text Generator公開',
      description: 'このころからバイブコーディングにハマり始める',
    },
    {
      date: '2026年 6月',
      title: 'ともクラⅣ(SURVIVAL)公開',
      description: '四度目の正直。今回は途中消滅させない！',
    },
    {
      date: '2026年 8月',
      title: 'とぅもろーのウェブ公開',
      description: 'このサイトのこと！',
    },
  ];

  // SNSや外部リンクのリスト
  const links = [
    { name: 'Scratch(メイン)', url: 'https://scratch.mit.edu/users/tomo_piyo/', color: 'bg-orange-500 hover:bg-orange-600' },
    { name: 'Scratch(サブ)', url: 'https://scratch.mit.edu/users/tomo_pico/', color: 'bg-slate-800 hover:bg-slate-900' },
  ];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* ページタイトル */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">プロフィール</h1>
        <p className="text-sm text-slate-500 mt-1">とぅもろーとは何者なのか。</p>
      </div>

      {/* メインプロフィールカード */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={myIcon}
          alt="とぅもろーのアイコン"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200 shadow-md flex-shrink-0"
        />
        <div className="space-y-3 text-center sm:text-left flex-1">
          <div>
            <h2 className="text-xl font-bold text-slate-800">とぅもろー</h2>
            <p className="text-xs text-slate-400 font-medium">@tomo_piyo</p>
          </div>

          {/* whitespace-pre-wrap で改行を保持 */}
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {bio}
          </p>

          {/* 作品ページ（/works）へのボタン */}
          <div className="pt-2 flex justify-center sm:justify-start">
            <Link
              to="/works"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition shadow-sm hover:shadow hover:-translate-y-0.5"
            >
              <span>作品を見に行く</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 追加：長文用フリースペース */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span></span> 自己紹介
        </h3>

        {/* whitespace-pre-wrap で改行を保持 */}
        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
          {aboutMeDetail}
        </p>
      </div>

      {/* 経歴・ヒストリー */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span></span> 経歴
        </h3>

        <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-6 pt-2">
          {history.map((item, index) => (
            <div key={index} className="relative">
              {/* タイムラインの丸ポチ */}
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-white shadow-sm" />

              <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                {item.date}
              </span>
              <h4 className="font-bold text-slate-800 text-sm mt-1">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* リンク集 */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span>🔗</span> アカウント
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} text-white font-medium text-xs py-2.5 px-4 rounded-xl text-center transition shadow-sm hover:shadow hover:-translate-y-0.5`}
            >
              {link.name} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}