class Pet {
  constructor(name, type, icon) {
    this.name = name;
    this.type = type;
    this.icon = icon;
    this._hunger = 50;
    this._energy = 50;
    this._health = 100;
    this.maxStat = 100;
  }

  get hunger() {
    return this._hunger;
  }

  set hunger(value) {
    this._hunger = Math.max(0, Math.min(this.maxStat, value));
  }

  get energy() {
    return this._energy;
  }

  set energy(value) {
    this._energy = Math.max(0, Math.min(this.maxStat, value));
  }

  get health() {
    return this._health;
  }

  set health(value) {
    this._health = Math.max(0, Math.min(this.maxStat, value));
  }

  feed() {
    this.hunger = this.hunger - 25;
    this.health = this.health + 5;

    if (this.hunger < 20) {
      return `${this.name} is full and happy!`;
    } else {
      return `${this.name} enjoyed the meal!`;
    }
  }

  play() {
    if (this.energy < 15) {
      return `${this.name} is too tired to play!`;
    }

    this.energy = this.energy - 15;
    this.health = this.health + 3;

    return `${this.name} had fun playing!`;
  }

  rest() {
    this.energy = this.energy + 30;

    if (this.energy >= 90) {
      return `${this.name} is fully recharged!`;
    } else {
      return `${this.name} is resting peacefully...`;
    }
  }

  getStatus() {
    if (this.health < 30) {
      return `${this.name} is in critical condition! Take care of them!`;
    } else if (this.health < 50) {
      return `${this.name} is not feeling well...`;
    } else if (this.hunger > 80) {
      return `${this.name} is very hungry!`;
    } else if (this.energy < 20) {
      return `${this.name} is exhausted and needs rest!`;
    } else if (this.health > 90 && this.hunger < 30 && this.energy > 70) {
      return `${this.name} is thriving and full of life!`;
    } else if (this.health > 80) {
      return `${this.name} is feeling great!`;
    } else {
      return `${this.name} is doing okay!`;
    }
  }

  updateOverTime() {
    this.hunger = this.hunger + 2;
    this.energy = this.energy - 1;

    if (this.hunger > 70) {
      this.health = this.health - 2;
    }

    if (this.energy < 20) {
      this.health = this.health - 1;
    }

    if (this.hunger < 30 && this.energy > 50) {
      this.health = this.health + 0.5;
    }
  }
}

class PetSimulator {
  constructor() {
    this.pet = new Pet('Whiskers', 'Cat', '🐱');
    this.updateInterval = null;
    this.initializeUI();
    this.attachEventListeners();
    this.startSimulation();
  }

  initializeUI() {
    document.getElementById('petIcon').textContent = this.pet.icon;
    document.getElementById('petName').textContent = this.pet.name;
    document.getElementById('petType').textContent = this.pet.type;
    this.updateUI();
  }

  attachEventListeners() {
    document.getElementById('feedBtn').addEventListener('click', () => {
      this.handleAction('feed');
    });

    document.getElementById('playBtn').addEventListener('click', () => {
      this.handleAction('play');
    });

    document.getElementById('restBtn').addEventListener('click', () => {
      this.handleAction('rest');
    });
  }

  handleAction(action) {
    let message = '';

    switch(action) {
      case 'feed':
        message = this.pet.feed();
        this.animateButton('feedBtn');
        break;
      case 'play':
        message = this.pet.play();
        this.animateButton('playBtn');
        break;
      case 'rest':
        message = this.pet.rest();
        this.animateButton('restBtn');
        break;
    }

    this.showMessage(message);
    this.updateUI();
  }

  animateButton(buttonId) {
    const button = document.getElementById(buttonId);
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 100);
  }

  showMessage(message) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.style.animation = 'none';
    setTimeout(() => {
      statusElement.style.animation = 'pulse 2s ease-in-out infinite';
    }, 10);
  }

  updateUI() {
    this.updateStat('hunger', this.pet.hunger);
    this.updateStat('energy', this.pet.energy);
    this.updateStat('health', this.pet.health);

    const status = this.pet.getStatus();
    document.getElementById('statusMessage').textContent = status;

    this.updatePetMood();
  }

  updateStat(statName, value) {
    const roundedValue = Math.round(value);
    document.getElementById(`${statName}Value`).textContent = roundedValue;
    document.getElementById(`${statName}Bar`).style.width = `${roundedValue}%`;
  }

  updatePetMood() {
    const petIcon = document.getElementById('petIcon');

    if (this.pet.health < 30) {
      petIcon.textContent = '😰';
    } else if (this.pet.health < 50) {
      petIcon.textContent = '😕';
    } else if (this.pet.hunger > 80) {
      petIcon.textContent = '😫';
    } else if (this.pet.energy < 20) {
      petIcon.textContent = '😴';
    } else if (this.pet.health > 90 && this.pet.hunger < 30 && this.pet.energy > 70) {
      petIcon.textContent = '😄';
    } else {
      petIcon.textContent = this.pet.icon;
    }
  }

  startSimulation() {
    this.updateInterval = setInterval(() => {
      this.pet.updateOverTime();
      this.updateUI();

      if (this.pet.health <= 0) {
        this.gameOver();
      }
    }, 3000);
  }

  gameOver() {
    clearInterval(this.updateInterval);
    document.getElementById('statusMessage').textContent = `${this.pet.name} needs immediate care! Refresh to start over.`;
    document.getElementById('petIcon').textContent = '💔';

    document.getElementById('feedBtn').disabled = true;
    document.getElementById('playBtn').disabled = true;
    document.getElementById('restBtn').disabled = true;

    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(btn => {
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PetSimulator();
});
