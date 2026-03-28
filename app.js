"use strict";

const input = document.getElementById("input");
const form = document.getElementById("form");
const output = document.getElementById("output");

async function getKey() {
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    const res = await fetch(
      "https://proxy-key-aa77.onrender.com/get-key4",
      options,
    );
    if (!res.ok) {
      throw new Error("bad");
    }
    const { key } = await res.json();

    return key;
  } catch (error) {
    console.error("Didn't get the key", error);
    
  }
}

async function makeRequest(options) {
  const url =
    "https://corsproxy.io/?url=https://api.cloudflare.com/client/v4/accounts/c6f2300771bd4a9e3d6f3319c6980571/ai/run/@cf/meta/llama-3-8b-instruct";
  try {
    const res = await fetch(url, options);

    const data = await res.json();
    console.log(data.result.response)
    return data;
  } catch (error) {}
}

const messages = [
  {
    role: "system",
    content:
      "You are a cookie shop assistant. Cookies cost $4 each or 3 for $10. Flavors: chocolate chip, white chocolate macadamia, oatmeal raisin, peanut butter, sugar, snickerdoodle, s'mores. They are made with organic ingredients and are available in gluten-free and vegan versions at the same price. Greet the user and answer the user's request directly. Be short and helpful. Do not information dump, providing everything you know at one time. Do not repeat a long introduction",
    
  },
];

//Render Function
function renderChat(text, type) {
  // console.log("chat is working");
  const p = document.createElement("p");
  p.textContent = text;

  if (type === "user") {
    p.className = "p-2 border max-w-[70%] rounded bg-orange-600 text-white self-end";
  } else {
    p.className = "p-2  border rounded max-w-[70%] bg-yellow-700 text-white self-start";
  }
  output.appendChild(p);
}

//Trigger
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userInput = input.value;
  
  if (!userInput) {
    return;
  } 
  //*added render user response
  renderChat(userInput, "user");

  messages.push({
    role: "user",
    content: userInput,
  });
  const apiKey = await getKey();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({ messages }),
  };
  const data = await makeRequest(options);

  //*added render bot response
  renderChat(data.result.response, "bot");

  messages.push({
    role: "assistant",
    content: data.result.response,
  });
  console.log(data.result.response);
  input.value = "";
});
renderChat("Hi! Can I help you with your cookie selection?", "bot");
