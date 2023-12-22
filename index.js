const mainBox = document.createElement("div");
mainBox.className = "box";
const box2 = document.createElement("div");
document.body.prepend(mainBox);
const inputSearch = document.createElement("input");
inputSearch.className = "searchString";
inputSearch.setAttribute("type", "text");
mainBox.appendChild(inputSearch);
mainBox.appendChild(box2);

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};
const boxWithScore = document.createElement("ul");
boxWithScore.classList.add("ul-score");
mainBox.appendChild(boxWithScore);
inputSearch.addEventListener(
  "input",
  debounce((e) => {
    const dataUsers = fetch(
      `https://api.github.com/search/repositories?q=${e.target.value}&per_page=5`
    );
    dataUsers
      .then((res) => res.json())
      .catch((error) => console.log(error))
      .then((data) => {
        const ul = document.createElement("ul");
        ul.classList.add("ul-list");
        const searchUl = document.querySelector(".ul-list");
        if (searchUl) {
          searchUl.remove();
        }
        box2.appendChild(ul);
        data.items.forEach((value) => {
          const li = document.createElement("li");
          li.classList.add("li-item");
          li.textContent = value.name;
          ul.appendChild(li);
          li.addEventListener("click", () => {
            const itemWithScore = document.createElement("li");
            itemWithScore.classList.add("li-score");
            boxWithScore.appendChild(itemWithScore);
            const mainScore = document.createElement("div");
            mainScore.classList.add("mainScore");
            itemWithScore.appendChild(mainScore);
            const nameOfAuthor = document.createElement("div");
            nameOfAuthor.classList.add("author-name");
            mainScore.appendChild(nameOfAuthor);
            const nameOfOwner = document.createElement("div");
            nameOfOwner.classList.add("owner-name");
            mainScore.appendChild(nameOfOwner);
            const starsOfOwner = document.createElement("div");
            starsOfOwner.classList.add("stars-owner");
            mainScore.appendChild(starsOfOwner);
            nameOfAuthor.textContent = `Name: ${value.name}`;
            nameOfOwner.textContent = `Owner: ${value.owner.login}`;
            starsOfOwner.textContent = `Stars: ${value.stargazers_count}`;
            inputSearch.value = "";
            ul.remove();
            const closeButton = document.createElement("button");
            closeButton.classList.add("button");
            mainScore.appendChild(closeButton);
            closeButton.textContent = "X";
            closeButton.addEventListener("click", () => itemWithScore.remove());
          });
        });
      });
  }, 500)
);
