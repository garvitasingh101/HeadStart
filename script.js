// == MAIN GAME VARIABLES ==
let playerName = "";

// Financial and career tracking
let netWorth = 1000;
let income = 0;
let age = 18;
let career = "";

// Tracks game stage based on age ranges
let currentStage = "18-27";

// Used to draw the net worth progress chart over time
let netWorthHistory = [1000];
let ageHistory = [18];
let netWorthChart; // Chart.js instance

// == PERSONALITY TRAIT TRACKING ==
const personalityTraits = {
  risk_taker: 0,
  cautious: 0,
  luxury_spender: 0,
  frugal: 0,
  career_focused: 0,
  experience_seeker: 0
};

// == SAVE ARRAY SYSTEM ==
let saveStates = JSON.parse(localStorage.getItem("headstartGameSaves")) || [];

// == DOM ELEMENT REFERENCES ==
const welcomeScreen = document.getElementById('welcome-screen');
const gameContainer = document.getElementById('game-container');
const questionContainer = document.getElementById('question-container');

const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');

const currentAgeDisplay = document.getElementById('current-age');
const currentIncomeDisplay = document.getElementById('current-income');
const currentNetWorthDisplay = document.getElementById('current-net-worth');

const progressBar = document.getElementById('progress');
const optionsPanel = document.getElementById('options-panel');
const messageLog = document.getElementById('message-log');

// == TRIGGER START ON ENTER ==
playerNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    startGameButton.click();
  }
});

// == SAVE GAME ==
function saveGame() {
  if (currentStage === "gameover") return;

  const snapshot = {
    playerName,
    netWorth,
    income,
    age,
    career,
    currentStage,
    currentCheckpoint,
    personalityTraits: { ...personalityTraits },
    netWorthHistory: [...netWorthHistory],
    ageHistory: [...ageHistory]
  };

  saveStates.push(snapshot);
  if (saveStates.length > 5) saveStates.shift();
  localStorage.setItem("headstartGameSaves", JSON.stringify(saveStates));
  console.log("Game auto-saved!");
}

// == LOAD GAME ==
function loadGame() {
  saveStates = JSON.parse(localStorage.getItem("headstartGameSaves")) || [];
  const latestSave = saveStates[saveStates.length - 1];

  if (!latestSave) return;

  if (latestSave.age >= 68 || latestSave.currentStage === "gameover") {
    localStorage.removeItem("headstartGameSaves");
    addMessage("\nYour previous game has finished. Starting a new game!", "#d9534f");
    return;
  }

  playerName = latestSave.playerName || "";
  netWorth = latestSave.netWorth || 1000;
  income = latestSave.income || 0;
  age = latestSave.age || 18;
  career = latestSave.career || "";
  currentStage = latestSave.currentStage || "18-27";
  currentCheckpoint = latestSave.currentCheckpoint || "";

  Object.keys(personalityTraits).forEach(trait => {
    personalityTraits[trait] = latestSave.personalityTraits?.[trait] || 0;
  });

  netWorthHistory = latestSave.netWorthHistory || [netWorth]; /* Initialize with current net worth */
  ageHistory = latestSave.ageHistory || [age]; /* Initialize with current age */

  playerNameInput.value = playerName;
  startGameButton.disabled = false;

  addMessage(`\nSaved game found for ${playerName}. Enter your name and click Play to resume.`, "#5F9632");
}
// == START GAME ==
function startGame() {
  const inputName = playerNameInput.value.trim();

  if (!inputName) {
    addMessage("Please enter your name to start the game!");
    return;
  }

  let saves = JSON.parse(localStorage.getItem("headstartGameSaves")) || [];
  let latest = saves.find(save => save.playerName === inputName);

  // If a completed save is found, clear it and force a new game
  if (latest && (latest.age >= 63 || latest.currentStage === "gameover")) {
    addMessage("Your previous game was completed. Starting a fresh new game.", "#5F9632");

    // Remove only this player's save
    saves = saves.filter(save => save.playerName !== inputName);
    localStorage.setItem("headstartGameSaves", JSON.stringify(saves));

    latest = null;
    saveStates = [];
  }

  // ==== LOAD FROM SAVE ====
  if (latest) {
    playerName = latest.playerName;
    netWorth = latest.netWorth || 1000;
    income = latest.income || 0;
    age = latest.age || 18;
    career = latest.career || "";
    currentStage = latest.currentStage || "18-27";
    currentCheckpoint = latest.currentCheckpoint || "";

    Object.keys(personalityTraits).forEach(trait => {
      personalityTraits[trait] = latest.personalityTraits?.[trait] || 0;
    });

    netWorthHistory = latest.netWorthHistory || [netWorth];
    ageHistory = latest.ageHistory || [age];
  } else {
    // ==== START NEW GAME ====
    playerName = inputName;
    netWorth = 1000;
    income = 0;
    age = 18;
    career = "";
    currentStage = "18-27";
    currentCheckpoint = "";

    Object.keys(personalityTraits).forEach(trait => {
      personalityTraits[trait] = 0;
    });

    netWorthHistory = [netWorth];
    ageHistory = [age];
  }

  // ==== SHOW GAME UI ====
  welcomeScreen.classList.add('hidden'); /* Hide welcome screen */
  gameContainer.classList.remove('hidden');
  questionContainer.classList.remove('hidden');

  initializeChart();
  updateUI();

  addMessage(`👋 Hello ${playerName}, welcome to Head $tart! You are 18 years old and have a starting net worth of $${netWorth}.`, '#c91a63');
  addMessage("To view instructions and our purpose, click on the \"?\" button! To stop at any time, type \"STOP\". Good Luck!", '#c91a63');

  if (latest) {
    // Continue from saved stage
    switch (currentStage) {
      case "18-27": age18_27(); break;
      case "28-37": age28_37(); break;
      case "38-47": age38_47(); break;
      case "48-57": age48_57(); break;
      case "58-67": age58_67(); break;
      default: age18_27(); break;
    }
  } else {
    // New game: start with intro decision
    offerFirstPath();
  }
}
// == INIT GAME ==
function initGame() {
  startGameButton.addEventListener('click', startGame);
  playerNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') startGame();
  });
}
// == INIT GAME ==
function initGame() {
  startGameButton.addEventListener('click', startGame);
  playerNameInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') startGame();
  });
}

