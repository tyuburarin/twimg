async function fetchTweet() {
  const input = document.getElementById("url").value.trim();
  if (!input) return;

  const match = input.match(/x\.com\/(.+?\/status\/\d+)/);
  if (!match) {
    alert("ツイートURLが不正");
    return;
  }

  const path = "/" + match[1];

  const workerUrl =
    "https://xxxxx.workers.dev/?url=" + encodeURIComponent(path);

  const res = await fetch(workerUrl);
  const html = await res.text();

  parseAndOutput(html);
}

function parseAndOutput(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  let out = "";

  // 本文
  const text = doc.querySelector("meta[property='og:description']");
  if (text) out += text.content + "\n\n";

  // 画像
  doc.querySelectorAll("meta[property='og:image']").forEach(m => {
    out += m.content + "\n";
  });

  // 動画
  const video = doc.querySelector("meta[property='og:video']");
  if (video) out += "\n" + video.content;

  document.getElementById("result").value = out.trim();
}
