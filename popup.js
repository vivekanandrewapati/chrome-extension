document.addEventListener('DOMContentLoaded', function() {
  const writeEmailButton = document.getElementById('writeEmail');
  const emailInput = document.getElementById('emailInput');
  const resultDiv = document.getElementById('result');

  writeEmailButton.addEventListener('click', function() {
    const emailContent = emailInput.value;
    chrome.runtime.sendMessage({action: "writeEmail", content: emailContent}, function(response) {
      resultDiv.textContent = response.result;
    });
  });
});