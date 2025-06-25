// Main variables for the game
let playerName = "";
let netWorth = 1000;
let income = 0;
let age = 18;
let career = "";
let currentStage = "18-27";

// Personality traits (being tracked)
const personalityTraits = {
    risk_taker: 0,
    cautious: 0,
    luxury_spender: 0,
    frugal: 0,
    career_focused: 0,
    experience_seeker: 0
};

// DOM elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameContainer = document.getElementById('game-container');
const playerNameInput = document.getElementById('player-name');
const startGameButton = document.getElementById('start-game');
const currentAgeDisplay = document.getElementById('current-age');
const currentIncomeDisplay = document.getElementById('current-income');
const currentNetWorthDisplay = document.getElementById('current-net-worth');
const netWorthBar = document.getElementById('net-worth-bar');
const optionsPanel = document.getElementById('options-panel');
const messageLog = document.getElementById('message-log');

// Initialize the game
function initGame() {
    startGameButton.addEventListener('click', startGame);
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGame();
        }
    });
}

// Start the game
function startGame() {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert("Please enter your name to start the game!");
        return;
    }

    welcomeScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    // Add the greeting message
    addMessage(`👋 Hello ${playerName}! You are 18 years old and have a starting net worth of $${netWorth}.`, '#c91a63');
    
    // Start with initial choices
    initialChoice();
    updateUI();
}

// Update all UI elements with current game state
function updateUI() {
    currentAgeDisplay.textContent = age;
    currentIncomeDisplay.textContent = income;
    currentNetWorthDisplay.textContent = netWorth;

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
        progressPercentage = 0 + ((age - 18) / (36 - 18)) * 33;
    } else {
        progressPercentage = 0;
    }

    netWorthBar.style.width = `${progressPercentage}%`;
}

// Add message to message log
function addMessage(message, color) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message;
    if (color) {
        messageElement.style.color = color;
    }
    messageLog.appendChild(messageElement);
    messageLog.scrollTop = messageLog.scrollHeight;
}

// Clear options panel
function clearOptions() {
    optionsPanel.innerHTML = '';
}

// Add options to options panel
function addOptions(title, options) {
    clearOptions();
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    optionsPanel.appendChild(titleElement);
    
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option.text;
        button.addEventListener('click', option.action);
        optionsPanel.appendChild(button);
    });
}

