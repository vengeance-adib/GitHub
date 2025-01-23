const questions = [
  // Questions array remains unchanged
];

const totalQuestions = questions.length;
document.getElementById('total-questions').textContent = totalQuestions;

let currentQuestionIndex = 0;
let skipTeaseCount = 0;

function showQuestion(index) {
  const questionElem = document.getElementById('question');
  const answersElem = document.getElementById('answers');
  const responseElem = document.getElementById('response');
  const nextButton = document.getElementById('next-button');
  const currentCounter = document.getElementById('current-question');
  const skipButton = document.getElementById('skip-button');
  const teaseElem = document.getElementById('tease');
  
  teaseElem.textContent = '';
  responseElem.textContent = '';
  nextButton.classList.add('hidden');
  currentCounter.textContent = index + 1;
  const question = questions[index];
  questionElem.textContent = question.question;
  answersElem.innerHTML = '';

  if (question.options.length > 0) {
    question.options.forEach((option, i) => {
      const button = document.createElement('button');
      button.textContent = option;
      button.onclick = () => {
        const response = question.responses[i] || "Interesting choice!";
        displayResponse(response);
      };
      answersElem.appendChild(button);
    });
  }

  if (question.allowOther) {
    const otherInput = document.createElement('input');
    otherInput.type = 'text';
    otherInput.placeholder = 'Your answer...';
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Submit';
    submitBtn.onclick = () => {
      const answer = otherInput.value.trim();
      if (answer) {
        fetchAIResponse(answer)
          .then(response => displayResponse(response))
          .catch(() => displayResponse("Couldn't fetch a response, but I loved your answer!"));
      }
    };
    answersElem.appendChild(otherInput);
    answersElem.appendChild(submitBtn);
  }

  // Skip button functionality
  skipButton.onclick = () => {
    skipTeaseCount++;
    if (skipTeaseCount === 1) {
      teaseElem.textContent = "Skipping already? Can't handle the heat? 😏";
    } else {
      teaseElem.textContent = "Another skip? You're making this too easy! 😉";
    }
    nextQuestion();
  };
}

function displayResponse(response) {
  const answersElem = document.getElementById('answers');
  const responseElem = document.getElementById('response');
  const nextButton = document.getElementById('next-button');
  answersElem.innerHTML = '';
  responseElem.textContent = response;
  nextButton.classList.remove('hidden');
  nextButton.onclick = nextQuestion;
}

function fetchAIResponse(answer) {
  return fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': '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'
    },
    body: JSON.stringify({
      prompt: `The user answered: "${answer}". Generate a fun, lively response.`,
      max_tokens: 50
    })
  })
    .then(response => response.json())
    .then(data => data.choices[0].text.trim());
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < totalQuestions) {
    showQuestion(currentQuestionIndex);
  } else {
    showCelebration();
  }
}

function showCelebration() {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="celebration">🎉 Thanks for playing, Marium! 🎉</div>
    <p>You mean a lot to me, and I hope you had fun! 😊</p>
    <p>So, how did you do? Fun game, right? Let me know what you think!</p>
  `;
}

// Start the game
showQuestion(currentQuestionIndex);