// == MESSAGE DISPLAY ==
function addMessage(message, color) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.textContent = message;
  if (color) messageElement.style.color = color;
  messageLog.appendChild(messageElement);
  messageLog.scrollTop = messageLog.scrollHeight;
}

// == UI UPDATER ==
function updateUI() {
  currentAgeDisplay.textContent = age; /* Update age display */
  currentIncomeDisplay.textContent = income;
  currentNetWorthDisplay.textContent = netWorth;

  ageHistory.push(age);
  netWorthHistory.push(netWorth);

  if (netWorthChart) {
    netWorthChart.data.labels = ageHistory;
    netWorthChart.data.datasets[0].data = netWorthHistory;
    netWorthChart.update();
  }

  let progressPercentage = 0;
  if (age >= 63) {
    progressPercentage = 100;
  } else if (age >= 54) {
    progressPercentage = 88 + ((age - 54) / (63 - 54)) * (100 - 88);
  } else if (age >= 45) {
    progressPercentage = 66 + ((age - 45) / (54 - 45)) * (88 - 66);
  } else if (age >= 36) {
    progressPercentage = 33 + ((age - 36) / (45 - 36)) * (66 - 33);
  } else if (age >= 18) {
    progressPercentage = ((age - 18) / (36 - 18)) * 33;
  }

  progressBar.style.width = `${progressPercentage}%`;
}

// == OPTIONS UTILITIES ==
function clearOptions() {
  optionsPanel.innerHTML = '';
}

function addOptions(title, options, inputType = "letter") {
  clearOptions();

  const titleElement = document.createElement('h2');
  titleElement.textContent = title;
  optionsPanel.appendChild(titleElement);

  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('options');

  options.forEach((option, index) => {
    const key = inputType === 'number' ? `${index + 1}` : String.fromCharCode(97 + index);
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('option');
    optionDiv.innerHTML = `
      <span class="option-key">${key})</span>
      <span class="option-text">${option.text}</span>
    `;
    optionsContainer.appendChild(optionDiv);
  });

  optionsPanel.appendChild(optionsContainer);

  const instruction = document.createElement('p');
  instruction.innerHTML = `<strong>Type the ${inputType === "number" ? "number" : "letter"} of your choice below:</strong>`;
  optionsPanel.appendChild(instruction);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = inputType === 'number' ? 'e.g. 1 or 2' : 'e.g. a or b';

  const submit = document.createElement('button');
  submit.textContent = 'Submit';
  submit.classList.add('submit-option');

  submit.addEventListener('click', () => {
    const val = input.value.trim().toLowerCase();
    if (val === "stop") {
      endGame("Game ended by user.");
      return;
    }

    let index = -1;
    if (inputType === "letter" && /^[a-z]$/.test(val)) {
      index = val.charCodeAt(0) - 97;
    } else if (inputType === "number" && /^[0-9]+$/.test(val)) {
      index = parseInt(val) - 1;
    }

    /* Validate the index */
    if (index >= 0 && index < options.length) {
      options[index].action();
    } else {
      addMessage("⛔ Invalid choice. Please enter a valid " + (inputType === "number" ? "number" : "letter") + ".", "red");
    }
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      submit.click();
    }
  });

  optionsPanel.appendChild(input);
  optionsPanel.appendChild(submit);
  input.focus();
}

