const GEMINI_API_KEY = 'xyz';



const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getWordMeaning") {
    getWordMeaning(request.text).then(meaning => sendResponse({result: meaning}));
    return true;
  } else if (request.action === "rephraseSentence") {
    rephraseSentence(request.text).then(rephrased => sendResponse({result: rephrased}));
    return true;
  } else if (request.action === "writeEmail") {
    writeEmail(request.text).then(emailContent => sendResponse({result: emailContent}));
    return true;
  }
});

async function callGeminiAPI(prompt) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return `Error: ${error.message}`;
  }
}

async function getWordMeaning(word) {
  const prompt = `Provide a brief definition for the word or phrase: "${word}"`;
  return await callGeminiAPI(prompt);
}

async function rephraseSentence(sentence) {
  const prompt = `Rephrase the following sentence: "${sentence}"`;
  return await callGeminiAPI(prompt);
}

async function writeEmail(content) {
  const prompt = `Write a brief email based on the following content: ${content}`;
  return await callGeminiAPI(prompt);
}

console.log("Background script loaded");