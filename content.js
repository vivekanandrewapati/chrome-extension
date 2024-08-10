console.log("Multi-Purpose Text Helper content script loaded");

function getSelectedText() {
  return window.getSelection().toString().trim();
}

function showPopup(x, y) {
  const popup = document.createElement('div');
  popup.className = 'text-helper-popup';
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;

  const options = [
    { text: 'Get meaning', action: 'getWordMeaning' },
    { text: 'Rephrase', action: 'rephraseSentence' },
    { text: 'Write email', action: 'writeEmail' }
  ];

  options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option.text;
    button.onclick = () => {
      const selectedText = getSelectedText();
      chrome.runtime.sendMessage({action: option.action, text: selectedText}, function(response) {
        if (chrome.runtime.lastError) {
          console.error('Runtime error:', chrome.runtime.lastError);
          return;
        }
        if (response && response.result) {
          alert(response.result); 
        }
      });
      popup.remove();
    };
    popup.appendChild(button);
  });

  document.body.appendChild(popup);

  document.addEventListener('mousedown', function removePopup(e) {
    if (!popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener('mousedown', removePopup);
    }
  });
}

document.addEventListener('mouseup', function(e) {
  const selectedText = getSelectedText();
  if (selectedText) {
    console.log('Selected text:', selectedText);
    setTimeout(() => showPopup(e.clientX, e.clientY), 10);
  }
});

console.log("Multi-Purpose Text Helper content script fully loaded");