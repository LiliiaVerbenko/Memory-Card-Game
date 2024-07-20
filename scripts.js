const cards = document.querySelectorAll('.memory-card');
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;
const totalPairs = 8;

function flipCard({ target: clickedCard }) {
  if (cardOne !== clickedCard && !disableDeck) {
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

shuffleCard();

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
  
  container.appendChild(img);
  document.body.appendChild(container);

  setTimeout(() => {
    document.body.removeChild(container);
  }, 5000);
} 

cards.forEach((card) => {
  card.addEventListener('click', flipCard);
});

document.addEventListener('DOMContentLoaded', shuffleCard);