// Initial career choice
function initialChoice() {
    addMessage("\nYou're 18, fresh out of high school, and the world is wide open before you. What's your next step?", "#c91a63");

    addOptions("Choose Your Path", [
        {
            text: "🦺 Get a Job (Earn now, but limited growth)",
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
    ]);
}

function getAJob() {
    const careers = {
        "Retail Worker": 20000, 
        "Fast Food Worker": 15000, 
        "Office Assistant": 40000, 
        "Factory Worker": 38000,
        "Service Worker": 28000,
        "Chef": 45000, 
        "Waiter": 30000, 
        "Dancer": 33000, 
        "Police Officer": 52000, 
        "Mechanic": 40000,
        "Receptionist": 35000
    };
    
    const careerNames = Object.keys(careers);
    career = careerNames[Math.floor(Math.random() * careerNames.length)];
    income = careers[career];
    netWorth += income;
    
    addMessage(`\nYou land a job as a ${career} and earn $${income} per year. The road ahead is uncertain, but it's a start!`, "#c91a63");
    addMessage(`Updated net worth: $${netWorth}`, "#5F9632");
    updateUI();
    
    // Proceed to next stage
    age18_27();
}

function goToCollege() {
    addMessage("\nYou enroll in college, ready to invest in your future. But tuition isn't cheap...", "#c91a63");
    
    addOptions("Choose your college!", [
        {
            text: "1. In-state (Costs $100,000, more limitations)",
            action: () => {
                personalityTraits.cautious++;
                netWorth -= 100000;
                addMessage("You choose an in-state school, saving money but limiting your networking potential.");
                updateUI();
                collegeJob();
            }
        },
        {
            text: "2. Out-of-state (Costs $160,000, more experiences)",
            action: () => {
                personalityTraits.experience_seeker++;
                netWorth -= 160000;
                addMessage("You go out of state, expanding opportunities but accumulating more debt.");
                updateUI();
                collegeJob();
            }
        }
    ]);
}

function collegeJob() {
    const betterJobs = {
        "Doctor": 350000, 
        "Lawyer": 140000, 
        "Corporate Manager": 100000, 
        "Actor": 80000, 
        "Software Engineer": 130000,
        "Accountant": 79000, 
        "Architect": 108000, 
        "Engineer": 116000, 
        "Astronaut": 152000, 
        "Pilot": 215000,
        "Professor": 180000, 
        "Veterinarian": 130000
    };
    
    const jobNames = Object.keys(betterJobs);
    career = jobNames[Math.floor(Math.random() * jobNames.length)];
    income = betterJobs[career];
    netWorth += income;
    
    addMessage(`\nAfter years of hard work, you graduate and land a job as a ${career}, earning $${income} per year!`, "#c91a63");
    addMessage("A job after college will usually be more lucrative than without college!");
    addMessage(`Make sure to keep a watch on your net worth above!`, "#5F9632");
    updateUI();
    
    // Proceed to next stage
    age18_27();
}

function startABusiness() {
    income = Math.floor(Math.random() * 350000) + 50000;
    netWorth -= 90000;
    netWorth += income;
    career = "Entrepreneur";
    
    addMessage("\nYour business starts generating $" + income + " per year after you spent $90000 on it. The journey ahead will test your resilience.", "#c91a63");
    addMessage(`Make sure to keep a watch on your net worth above!`, "#5F9632");
    updateUI();
    
    // Proceed to next stage
    age18_27();
}

// Age 18-27 decisions
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
                addMessage("Investing in stocks early helps your money grow over time through compounding, but you are neglecting important personal spendings such as transportation");
                updateUI();
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
                addMessage(`\nInvesting in education cost $${educationCost}, but your salary increased by $${salaryIncrease}`, "c91a63");
                addMessage("It's great that you realize that the learning doesn't stop after 18 years old. There's always place for promotions and growth!");
                updateUI();
                financialDecisions();
            }
        },
        {
            text: "💸 Invest in cryptocurrency (High risk, high reward)",
            action: () => {
                personalityTraits.risk_taker++;
                const cryptoInvestment = Math.floor(Math.random() * 20000) - 10000;
                netWorth += cryptoInvestment;
                addMessage(`\nYour crypto investment yielded $${cryptoInvestment}.`, "#c91a63");
                addMessage("This is a great and modern investment, and it will provide you wonders for the future! Make sure to take charge of life's necessities like transportation, however.");
                updateUI();
                financialDecisions();
            }
        }
    ]);
}

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
    ]);
}

function handleTransportChoice(choice) {
    const transportCosts = {
        "buycar": Math.floor(Math.random() * 40000) + 10000,
        "rentcar": Math.floor(Math.random() * 1500) + 500,
        "bike": Math.floor(Math.random() * 1500) + 500,
        "public": Math.floor(Math.random() * 400) + 100
    };
    
    netWorth -= transportCosts[choice];
    addMessage(`\nYou spent $${transportCosts[choice]} on transportation. This will definitely pay off in the long run though!`);
    updateUI();
    financialDecisions();
}

// Financial decisions that can be made at any stage
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
                ageTransition();
            }
        }
    ]);
}

// Handle age transitions
function ageTransition() {
    age += 9;
    
    // Check for random events
    randomEvents();
    
    if (age === 27) {
        currentStage = "28-37";
        addMessage(`\n📅 You are now settling into adulthood! Current net worth: $${netWorth}.`, "#5F9632");
        age28_37();
    } else if (age === 36) {
        currentStage = "38-47";
        addMessage(`\n📅 Halfway there! You're almost 40! Current net worth: $${netWorth}.`, '#5F9632');
        age38_47();
    } else if (age === 45) {
        currentStage = "48-57";
        addMessage(`\n📅 Age ${age}: You're in midlife! Current net worth: $${netWorth}.`, '#5F9632');
        age48_57();
    } else if (age === 54) {
        currentStage = "58-67";
        addMessage(`\n📅 Age ${age}: You're approaching retirement! Current net worth: $${netWorth}.`, "#5F9632");
        age58_67();
    } else if (age > 63) {
        endGame();
    } else {
        updateUI();
        financialDecisions();
    }
}

