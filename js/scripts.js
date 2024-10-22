function onReCaptchaSuccess() {
  // Enable the submit button after successful reCAPTCHA validation
  document.getElementById("submitBtn").disabled = false;
}

// Ensure you have the necessary libraries loaded and your API key configured
const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: "You are Eric, SMDC's property assistant...",
});

// Your existing generationConfig
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function sendMessageToChatbot(userInput) {
    const chatSession = model.startChat({ generationConfig });

    const userMessage = { role: "user", parts: [{ text: userInput }] };
    await chatSession.sendMessage(userInput);

    const result = await chatSession.sendMessage(userInput);
    return result.response.text();
}

document.getElementById("chatbot-toggle").addEventListener("click", function() {
    const popup = document.getElementById("chatbot-popup");
    popup.style.display = popup.style.display === "none" ? "block" : "none";
});

document.getElementById("chatbot-send").addEventListener("click", async function() {
    const input = document.getElementById("chatbot-input");
    const userInput = input.value;

    if (userInput.trim() === "") return;

    // Display user message
    const messagesDiv = document.getElementById("chatbot-messages");
    messagesDiv.innerHTML += `<div class="user-message">${userInput}</div>`;
    
    // Send message to chatbot and get response
    const response = await sendMessageToChatbot(userInput);
    
    // Display chatbot response
    messagesDiv.innerHTML += `<div class="bot-message">${response}</div>`;
    input.value = ""; // Clear input
});
