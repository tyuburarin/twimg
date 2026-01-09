async function fetchTweet() {
  const tweetUrl = document.getElementById("url").value.trim();
  if (!tweetUrl) {
    alert("URLを入力してください");
    return;
  }

  // Workers URLに ?url= を必ず付ける
  const workerUrl = "https://your-worker-domain.workers.dev/?url=" + encodeURIComponent(tweetUrl);

  try {
    const res = await fetch(workerUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");

    const data = await res.json();
    console.log(data);

    let output = "";
    if (data.text) output += data.text + "\n";
    if (data.images?.length) output += data.images.join("\n") + "\n";
    if (data.video) output += data.video + "\n";

    document.getElementById("result").value = output.trim();
  } catch (e) {
    alert("取得に失敗しました");
    console.error(e);
  }
}