// First Game Choice
function offerFirstPath() {
  addMessage("What's your first step?", "#c91a63");
  /* Possible options */
  addOptions("Choose Your Path", [
    {
      text: "🧺 Get a Job (Earn now, but limited growth)",
      action: () => {
        personalityTraits.career_focused++;
        getAJob();
      }
    },
    {
      text: "🎓 Go to College (Higher income, but debt)",
      action: () => {
        personalityTraits.cautious++;
        personalityTraits.career_focused++;
        goToCollege();
      }
    },
    {
      text: "💼 Start a Business (Risky but high reward)",
      action: () => {
        personalityTraits.risk_taker++;
        startABusiness();
      }
    }
  ], "letter");
}

// Player chooses to get a job instead of college or business
function getAJob() {
  const jobs = {
    "Retail Worker": 20000, "Fast Food Worker": 15000, "Office Assistant": 40000, "Factory Worker": 38000,
    "Service Worker": 28000, "Chef": 45000, "Waiter": 30000, "Dancer": 33000,
    "Police Officer": 52000, "Mechanic": 40000, "Receptionist": 35000
  };

  const names = Object.keys(jobs);
  career = names[Math.floor(Math.random() * names.length)];
  income = jobs[career];
  netWorth += income; // Income immediately added to net worth here

  addMessage(`\nYou land a job as a ${career} and earn $${income}/yr.`, "#c91a63");
  addMessage(`Make sure to keep a watch on your net worth above!`, "#5F9632");

  updateUI();
  saveGame();

  // Proceed to next decisions in 18-27 stage
  age18_27();
}

// Player chooses to attend college
function goToCollege() {
  addMessage("\nYou enroll in college, ready to invest in your future. But tuition isn't cheap...", "#c91a63");

  addOptions("Choose your college!", [
    {
      text: "In-state ($100K, fewer connections)",
      action: () => {
        personalityTraits.cautious++;
        netWorth -= 100000;
        addMessage("You chose in-state, saving money but limiting your networking.");
        updateUI();
        saveGame();
        collegeJob();
      }
    },
    {
      text: "Out-of-state ($160K, more opportunities)",
      action: () => {
        personalityTraits.experience_seeker++;
        netWorth -= 160000;
        addMessage("You chose out-of-state and gained more experiences but with higher debt.");
        updateUI();
        saveGame();
        collegeJob();
      }
    }
  ], "number");
}

// Player chooses to start a business
function startABusiness() {
  clearOptions();

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "14px";

  const question = document.createElement("p");
  question.textContent = "💼 You decide to start a business. How much are you willing to invest? ($1,000 - $100,000)";
  question.style.fontSize = "18px";
  question.style.fontWeight = "600";
  question.style.color = "#223";
  question.style.marginBottom = "8px";

  const input = document.createElement("input");
  input.type = "number";
  input.min = "1000";
  input.max = "100000";
  input.placeholder = "Enter amount";
  input.classList.add("investment-input");

  const button = document.createElement("button");
  button.textContent = "Invest";
  button.classList.add("option");

  button.addEventListener("click", () => {
    const value = parseFloat(input.value);
    if (isNaN(value) || value < 1000 || value > 100000) {
      addMessage("Invalid amount. Enter between $1,000 and $100,000.", "red");
      return;
    }
    netWorth -= value; // Deduct investment

    // Simulate business income - random component + 50% ROI as base
    income = Math.floor(value * 0.5) + Math.floor(Math.random() * 10000);

    addMessage(`You invested $${value} and launched your business. First-year earnings: $${income}.`, "#5F9632");

    updateUI();
    saveGame();

    // Continue to next 18-27 stage decisions
    age18_27();
  });

  container.appendChild(question);
  container.appendChild(input);
  container.appendChild(button);
  optionsPanel.appendChild(container);
}

// College leads to high-paying jobs
function collegeJob() {
  const betterJobs = {
    "Doctor": 350000, "Lawyer": 140000, "Corporate Manager": 100000, "Actor": 80000, "Software Engineer": 130000,
    "Accountant": 79000, "Architect": 108000, "Engineer": 116000, "Astronaut": 152000, "Pilot": 215000,
    "Professor": 180000, "Veterinarian": 130000
  };

  const jobNames = Object.keys(betterJobs);
  career = jobNames[Math.floor(Math.random() * jobNames.length)];
  income = betterJobs[career];
  netWorth += income;

  addMessage(`\nAfter years of hard work, you graduate and land a job as a ${career}, earning $${income} per year!`, "#c91a63");
  addMessage("A job after college will usually be more lucrative than without college!");
  addMessage("Make sure to keep a watch on your net worth above!", "#5F9632");

  updateUI();
  saveGame();

  age18_27();
}

