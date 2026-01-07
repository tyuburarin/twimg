// ツイート取得ボタン用関数
async function fetchTweet() {
  const url = document.getElementById('url').value.trim();
  if (!url) return;

  saveHistory(url);

  const match = url.match(/status\/(\d+)/);
  if (!match) {
    alert('ツイートURLが正しくありません');
    return;
  }

  const tweetId = match[1];

  try {
    // 個人用テスト向け CORS プロキシ
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const res = await fetch(`${proxyUrl}https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=ja`);

    if (!res.ok) throw new Error('fetch failed');

    const data = await res.json();
    outputTweet(data);
  } catch (e) {
    alert('ツイート取得に失敗しました');
    console.error(e);
  }
}

// 結果を textarea に出力
function outputTweet(data) {
  try {
    const legacy = data.legacy ?? data;
    const userLegacy = data.core?.user_results?.result?.legacy ?? data.user;

    let text = '';

    if (userLegacy) {
      text += `${userLegacy.name}@${userLegacy.screen_name} `;
    }

    text += (legacy.created_at ?? '') + '\n';
    text += (legacy.full_text ?? legacy.text ?? '') + '\n';

    const medias = legacy.extended_entities?.media ?? data.mediaDetails ?? [];
    for (const m of medias) {
      if (m.type === 'photo') {
        text += (m.media_url_https ?? m.media_url) + '\n';
      }
      if (m.type === 'video' || m.type === 'animated_gif') {
        const variants = m.video_info?.variants ?? [];
        const best = variants
          .filter(v => v.content_type === 'video/mp4')
          .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];

        if (best?.url) text += best.url + '\n';
      }
    }

    document.getElementById('result').value = text.trim();
  } catch (e) {
    alert('取得できたけど解析に失敗しました');
    console.error(e, data);
  }
}

// URL履歴を localStorage に保存
function saveHistory(url) {
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  history.unshift(url);
  localStorage.setItem('history', JSON.stringify(history.slice(0, 20)));
}

// 履歴消去ボタン用
function clearHistory() {
  localStorage.removeItem('history');
  alert('履歴を消しました');
}