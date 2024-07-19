const cards = document.querySelectorAll('.memory-card');
let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

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
    if (matched == 8) {
      setTimeout(() => {
        return shuffleCard();
      }, 1000)
      throwFireworks();
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


function throwFireworks() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = 0;
  container.style.left = 0;
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  const fireworks = new Fireworks(container, { });
  fireworks.start();

  setTimeout(() => {
      fireworks.stop();
      document.body.removeChild(container);
  }, 5000); // Fireworks for 5 seconds
}

document.addEventListener('DOMContentLoaded', shuffleCard); 
cards.forEach((card) => {
  card.addEventListener('click', flipCard);
});