// Game decisions during age 18–27
function age18_27() {
  addMessage("\nWelcome to adulthood! Your future starts here. What will you prioritize?", "#c91a63");

  addOptions("What will you prioritize?", [
    {
      text: "💰 Invest in stocks (High risk, high reward)",
      action: () => {
        personalityTraits.risk_taker++;
        const stockInvestment = Math.floor(Math.random() * 9000) + 1000;
        netWorth += stockInvestment;

        addMessage(`\nSmart move! Your stock investments earned you $${stockInvestment}.`, "#c91a63");
        addMessage("Investing in stocks early helps your money grow over time through compounding, but you are neglecting important personal spendings such as transportation.");
        addMessage(`Make sure to keep a watch on your net worth above!`, "#5F9632");

        updateUI();
        saveGame();

        financialDecisions();
      }
    },
    {
      text: "🚙 Decide on your primary mode of transportation",
      action: () => {
        addMessage("\nGood on you for getting started on what's a necessity!");
        presentTransportOptions();
      }
    },
    {
      text: "🎓 Further your education for career growth",
      action: () => {
        personalityTraits.career_focused++;
        const educationCost = Math.floor(Math.random() * 49000) + 1000;
        netWorth -= educationCost;
        const salaryIncrease = Math.floor(Math.random() * 10000) + 10000;
        income += salaryIncrease;

        addMessage(`\nInvesting in education cost $${educationCost}, but your salary increased by $${salaryIncrease}.`, "#c91a63");
        addMessage("It's great that you realize that the learning doesn't stop after 18 years old. There's always room for promotions and growth!");
        addMessage(`Make sure to keep a watch on your net worth above!`, "#5F9632");

        updateUI();
        saveGame();

        financialDecisions();
      }
    },
    {
      text: "💸 Invest in cryptocurrency (High risk, high reward)",
      action: () => {
        personalityTraits.risk_taker++;
        const cryptoInvestment = Math.floor(Math.random() * 20000) - 10000; // Can be negative (loss)
        netWorth += cryptoInvestment;

        addMessage(`\nYour crypto investment yielded $${cryptoInvestment}.`, "#c91a63");
        addMessage("This is a great and modern investment, and it will provide you wonders for the future! Make sure to take charge of life's necessities like transportation, however.");
        addMessage(`Make sure to keep a watch on your net worth above!`, "#5F9632");

        updateUI();
        saveGame();

        financialDecisions();
      }
    }
  ], "letter");
}

// Player selects transport method
function presentTransportOptions() {
  addOptions("Choose your transport!", [
    {
      text: "🚗 Buy a car (High cost, high convenience)",
      action: () => handleTransportChoice("buycar")
    },
    {
      text: "🚙 Rent a car (Moderate cost, no ownership)",
      action: () => handleTransportChoice("rentcar")
    },
    {
      text: "🚲 Buy a bike (Low cost, eco-friendly)",
      action: () => handleTransportChoice("bike")
    },
    {
      text: "🚌 Use public transport (Cheapest option)",
      action: () => handleTransportChoice("public")
    }
  ], "letter");
}

// Handles transport cost deduction and continues
function handleTransportChoice(choice) {
  const transportCosts = {
    "buycar": Math.floor(Math.random() * 40000) + 10000,
    "rentcar": Math.floor(Math.random() * 1500) + 500,
    "bike": Math.floor(Math.random() * 1500) + 500,
    "public": Math.floor(Math.random() * 400) + 100
  };

  netWorth -= transportCosts[choice];

  addMessage(`\nYou spent $${transportCosts[choice]} on transportation. This will definitely pay off in the long run though!`, "#c91a63");
  updateUI();
  saveGame();

  financialDecisions();
}

// Final decision step before aging up
function financialDecisions() {
  addMessage("\nWhat would you like to do this time?", "#c91a63");

  addOptions("What would you like to do?", [
    {
      text: "💰 Save 50% of your income",
      action: () => {
        const savings = income * 0.5;
        netWorth += savings;
        personalityTraits.cautious++;
        personalityTraits.frugal++;

        addMessage(`\nYou saved 50% of your income ($${savings}).`, "#c91a63");
        updateUI();
        saveGame();

        ageTransition();
      }
    },
    {
      text: "📈 Invest in stocks",
      action: () => {
        const investResult = [100, 5000, 10000, 50000, 25000, 20000][Math.floor(Math.random() * 6)];
        netWorth += investResult;
        personalityTraits.risk_taker++;

        addMessage(`\nYour stock investment returned $${investResult}.`, "#c91a63");
        updateUI();
        saveGame();

        ageTransition();
      }
    },
    {
      text: "🛍️ Spend on luxury items",
      action: () => {
        const luxuryResult = -[10000, 5000, 1000, 2000][Math.floor(Math.random() * 4)];
        netWorth += luxuryResult;
        personalityTraits.luxury_spender++;

        addMessage(`\nYou spent $${Math.abs(luxuryResult)} on luxury.`, "#c91a63");
        updateUI();
        saveGame();

        ageTransition();
      }
    },
    {
      text: "🏡 Save for retirement",
      action: () => {
        const retireSavings = [1000, 5000, 10000][Math.floor(Math.random() * 3)];
        netWorth += retireSavings;
        personalityTraits.cautious++;
        personalityTraits.frugal++;

        addMessage(`\nYou saved for retirement, adding $${retireSavings}.`, "#c91a63");
        updateUI();
        saveGame();

        ageTransition(); /* Transition to next age stage */
      }
    }
  ], "number");
}

