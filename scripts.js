const cards = document.querySelectorAll('.memory-card');
const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
const totalPairs = 10;

let startTime, endTime, timerInterval;
let timerStarted = false;

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const now = new Date();
    const elapsedTime = now - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function flipCard({ target: clickedCard }) {
  if (cardOne !== clickedCard && !disableDeck) {
    if (!timerStarted) { // Check if the timer has not started
        startTimer(); // Start the timer when the first card is flipped
        timerStarted = true; // Set the flag to true so timer doesn't start again
    }
    clickedCard.classList.add('flip');
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector('.back img').src,
      cardTwoImg = cardTwo.querySelector('.back img').src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

    function matchCards(img1, img2) {
      if (img1 === img2) {
          matched++;
        if (matched === totalPairs) {
            stopTimer();
            setTimeout(() => {
                showWinningImage();
            }, 1000);
        }
  
    cardOne.removeEventListener('click', flipCard);
    cardTwo.removeEventListener('click', flipCard);
    cardOne = cardTwo = '';
    return (disableDeck = false);
  }

  setTimeout(() => {
    cardOne.classList.remove('flip');
    cardTwo.classList.remove('flip');
    cardOne = cardTwo = '';
    disableDeck = false;
  }, 1200);
}

function shuffleCard() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = '';
    resetGame();
    
    fetch('data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('No response');
        }
        return response.json();
      })
      .then(data => {
        let imagesData = data.images;
        let arr = imagesData.map(image => image.id);
        arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
        
        cards.forEach((card, i) => {
          card.classList.remove('flip');
          let imgTag = card.querySelector('.back img');
          imgTag.src = imagesData.find(image => image.id === arr[i]).src;
          card.addEventListener('click', flipCard);
        });
      })
      .catch(error => console.error('Error fetching JSON:', error));
  }


  function showWinningImage() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = 0;
    container.style.left = 0;
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.style.zIndex = 1000;

    const img = document.createElement('img');
    img.src = 'images/youWon.png';
    img.style.maxWidth = '200px';
    img.style.border = '5px solid white';
    img.style.borderRadius = '10px';
    img.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    
    const message = document.createElement('div');
    message.style.marginTop = '20px';
    message.style.color = 'white';
    message.style.fontSize = '24px';
    message.style.fontWeight = 'bold';
    message.style.textAlign = 'center';
    
    const totalTime = new Date() - startTime;
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    message.textContent = `It took you ${minutes} minutes and ${seconds-1} seconds to match all the cards.`;
    
    const containerContent = document.createElement('div');
    containerContent.style.textAlign = 'center';
    containerContent.appendChild(img);
    containerContent.appendChild(message);
    
    container.appendChild(containerContent);
    document.body.appendChild(container);

    setTimeout(() => {
        document.body.removeChild(container);
    }, 5000);
}
function resetGame() {
  stopTimer();
  timerStarted = false;
  timerElement.textContent = '00:00';

  cards.forEach(card => {
      card.classList.remove('flip');
      card.addEventListener('click', flipCard); 
  })
};



//shuffleCard();

cards.forEach((card) => {
  card.addEventListener('click', flipCard);
});

document.addEventListener('DOMContentLoaded', () => {
    shuffleCard();
    resetButton.addEventListener('click', resetGame); 

});


//i am very happy