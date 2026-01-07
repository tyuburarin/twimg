const HISTORY_KEY = 'tweet_url_history';

function loadHistory() {
  const list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  const ul = document.getElementById('history');
  ul.innerHTML = '';

  list.forEach(url => {
    const li = document.createElement('li');
    li.textContent = url;
    li.onclick = () => {
      document.getElementById('url').value = url;
      fetchTweet();
    };
    ul.appendChild(li);
  });
}

function saveHistory(url) {
  let list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  list = list.filter(u => u !== url);
  list.unshift(url);
  list = list.slice(0, 20); // 最大20件
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  loadHistory();
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  loadHistory();
}

function extractTweetId(url) {
  const m = url.match(/status\/(\d+)/);
  return m ? m[1] : null;
}

async function fetchTweet() {
  const url = document.getElementById('url').value.trim();
  if (!url) return;

  const id = extractTweetId(url);
  if (!id) {
    alert('URLが正しくありません');
    return;
  }

  saveHistory(url);

  const res = await fetch(
    `https://cdn.syndication.twimg.com/tweet-result?id=${id}`
  );
  const data = await res.json();

  // RT対応
  if (data.retweeted_status) {
    return fetchTweetById(data.retweeted_status.id_str);
  }

  outputTweet(data);
}

async function fetchTweetById(id) {
  const res = await fetch(
    `https://cdn.syndication.twimg.com/tweet-result?id=${id}`
  );
  const data = await res.json();
  outputTweet(data);
}

function outputTweet(data) {
  let text = `${data.user.name}@${data.user.screen_name} ${data.created_at}\n`;
  text += data.text + '\n';

  if (data.mediaDetails) {
    for (const m of data.mediaDetails) {
      if (m.type === 'photo') {
        text += m.media_url_https + '\n';
      }
      if (m.type === 'video') {
        const best = m.video_info.variants
          .filter(v => v.content_type === 'video/mp4')
          .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
        if (best) text += best.url + '\n';
      }
    }
  }

  document.getElementById('result').value = text.trim();
}

loadHistory();