// Advance to the next age bracket
function ageTransition() {
  age += 9;
  // randomEvents() can be implemented separately if needed

  saveGame();

  if (age >= 18 && age < 28) {
    currentStage = "18-27";
    addMessage(`\n📅 You are now in early adulthood! Current net worth: $${netWorth}.`, "#5F9632");
    age18_27();
  } else if (age >= 28 && age < 38) {
    currentStage = "28-37";
    addMessage(`\n📅 Settling into adulthood! Current net worth: $${netWorth}.`, "#5F9632");
    age28_37();
  } else if (age >= 38 && age < 48) {
    currentStage = "38-47";
    addMessage(`\n📅 Halfway there! You're almost 40! Current net worth: $${netWorth}.`, "#5F9632");
    age38_47();
  } else if (age >= 48 && age < 58) {
    currentStage = "48-57";
    addMessage(`\n📅 Age ${age}: You're in midlife! Current net worth: $${netWorth}.`, "#5F9632");
    age48_57();
  } else if (age >= 58 && age < 68) {
    currentStage = "58-67";
    addMessage(`\n📅 Age ${age}: You're approaching retirement! Current net worth: $${netWorth}.`, "#5F9632");
    age58_67();
  } else {
    age = 68;
    endGame();
  }
}

// Beginning of age 28–37 decision tree
function age28_37() {
  addOptions("How will you continue your story?", [
    {
      text: "🏘 Buy a house (Requires a down payment, but could appreciate)",
      action: () => {
        const houseCost = Math.floor(Math.random() * 500000) + 100000;
        netWorth -= houseCost;
        addMessage(`\nYou bought a house for $${houseCost}. Home sweet home!`, "#c91a63");
        addMessage("Buying a house provides stability, builds equity, and can be a valuable long-term investment!");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "🏡 Rent a house (Less expensive, but no property appreciation)",
      action: () => {
        personalityTraits.frugal++;
        const rentCost = Math.floor(Math.random() * 15000) + 5000;
        netWorth -= rentCost;
        addMessage(`\nYou rented a house for $${rentCost}. Home sweet home!`, "#c91a63");
        addMessage("Renting a house offers flexibility, lower upfront costs, and fewer maintenance responsibilities.");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "👪 Start a family",
      action: () => {
        personalityTraits.risk_taker++;
        personalityTraits.experience_seeker++;
        saveGame();
        presentFamilyOptions();
      }
    },
    {
      text: "📋 Climb the career ladder (Could lead to salary increases)",
      action: () => {
        personalityTraits.career_focused++;
        const salaryIncrease = Math.floor(Math.random() * 10000) + 10000;
        netWorth += salaryIncrease;
        income += salaryIncrease;
        addMessage(`\nYou focused on advancing your career and received a salary increase of $${salaryIncrease}.`, "#c91a63");
        updateUI();
        saveGame();
        financialDecisions();
      }
    }
  ], "letter");
}

// Offers options to start a family, each with a different financial cost
function presentFamilyOptions() {
  addOptions("Choose your family option!", [
    {
      text: "Have a wedding",
      action: () => {
        const cost = Math.floor(Math.random() * 490000) + 10000;
        netWorth -= cost;
        addMessage(`\nYou had a wedding and spent $${cost}. I heard it was fun!`, "#c91a63");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "Have a child",
      action: () => {
        const cost = Math.floor(Math.random() * 80000) + 10000;
        netWorth -= cost;
        addMessage(`\nYou had a child and spent $${cost}. Treasure these years!`, "#c91a63");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "Get a pet",
      action: () => {
        const cost = Math.floor(Math.random() * 4000) + 1000;
        netWorth -= cost;
        addMessage(`\nYou got a pet and spent $${cost}. What will you name it?`, "#c91a63");
        updateUI();
        saveGame();
        financialDecisions();
      }
    }
  ], "letter");
}

// Life choices during age 38–47
function age38_47() {
  addOptions("What will you choose?", [
    {
      text: "🧾 Plan for retirement (Max out retirement savings)",
      action: () => {
        personalityTraits.cautious++;
        saveGame();
        presentRetirementOptions();
      }
    },
    {
      text: "🥗 Invest in your health (Gym membership, healthy food)",
      action: () => {
        personalityTraits.experience_seeker++;
        const healthCost = Math.floor(Math.random() * 4000) + 1000;
        netWorth -= healthCost;
        addMessage(`\nYou invested in your health and spent $${healthCost}. You're better off both healthy and financially aware!`, "#c91a63");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "💵 Pay off your mortgage (Reduce debt, increase net worth)",
      action: () => {
        personalityTraits.frugal++;
        const mortgagePayment = Math.floor(Math.random() * 40000) + 10000;
        netWorth -= mortgagePayment;
        addMessage(`\nYou paid off your mortgage and spent $${mortgagePayment}.`, "#c91a63");
        addMessage("Paying off your mortgage means less debt and more financial freedom.");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "🌴 Take a vacation (Relax and unwind)",
      action: () => {
        personalityTraits.experience_seeker++;
        const vacationCost = Math.floor(Math.random() * 4000) + 1000;
        netWorth -= vacationCost;
        addMessage(`\nYou took a vacation and spent $${vacationCost}.`, "#c91a63");
        addMessage("A vacation gives you a break from routine, helps reduce stress, and allows you to relax or explore new places.");
        updateUI();
        saveGame();
        financialDecisions();
      }
    }
  ], "letter");
}

// Provides different retirement investment options
function presentRetirementOptions() {
  addOptions("Retirement Options", [
    {
      text: "Max out retirement savings",
      action: () => handleRetirementChoice("maxretire")
    },
    {
      text: "Invest in 401k",
      action: () => handleRetirementChoice("401k")
    },
    {
      text: "Invest in Roth IRA",
      action: () => handleRetirementChoice("roth")
    },
    {
      text: "Invest in mutual funds",
      action: () => handleRetirementChoice("mutual")
    }
  ], "letter");
}

// Handles result of chosen retirement savings method
function handleRetirementChoice(choice) {
  const retireSavings = Math.floor(Math.random() * 40000) + 10000;
  netWorth += retireSavings;

  let message = "";
  if (choice === "maxretire") {
    message = `You maxed out retirement savings and added $${retireSavings}.`;
  } else if (choice === "401k") {
    message = `You invested in 401k and added $${retireSavings}.`;
    addMessage("A 401(k) is a retirement savings plan offered by employers that allows employees to contribute a portion of their salary.");
  } else if (choice === "roth") {
    message = `You invested in Roth IRA and added $${retireSavings}.`;
    addMessage("A Roth IRA is a retirement savings account where you contribute after-tax income.");
  } else if (choice === "mutual") {
    message = `You invested in mutual funds and added $${retireSavings}.`;
    addMessage("Mutual funds pool money from many investors to buy a mix of stocks or bonds, managed by experts.");
  }

  addMessage(message, "#c91a63");
  updateUI();
  saveGame();
  financialDecisions();
}

// Life choices during age 48–57
function age48_57() {
  addOptions("So, what's the next step? ", [
    {
      text: "🧐 Expand investment portfolio",
      action: () => {
        personalityTraits.risk_taker++;
        personalityTraits.career_focused++;
        const investment = Math.floor(Math.random() * 70000) + 10000;
        netWorth += investment;
        addMessage(`\nYou chose to start a new investment portfolio. Your investments grow and you accumulate $${investment}.`, "#c91a63");
        addMessage("An investment portfolio helps spread risk and grow your money over time.");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "🌴 Take a career break",
      action: () => {
        personalityTraits.experience_seeker++;
        personalityTraits.risk_taker++;
        const breakCost = Math.floor(Math.random() * 40000) + 10000;
        netWorth -= breakCost;
        addMessage(`\nYou chose to take a career break. Take the time off and enjoy!`, "#c91a63");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "🚢 Buy a luxury asset",
      action: () => {
        personalityTraits.luxury_spender++;
        const luxuryAssetCost = Math.floor(Math.random() * 40000) + 10000;
        netWorth -= luxuryAssetCost;
        addMessage(`\nYou bought a luxury asset and spent $${luxuryAssetCost}.`, "#c91a63");
        addMessage("It's always important to consider your happiness first. Just work won't do any good!");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "💰 Aggressively save for retirement",
      action: () => {
        personalityTraits.cautious++;
        const retireSavings = Math.floor(Math.random() * 40000) + 10000;
        netWorth += retireSavings;
        addMessage(`\nYou saved aggressively for retirement and added $${retireSavings}. Look at you go!`, "#c91a63");
        updateUI();
        saveGame();
        financialDecisions();
      }
    }
  ], "letter");
}
// Life choices during age 58–67
function age58_67() {
  addOptions("How will you shape your future?", [
    {
      text: "💲 Plan for retirement (Max out retirement savings, invest in 401k)",
      action: () => {
        personalityTraits.cautious++;
        saveGame();
        presentRetirementOptions(); // Reuse earlier options
      }
    },
    {
      text: "💪 Work part-time (Stay active and earn extra income)",
      action: () => {
        personalityTraits.experience_seeker++;
        personalityTraits.risk_taker++;
        const partTimeIncome = 40000;
        income += partTimeIncome;
        netWorth += partTimeIncome;
        addMessage(`\nYou worked part-time and earned $${partTimeIncome}.`, "#c91a63");
        addMessage("Working part-time keeps you engaged and provides extra income for your retirement savings.");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "🌍 Trip around the globe (Spend your savings on adventures)",
      action: () => {
        personalityTraits.experience_seeker++;
        const travelCost = Math.floor(Math.random() * 40000) + 10000;
        netWorth -= travelCost;
        addMessage(`\nYou traveled the world and spent $${travelCost}.`, "#c91a63");
        addMessage("It's always important to consider your happiness first. Just work won't do any good!");
        updateUI();
        saveGame();
        financialDecisions();
      }
    },
    {
      text: "🏠 Move to a retirement friendly area",
      action: () => {
        personalityTraits.frugal++;
        const movingCost = Math.floor(Math.random() * 50000) + 10000;
        netWorth -= movingCost;
        addMessage(`\nYou moved to a retirement-friendly area and spent $${movingCost}. Look at you go!`, "#c91a63");
        updateUI();
        saveGame();
        financialDecisions();
      }
    }
  ], "letter");
}

// Initializes the net worth line chart using Chart.js
function initializeChart() {
  const chart = document.getElementById('net-worth-chart');

  // Destroy existing chart instance if present to avoid duplicates
  if (netWorthChart) {
    netWorthChart.destroy();
  }

  netWorthChart = new Chart(chart, {
    type: 'line',
    data: {
      labels: ageHistory, // X-axis: Player's age at each stage
      datasets: [{
        label: 'Net Worth',
        data: netWorthHistory, // Y-axis: Net worth corresponding to age
        borderColor: '#5F9632', // Green border for line
        backgroundColor: 'rgba(95, 150, 50, 0.1)',
        borderWidth: 2,
        tension: 0.1, // Line curve smoothing
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Makes chart fit its container
      plugins: {
        legend: { display: false }, // Hides legend
        tooltip: {
          callbacks: {
            // Custom tooltip label format
            label: function(context) {
              return `Net Worth: $${context.raw.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6 // Limits clutter on x-axis
          }
        },
        y: {
          beginAtZero: false,
          ticks: {
            // Formats y-axis ticks with K/M suffixes
            callback: function(value) {
              if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(1) + 'M';
              if (value >= 1_000) return '$' + (value / 1_000).toFixed(0) + 'K';
              return '$' + value;
            }
          }
        }
      }
    }
  });
}

// Occasionally triggers a random life event that affects net worth
function randomEvents() {
  const events = [
    { message: "🎉 You won a lottery!", amount: 50000 },
    { message: "🎊 You got a promotion!", amount: 20000 },
    { message: "💸 You had an unexpected medical expense.", amount: -10000 },
    { message: "🎉 You received an inheritance.", amount: 30000 },
    { message: "📉 You faced a job loss.", amount: -20000 },
    { message: "😞 You had a car accident.", amount: -15000 },
    { message: "🤑 Side business took off!", amount: 10000 },
    { message: "📉 Stock market crash! You lost some money", amount: -5000 },
    { message: "🏠 Unexpected home repair costs.", amount: -8000 },
    { message: "📉 Economic recession! Your investments took a hit.", amount: -12000 }
  ];

  // 30% chance of a random event occurring
  if (Math.random() < 0.3) {
    const event = events[Math.floor(Math.random() * events.length)];
    netWorth += event.amount;

    // Show event result to the player with formatted net worth
    addMessage(`\nAt age ${age}: ${event.message} (Net worth: $${netWorth.toLocaleString()})`);

    saveGame(); // Persist change
    updateUI();
  }
}

// End game function
function endGame() {
  currentStage = "gameover";
  saveGame();

  // Announce retirement
  addMessage("\n🎉 Congratulations! You've reached your golden years. Let's see how you've done.");

  // Show final net worth with formatting
  addMessage(`YOUR FINAL NET WORTH: $${netWorth.toLocaleString()}!!!`, "#5F9632");

  // Introduce personality reflection phase
  addMessage("\nLet's pave your story and reflect on how your decisions/personality would have played out in the real world!");

  reflectOnPersonality(); // Analyzes player choices
  addMessage("\nThank you for playing Head $tart!");
  gameOver(); // Offers replay option
}

// Reviews personality traits and assigns a title based on game decisions
function reflectOnPersonality() {
  // Risk tolerance analysis
  if (personalityTraits.risk_taker > personalityTraits.cautious) {
    addMessage("You are mostly a risk-taker! Your adventurous choices often led to exciting outcomes.", '#5F9632');
    addMessage("This bold approach to finance is admired! However, make sure to prioritize financial stability as well, and balancing high-risk investments with stable assets (like bonds or index funds) might help secure this.", '#000000');
  } else {
    addMessage("You are quite financially cautious! You preferred steady and secure paths.", '#5F9632');
    addMessage("You were secure, but taking calculated risks—such as small investments or side businesses—might have helped you grow your wealth without jeopardizing security.", '#000000');
  }

  // Spending habits analysis
  if (personalityTraits.luxury_spender > personalityTraits.frugal) {
    addMessage("You tend to enjoy the finer things in life! You value comfort and luxury.", '#5F9632');
    addMessage("While happiness is important, balancing spending with savings could improve financial security.", '#000000');
  } else {
    addMessage("You are a bit frugal and financially disciplined. You carefully manage your resources.", '#5F9632');
    addMessage("Your careful budgeting and disciplined saving have put you in a strong financial position! However, life isn’t just about accumulating wealth - spending on experiences, personal growth, or even calculated investments are necessary to make your life more fulfilling!", '#000000');
  }

  // Career vs life experience analysis
  if (personalityTraits.career_focused > personalityTraits.experience_seeker) {
    addMessage("You are quite career-driven! Climbing the ladder was your focus.", '#5F9632');
    addMessage("You worked hard to climb the career ladder, and it paid off! While income is key to financial success, making your money work for you through smart investments and passive income sources could have helped even more, and it is important to note that taking a break is also necessary!", '#000000');
  } else {
    addMessage("You love to value life experiences! You prioritized adventure and exploration.", '#5F9632');
    addMessage("While your memories are invaluable and great for your mental health, a bit more financial planning—like setting aside funds for the future or investing could have ensured long-term security while still allowing for adventure.", '#000000');
  }

  // Assign a personality-based title for fun
  let title = "";
  if (personalityTraits.risk_taker > 5 && personalityTraits.luxury_spender > 5) {
    title = "Title Earned: The YOLO Spender";
  } else if (personalityTraits.cautious > 5 && personalityTraits.frugal > 5) {
    title = "Title Earned: The Safe Strategist";
  } else if (personalityTraits.experience_seeker > 5 && personalityTraits.risk_taker > 4) {
    title = "Title Earned: The Adventurous Explorer";
  } else if (personalityTraits.career_focused > 6) {
    title = "Title Earned: The Career Climber";
  } else if (personalityTraits.frugal > 3 && personalityTraits.experience_seeker > 3) {
    title = "Title Earned: The Balanced Planner";
  } else {
    title = "Title Earned: The Reflective Learner";
  }

  addMessage(`\n${title}`, "#d4ab24"); // Golden text
  saveGame();
}

// Resets the entire game state and offers to restart
function gameOver() {
  addOptions("Game Over", [
    {
      text: "🔄 Play Again",
      action: () => {
        // Reset core variables for a fresh new game
        playerName = "";
        netWorth = 1000;
        income = 0;
        age = 18;
        career = "";
        currentStage = "18-27";

        // Reset personality traits
        Object.keys(personalityTraits).forEach(trait => {
          personalityTraits[trait] = 0;
        });

        // Reset tracking arrays
        netWorthHistory = [netWorth];
        ageHistory = [age];

        // Destroy old chart instance if exists
        if (netWorthChart) {
          netWorthChart.destroy();
          netWorthChart = null;
        }

        // Remove old canvas and create a new one
        const chartContainer = document.getElementById('chart-container');
        if (chartContainer) {
          const oldChart = document.getElementById('net-worth-chart');
          if (oldChart) oldChart.remove();

          const newCanvas = document.createElement('canvas');
          newCanvas.id = 'net-worth-chart';
          chartContainer.appendChild(newCanvas);
        } else {
          console.error("Error: chart-container element not found in the DOM!");
        }

        // Clear message log
        messageLog.innerHTML = '';

        // Show welcome screen and hide game UI containers to force name input
        welcomeScreen.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        questionContainer.classList.add('hidden');

        // Clear player name input field
        playerNameInput.value = '';

        // Initialize chart on new canvas 
        initializeChart();
      }
    }
  ], "letter");
}

// Adds interactivity to the help menu sidebar
document.addEventListener("DOMContentLoaded", () => {
  const helpBtn = document.getElementById("help-btn");
  const helpSidebar = document.getElementById("help-sidebar");
  const closeHelp = document.getElementById("close-help");

  // Open Help Sidebar
  helpBtn.addEventListener("click", () => {
    helpSidebar.classList.remove("hidden");
  });

  // Close Help Sidebar
  closeHelp.addEventListener("click", () => {
    helpSidebar.classList.add("hidden");
  });

  // Enable dropdown functionality inside help menu
  const helpItems = document.querySelectorAll(".help-item");
  helpItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("data-id");
      const dropdown = document.getElementById(id);
      if (!dropdown) return; // Safety check

      const isOpen = !dropdown.classList.contains("hidden");

      // Toggle visibility and style
      dropdown.classList.toggle("hidden", isOpen);
      item.classList.toggle("expanded", !isOpen);
    });
  });

  // Automatically load saved game if it exists
  loadGame();

  // Initialize UI/game setup
  initGame();
});