async function fetchTweet() {
  const input = document.getElementById("url").value.trim();

  // statusのIDだけ抜く（x.com / twitter.com 両対応）
  const m = input.match(/(?:x|twitter)\.com\/[^\/]+\/status\/(\d+)/);
  if (!m) {
    alert("ツイートURLが不正");
    return;
  }
  const tweetId = m[1];

  const workerUrl =
    "https://twitterproxy.asazadawa.workers.dev/?id=" + tweetId;

  const res = await fetch(workerUrl, { cache: "no-store" });
  if (!res.ok) {
    alert("取得に失敗しました");
    return;
  }

  // WorkersがJSONを返す想定
  const data = await res.json();

  let out = "";
  if (data.text) out += data.text + "\n\n";
  if (Array.isArray(data.images)) {
    data.images.forEach(u => out += u + "\n");
  }
  if (data.video) out += "\n" + data.video;

  document.getElementById("result").value = out.trim();
}