// Age 28-37 decisions
function age28_37() {
    addOptions("How wil you continue your story?", [
        {
            text: "🏘 Buy a house (Requires a down payment, but could appreciate)",
            action: () => {
                const houseCost = Math.floor(Math.random() * 500000) + 100000;
                netWorth -= houseCost;
                addMessage(`\nYou bought a house for $${houseCost}. Home sweet home!`, "#c91a63");
                addMessage("Buying a house provides stability, builds equity, and can be a valuable long-term investment!");
                updateUI();
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
                financialDecisions();
            }
        },
        {
            text: "👪 Start a family",
            action: () => {
                personalityTraits.risk_taker++;
                personalityTraits.experience_seeker++;
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
                financialDecisions();
            }
        }
    ]);
}

function presentFamilyOptions() {
    addOptions("Choose your family option!", [
        {
            text: "Have a wedding",
            action: () => {
                const cost = Math.floor(Math.random() * 490000) + 10000;
                netWorth -= cost;
                addMessage(`\nYou had a wedding and spent $${cost}. I heard it was fun!`, "#c91a63");
                updateUI();
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
                financialDecisions();
            }
        }
    ]);
}

// Age 38-47 decisions
function age38_47() {
    addOptions("What will you choose?", [
        {
            text: "🧾 Plan for retirement (Max out retirement savings)",
            action: () => {
                personalityTraits.cautious++;
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
                financialDecisions();
            }
        }
    ]);
}

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
    ]);
}

function handleRetirementChoice(choice) {
    const retireSavings = Math.floor(Math.random() * 40000) + 10000;
    netWorth += retireSavings;
    
    let message = "";
    if (choice === "maxretire") {
        message = `You maxed out retirement savings and added $${retireSavings}.`;
    } else if (choice === "401k") {
        message = `You invested in 401k and added $${retireSavings}.`;
        addMessage("A 401(k) is a retirement savings plan offered by employers that allows employees to contribute a portion of their salary");
    } else if (choice === "roth") {
        message = `You invested in Roth IRA and added $${retireSavings}.`;
        addMessage("A Roth IRA is a retirement savings account where you contribute after-tax income");
    } else if (choice === "mutual") {
        message = `You invested in mutual funds and added $${retireSavings}.`;
        addMessage("Mutual funds pool money from many investors to buy a mix of stocks or bonds, managed by experts.");
    }
    
    addMessage(message);
    updateUI();
    financialDecisions();
}

// Age 48-57 decisions
function age48_57() {
    addOptions("So, what's the next step?", [
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
                financialDecisions();
            }
        }
    ]);
}

// Age 58-67 decisions
function age58_67() {
    addOptions("How will you shape your future?", [
        {
            text: "💲 Plan for retirement (Max out retirement savings, invest in 401k)",
            action: () => {
                personalityTraits.cautious++;
                presentRetirementOptions()
            }
        },
        {
            text: "💪 Work part-time (Stay active and earn extra income)",
            action: () => {
                personalityTraits.experience_seeker++;
                personalityTraits.risk_taker++;
                income += 40000; // Part-time income
                netWorth += income;
                addMessage(`\nYou worked part-time and earned $${income}.`, "#c91a63");
                addMessage("Working part-time keeps you engaged and provides extra income for your retirement savings.");
                // Update UI and financial decisions
                updateUI();
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
                financialDecisions();
            }
        },
        {
            text: "🏠 Move to a retirement friendly area",
            action: () => {
                personalityTraits.frugal++;
                const retireSavings = Math.floor(Math.random() * 50000) + 10000;
                netWorth -= retireSavings;
                addMessage(`\nYou moved to a retirement-friendly area and spent $${retireSavings}. Look at you go!`, "#c91a63");
                updateUI();
                financialDecisions();
            }
        }
    ]);
}

// Random events that can happen during the game
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
    
    if (Math.random() < 0.3) {
        const event = events[Math.floor(Math.random() * events.length)];
        netWorth += event.amount;
        addMessage(`\nAt age ${age}: ${event.message} (Net worth: $${netWorth})`);
        updateUI();
    }
}

