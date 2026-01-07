async function fetchTweet() {
  alert("fetchTweet 呼ばれた");

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
    console.log("① fetch 前");

    const res = await fetch(
      `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=ja`,
      { cache: 'no-store' }
    );

    console.log("② status:", res.status);

    const text = await res.text();
    console.log("③ 生レスポンス:", text);

    if (!res.ok) {
      alert("HTTPエラー: " + res.status);
      return;
    }

    const data = JSON.parse(text);
    console.log("④ JSON OK");

    outputTweet(data);
  } catch (e) {
    alert('取得処理で例外が発生しました');
    console.error(e);
  }
}

function outputTweet(data) {
  document.getElementById('result').value =
    JSON.stringify(data, null, 2);
}

function saveHistory(url) {
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  history.unshift(url);
  localStorage.setItem('history', JSON.stringify(history.slice(0, 20)));
}