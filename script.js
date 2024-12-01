const container = document.querySelector("#container");

let allQuotes = [];
let pageNumber = 1;
const renderLimit = 10;
let startingIndex = 0;

async function loadAllData(pageNumber) {
  const formData = new FormData();

  formData.append("type", "1");
  formData.append("page_number", pageNumber);
  let req = await fetch(
    "https://pos.kalamitcompany.com/api/mygalla_clients4/Sand_api.php",
    { method: "POST", body: formData }
  );
  let data = await req.json();
  return data;
}
(async () => {
  await callData(pageNumber).then(() => {});
  renderQuotes();
})();

async function callData(pageNumber) {
  let mydata = await loadAllData(pageNumber);
  mydata.map((item) => {
    allQuotes.push(item);
  });
}

const observer = new IntersectionObserver((entries) => {
  console.log(entries);

  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    if (entry.isIntersecting) {
      pageNumber += 1;
      console.log(pageNumber);
      callData(pageNumber);
      observer.unobserve(entry.target);
      renderQuotes();
    }
  });
});

const formatQuotes = (quotes) => {
  let QuotesStr = "";
  quotes.forEach((quotes) => {
    QuotesStr += `<div class="quotes">SN ${quotes.id} <b>Name :</b> ${quotes.product_nm} <br> <b>Discription :</b> ${quotes.description}<a href="next.html">click</a></div>`;
  });

  return QuotesStr;
};

const renderQuotes = () => {
  const getQuotes = formatQuotes(
    allQuotes.slice(startingIndex, startingIndex + renderLimit)
  );

  container.innerHTML += getQuotes;

  const RenderQuotes = document.querySelectorAll(".quotes");
  startingIndex = RenderQuotes.length;
  const newQuotes = RenderQuotes[RenderQuotes.length - 1];
  observer.observe(newQuotes);
};

const scrollBox = document.getElementById("container");

// Save scroll position to localStorage when the user scrolls inside the box
scrollBox.addEventListener("scroll", () => {
  localStorage.setItem("scrollPosition", scrollBox.scrollTop);
});

// Restore scroll position when the page loads or when coming back to the page
window.addEventListener("load", () => {
  const savedScrollPosition = localStorage.getItem("scrollPosition");
  if (savedScrollPosition !== null) {
    scrollBox.scrollTop = parseInt(savedScrollPosition, 10);
  }
});
