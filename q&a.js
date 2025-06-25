document.addEventListener('DOMContentLoaded', function() {
    const qaPairs = {
        //Head $tart Specific Question
        "net worth": "Your net worth is your (Total Assets - Total Debts. You can increase it by earning more, saving, and investing wisely!",
        "college": "Going to college increases your earning potential but it also requires student loans. The debt is sometimes worth it for high-paying careers, however.",
        "invest": "Start investing early because even small amounts grow over time! Make sure to have stocks, bonds, and real estate.",
        "debt": "Pay high-interest debt first, and avoid taking on new debt while paying off old ones.",
        "retire": "Try to save 15-20% of your income for retirement. The earlier you start, the less you'll need to save each month, and you should start planning for retirement early on!",
        "job": "Early jobs pay less but require no education. Higher education provides better-paying careers after college.",
        "business": "Starting a business is risky but sometimes, it can pay off big! Have savings as backup in case it fails though.",
        "save": "In real life, it is important to save at least 20% of your income. You should build an emergency fund of 3-6 months expenses.",
        "market crash": "Don't panic sell your stocks! The market fluctuates often, so stay invested for long-term benefits.",
        "save or spend": "Save at least 20% of income. Spend on important things first.",
        "best investment": "Stocks grow quick, real estate is stable, and bonds are safe after age 50.",
        "emergency fund": "Keep 3-6 months of expenses in savings for surprises.",
        "life stages": "Your game progresses through ages 18-27 (start), 28-37 (early life), 38-47 (peak), 48-57 (pre-retirement), 58-67 (retirement).",
        "personality traits": "Your choices affect whether you are a risk-taker/cautious, spender/saver, career-focused/experience-seeker. These influence events.",
        "job vs college": "A job means quick cash ($15-40k) but it also means limited growth. College can costs $100-160k but it unlocks $80-350k careers.",
        "start business": "Risky! You could earn big or lose it all. It is best if you have savings.",
        "best first choice": "College for long-term wealth, Job for quick cash, Business only if you're okay with risk.",
        "rent vs buy": "Rent is flexible and cheaper for the short-term, and buying is more expensive (costs $100-500k) but builds equity over time.",
        "random events": "These random events can be good (inheritance, promotion) or bad (accident, job loss).",
        "how age works": "Each choice advances time. From 18-27, then 28-37, etc. until you reach retirement.",
        "winning the game": "The goal is to have the highest net worth at retirement while also enjoying life's experiences and finding balance.",
        
        // General Financial Questions
        "financial literacy": "Understanding how money works, including budgeting, saving, investing, and managing debt, is crucial for making informed financial decisions.",
        "budgeting": "Creating a budget helps you track income and expenses, ensuring you live within your means and save for future goals.",
        "saving": "Saving money is essential for emergencies, future purchases, and long-term financial security. Aim to save at least 20% of your income.",
        "investing": "Investing allows your money to grow over time. Consider stocks, bonds, mutual funds, and real estate as potential investment options.",
        "why save early": "Money saved at 18 grows way more than money saved at 30 because of compound interest. It's your biggest advantage!",
        "should I go to college": "College helps for many careers, but trades can pay well too. Compare costs vs future earnings in your desired field.",
        "student loans": "Only borrow what you need. $30k in loans means $300/month payments for 10 years - could you afford that?",
        "credit score": "A good credit score (700+) helps you get loans with lower interest rates. Pay bills on time and keep debt low to improve it.",
        "first paycheck": "When you get paid, split it: 50% for needs, 30% for wants, 20% to save. Adjust as you go!",
        "job vs grades": "Working 10-15 hrs/week is okay, but don't let earnings hurt your grades - better grades mean better future jobs.",
        "game vs real life": "Like the game, real life rewards saving early. That $1,000 you save at 18 could be $10,000 by age 30!",
        "practice in game": "Try risky choices in the game first - you'll see why experts say to go slow in real life.",

    };

    const questionInput = document.getElementById('user-question');
    const askButton = document.getElementById('ask-button');
    const answerDisplay = document.getElementById('answer-display');

    function answerQuestion() {
        const question = questionInput.value.trim().toLowerCase();
        
        if (!question) {
            answerDisplay.innerHTML = '<p>Please enter a question.</p>';
            return;
        }

        let answer = "I'm not sure about that. Try asking about net worth, college, investing, debt, or retirement!";
        
        // Checks for the above keywords in the question
        for (const [keyword, response] of Object.entries(qaPairs)) {
            if (question.includes(keyword)) {
                answer = response;
                break;
            }
        }

        answerDisplay.innerHTML = `
            <p><strong>Your question:</strong> ${questionInput.value}</p>
            <p><strong>Answer:</strong> ${answer}</p>
        `;

        questionInput.value = '';
    }

    askButton.addEventListener('click', answerQuestion);
    questionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            answerQuestion();
        }
    });
});