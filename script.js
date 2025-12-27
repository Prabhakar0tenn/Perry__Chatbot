/* ================= ELEMENTS ================= */

const chat = document.getElementById("chatMessages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const themeSelect = document.getElementById("themeSelect");
const botNameInput = document.getElementById("botName");
const clearBtn = document.getElementById("clearChat"); // may or may not exist

/* ================= CONFIG ================= */

const API_KEY =
  "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";

const MODEL = "openai/gpt-3.5-turbo";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

/* ================= UI HELPERS ================= */

function addMessage(sender, text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerHTML = `
    <span class="sender">${sender}</span>
    <p>${text}</p>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/* ================= CHAT LOGIC ================= */

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  // user message
  addMessage("You", msg, "user");
  input.value = "";

  // thinking bubble
  const thinking = document.createElement("div");
  thinking.className = "message bot";
  thinking.innerHTML = `
    <span class="sender">${botNameInput.value}</span>
    <p>Processing...</p>
  `;
  chat.appendChild(thinking);
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Perry AI"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are Perry AI, a professional, calm and helpful assistant."
          },
          {
            role: "user",
            content: msg
          }
        ]
      })
    });

    const data = await response.json();
    thinking.remove();

    if (!response.ok) {
      throw new Error(data.error?.message || "OpenRouter API error");
    }

    const reply = data.choices[0].message.content;
    addMessage(botNameInput.value, reply, "bot");

  } catch (err) {
    thinking.remove();
    console.error("API ERROR:", err);
    addMessage(
      botNameInput.value,
      "System error detected: " + err.message,
      "bot"
    );
  }
}

/* ================= EVENTS ================= */

// send button
sendBtn.addEventListener("click", sendMessage);

// enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// clear chat (SAFE — button ho ya na ho)
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    chat.innerHTML = "";
    addMessage(botNameInput.value, "System reset complete.", "bot");
  });
}

/* ================= THEME SWITCH (FIXED) ================= */

themeSelect.addEventListener("change", (e) => {
  document.body.classList.remove(
    "theme-coffee",
    "theme-ghost",
    "theme-midnight",
    "theme-twilight",
    "theme-moonstone",
    "theme-ocean",
    "theme-aurora",
    "theme-glitch",
    "theme-candy",
    "theme-mars"
  );

  document.body.classList.add(e.target.value);
});
