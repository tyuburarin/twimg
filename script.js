async function fetchTweet() {
  const input = document.getElementById("url").value.trim();
  console.log("input =", input);

  const path = input.replace(/^https?:\/\/(x|twitter)\.com/, "");
  console.log("path =", path);

  const workerUrl =
    "https://＜workers名＞.workers.dev/?url=" +
    encodeURIComponent(path);

  console.log("workerUrl =", workerUrl);

  const res = await fetch(workerUrl);
  const text = await res.text();

  console.log("response =", text);
  document.getElementById("result").value = text;
}
