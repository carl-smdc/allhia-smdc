function onReCaptchaSuccess() {
  // Enable the submit button after successful reCAPTCHA validation
  document.getElementById("submitBtn").disabled = false;
}

// Toggle the chat widget
function toggleChat() {
  const chatWidget = document.getElementById("chat-widget");
  chatWidget.style.display = chatWidget.style.display === "none" ? "block" : "none";
}

// Send the user's message to the Netlify function and display the response
async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const chatMessages = document.getElementById("chat-messages");

  if (userInput.value.trim() === "") return; // Ignore empty messages

  // Display the user's message in the chat
  const userMessage = document.createElement("div");
  userMessage.style = "padding: 5px; background-color: #e1f5fe; border-radius: 5px; margin: 5px 0;";
  userMessage.innerText = userInput.value;
  chatMessages.appendChild(userMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Show loading indicator while waiting for the response
  const loadingMessage = document.createElement("div");
  loadingMessage.id = "loading";
  loadingMessage.style = "padding: 5px; font-style: italic; color: #aaa; margin: 5px 0;";
  loadingMessage.innerText = "Bot is typing...";
  chatMessages.appendChild(loadingMessage);

  try {
    // Send the message to the Netlify function
    const response = await fetch('/.netlify/functions/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput.value })
    });
    const data = await response.json();

    // Remove loading indicator and show the bot's response
    chatMessages.removeChild(loadingMessage);
    const botMessage = document.createElement("div");
    botMessage.style = "padding: 5px; background-color: #f1f1f1; border-radius: 5px; margin: 5px 0;";
    botMessage.innerText = data.response;
    chatMessages.appendChild(botMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    console.error("Error sending message:", error);
  } finally {
    userInput.value = ""; // Clear input field
  }
}

// Add an event listener for the Enter key in the input field
document.getElementById("user-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default Enter behavior
    sendMessage(); // Call sendMessage on Enter
  }
});
