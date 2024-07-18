// 保存
//利用空的array先暫時保存listState資料
let listState = [];
//利用key將資料存到瀏覽器的localStorage
const STATE_KEY = "todo-list";

//把localstorage的東西讀出來
function loadState() {
  const listState = localStorage.getItem(STATE_KEY);
  if (listState !== null) {
    // 用JSON.parse把字串轉成物件
    return JSON.parse(listState);
  }
  // 如果localStorage沒有東西，代表Todolist是空的，所以用空的陣列代表
  return [];
}
// 相反
// saveState做的事，把一個array轉成字串，並存到localStorage
function saveState(list) {
  localStorage.setItem(STATE_KEY, JSON.stringify(list));
}
//打開除了讀取localStorage以外，還要把它顯示在畫面上
function initList() {
  //load state
  listState = loadState(); //把存在localStorage的狀態(內的items、打勾)讀出來，
  //render list，以下是把所有的東西都插入html內
  const ul = document.getElementById("list");
  for (const item of listState) {
    const li = document.createElement("li");
    li.innerText = item.text;
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete");
    deleteButton.onclick = deleteItem;
    li.appendChild(deleteButton);

    li.classList.add("item");
    if (item.checked) {
      li.classList.add("checked");
    }

    ul.appendChild(li);
  }
}

// 實作 (1)=>我們需要JavaScript 1.取得外層的<ul>，2. 建立一個<li>插進去
// 從 input 取得輸入的文字，取得 input 裡面的值
// return 防止function繼續往下跑
function addItem() {
  const ul = document.getElementById("list");
  const input = document.getElementById("input");
  const text = input.value;
  if (text === "") {
    alert("請輸入內容");
    return;
  }
  // 建立新的標籤createElement
  const newItem = document.createElement("li");
  // class="item"
  newItem.classList.add("item");
  // 內容設置成輸入的值const text
  newItem.innerHTML = text;

  // const 命名.onclick=function
  newItem.onclick = checkItem;

  const deleteButton = document.createElement("span");
  deleteButton.classList.add("delete");
  deleteButton.onclick = deleteItem;
  // 把新增的newitem 新增到check後面
  newItem.appendChild(deleteButton);

  //localStorage：先更新listState，之後在同步更新DOM 3:10:00
  listState.push({
    text,
    checked: false,
  });
  //把listState存入localStorage，因兩個值要同步
  saveState(listState);

  input.value = "";
  ul.appendChild(newItem);
}

// 點擊item之後，要做打勾的動作，打勾的邏輯寫在checkItem裡面
// 把<li>加上checked的class就會呈現打勾的樣子了
// toggle開關，點一下加上class/取消class
//3:15:00
//parent就是item上一層：<ul></ul>
//有ul後就可以取得index
//parent.childNodes，iterable=可以迭代的東西
function checkItem(e) {
  const item = e.target;
  const parent = item.parentNode;
  const idx = Array.from(parent.childNodes).indexOf(item);

  listState[idx].checked = !listState[idx].checked;

  item.classList.toggle("checked");
  saveState(listState);
}

function deleteItem(e) {
  // 這邊可以不用this，使用event參數也可以(使用參數比較好)
  // this指xx按鈕，thid.parentNode指刪除項目
  const item = this.parentNode;
  // 指外面一層ul
  const parent = item.parentNode;
  //child指的是ul內的item
  const idx = Array.from(parent.childNodes).indexOf(item);
  listState = loadState.filter((_, i) => i !== idx);
  parent.removeChild(item);
  saveState(listState);
  e.stopPropagation();
}

//localStorage，要在網頁讀取完時呼叫inlist，才會執行
initList();

// 前置工作 =>先取得add-button按鈕
const addButton = document.getElementById("add-button");

// 前置工作 =>將這個const js命名的加上功能("功能", function");
addButton.addEventListener("click", addItem);

// 前置工作 =>為了解決form的預設行為是繳交之後會刷新頁面，預防這件事，而使用preventDefault可以防止刷新
const form = document.getElementById("input-wrapper");
form.addEventListener("submit", (e) => {
  e.preventDefault();
});
