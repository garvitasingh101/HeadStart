# Head $tart - Financial Storyline Game

## Overview

**Head $tart** is an interactive financial simulation game designed to teach players financial literacy through the lens of real-life decisions. Starting from age 18 and progressing to retirement, players navigate career choices, investments, and unpredictable life events that affect their net worth and quality of life. The web-based version features dynamic visual feedback on financial decisions.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [How to Play](#how-to-play)
4. [Controls](#controls)
5. [Roadmap](#roadmap)
6. [Technologies](#technologies)
7. [Documentation](#documentation)
8. [Key Functions](#key-functions)
9. [Progression](#progression)
10. [Contributors](#contributors)
11. [Libraries Used](#libraries-used)
12. [Dependencies](#dependencies)
13. [License](#license)

## Introduction

Head $tart simulates a player's financial journey through adulthood in a browser-based environment. Players make decisions about education, careers, and investments while responding to randomized life events. The interface provides immediate visual feedback on financial health and decision consequences.

## Features

- **Interactive Dashboard**: Visual display of assets, debts, and net worth
- **Career Simulation**: 10+ career paths with realistic progression
- **Investment Engine**: Stocks, real estate, and retirement accounts
- **Life Event System**: 50+ random events with financial impacts
- **Age Progression**: Decisions change based on life stage
- **Responsive Design**: Playable on desktop and mobile devices

## How to Play

1. **Launch**: Open index.html in any modern browser
2. **Create Profile**: Enter your character's starting details
3. **Make Decisions**: Choose education, jobs, and investments
4. **Manage Crises**: Respond to random life events
5. **Retire**: Reach age 65 and see your financial outcome

## Controls

- **Mouse/Touch**: Click or tap interface elements
- **Forms**: Enter amounts in financial input fields
- **Navigation**: Use on-screen buttons to progress
- **Settings**: Access help menu via gear icon

## Roadmap

### Planned Future Updates:
- **Multiplayer Mode**: Compete with friends' financial outcomes
- **Enhanced Visuals**: Animated financial charts and avatars
- **Expanded Events**: More life scenarios and economic conditions
- **Save System**: Local storage for continuing gameplay

## Technologies

- **HTML5**: Game structure and semantic markup
- **CSS3**: Responsive layout and animations
- **JavaScript**: Core game logic and interactivity
- **DOM API**: Dynamic interface updates
- **Flexbox/Grid**: Modern layout techniques

## Documentation

The game uses modular JavaScript architecture with separate files for core logic (script.js) and decision trees (q&a.js). Financial calculations run in real-time with visual feedback through DOM manipulation.

### Key Functions:
- **`initGame()`**: Initializes player state and UI components
- **`processDecision()`**: Handles player choices and consequences
- **`calculateNetWorth()`**: Updates all financial metrics
- **`triggerRandomEvent()`**: Executes life events from q&a.js
- **`renderDashboard()`**: Updates all visual financial displays

## Progression

Players experience:
1. **Early Adulthood (18-25)**: Education and career foundation
2. **Establishment (26-40)**: Wealth building and family decisions
3. **Peak Earnings (41-55)**: Investment optimization
4. **Pre-Retirement (56-65)**: Final financial preparations

## Contributors

This project welcomes contributions. Please:
1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## Libraries Used  
- [Chart.js](https://www.chartjs.org/) (MIT License)

## Dependencies  
This project uses no external libraries or copyrighted material.  

## License

This project is licensed under the [MIT License](LICENSE).