// End game function
function endGame() {
    addMessage("\n🎉 Congratulations! You've reached your golden years. Let's see how you've done.");
    addMessage(`YOUR FINAL NET WORTH: $${netWorth}!!!`, "#5F9632");
    
    // Personality summary
    addMessage("\nLet's pave your story and reflect on how your decisions/personality would have played out in the real world!");
    
    if (personalityTraits.risk_taker > personalityTraits.cautious) {
        addMessage("You are mostly a risk-taker! You embraced opportunities with high rewards but also high risks.");
        addMessage("This bold approach to finance is admired! However, make sure to prioritize financial stability as well, and balancing high-risk investments with stable assets (like bonds or index funds) might help secure this.", '#5F9632');
    } else {
        addMessage("You are quite financially cautious! You prioritized stability and long-term security over risky opportunities.");
        addMessage("You were secure, but taking calculated risks—such as small investments or side businesses—might have helped you grow your wealth without jeopardizing security.", '#5F9632');
    }
    
    if (personalityTraits.luxury_spender > personalityTraits.frugal) {
        addMessage("You tend to enjoy the finer things in life! You prioritized luxury and experiences over savings.");
        addMessage("While happiness is important, balancing spending with savings could improve financial security.", '#5F9632');
    } else {
        addMessage("You are a bit frugal and financially disciplined. You made sure to secure a stable future through careful spending.");
        addMessage("Your careful budgeting and disciplined saving have put you in a strong financial position! However, life isn't just about accumulating wealth - spending on experiences, personal growth, or even calculated investments are necessary to make your life more fulfilling!", '#5F9632');
    }
    
    if (personalityTraits.career_focused > personalityTraits.experience_seeker) {
        addMessage("You are quite career-driven! You prioritized financial growth and professional success.");
        addMessage("You worked hard to climb the career ladder, and it paid off! While income is key to financial success, making your money work for you through smart investments and passive income sources could have helped even more, and it is important to note that taking a break is also necessary!", '#5F9632');
    } else {
        addMessage("You love to value life experiences! You sought joy in travel, socializing, and meaningful moments over strict financial discipline.");
        addMessage("While your memories are invaluable and great for your mental health, a bit more financial planning—like setting aside funds for the future or investing could have ensured long-term security while still allowing for adventure.", '#5F9632');
    }
    
    addMessage("\nThank you for playing Head $tart!");
    
    // Add restart button
    addOptions("Game Over", [
        {
            text: "🔄 Play Again",
            action: () => {
                // Reset game state
                playerName = "";
                netWorth = 1000;
                income = 0;
                age = 18;
                career = "";
                currentStage = "18-27";
                
                // Reset personality traits
                for (const trait in personalityTraits) {
                    personalityTraits[trait] = 0;
                }
                
                // Clear messages
                messageLog.innerHTML = '';
                
                // Show welcome screen again
                welcomeScreen.classList.remove('hidden');
                gameContainer.classList.add('hidden');
                playerNameInput.value = '';
            }
        }
    ]);
}
document.addEventListener("DOMContentLoaded", function () {
  const helpBtn = document.getElementById("help-btn");
  const helpModal = document.getElementById("help-modal");
  const closeHelp = document.getElementById("close-help");
  const helpDetails = document.getElementById("help-details");

  helpBtn.addEventListener("click", () => {
    helpModal.classList.add("show");
  });

  closeHelp.addEventListener("click", () => {
    helpModal.classList.remove("show");
    helpDetails.innerHTML = "";
  });

  window.toggleHelpSection = function (topic) {
    const helpContent = {
      "how-to-play": " Make choices throughout life to grow your wealth and character.",
      "traits": " Traits like frugal, risk-taker, etc. are assigned to you based on how you play the game.",
      "net-worth": " Your net worth grows with income, investments, and savings.",
      "life-stages": " Life events happen at different ages: 18–27, 28–37, etc.",
      "tips": " Save early, spend wisely, and balance risk and reward."
    };
    helpDetails.innerHTML = `<p>${helpContent[topic]}</p>`;
  };
});

// Initialize the game when the script loads
initGame();