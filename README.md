# ICON Validators Monthly Earnings Calculator

This repository contains a Node.js script that calculates monthly earnings for ICON Network validators and potential staking rewards for users.

## Installation

To execute the script, clone the repo, install the required packages and then execute the main script:

```bash
git clone git@github.com:icon-community/icon-validator-earnings-calculator.git
cd icon-validator-earnings-calculator
npm install
npm run start
```

## How Calculations Work

### Validator Earnings
Validator earnings come from two sources:
1. **Iwage**: Fixed amount distributed equally among all active validators
2. **Iprep**: Variable amount based on validator's power and commission rate

Total Monthly Earnings = Monthly Iwage + (Iprep * Commission Rate)

### Staker Rewards
Staker rewards come from the validator's Iprep rewards after the validator's commission:

1. Total Iprep Rewards = (Validator Power * Iglobal * Iprep) / Total Network Power
2. Validator Commission = Total Iprep Rewards * Commission Rate
3. Staker Pool = Total Iprep Rewards * (1 - Commission Rate)
4. Individual Staker Reward = Staker Pool * (Staker Amount / Total Delegation)

### APR Calculation
Annual Percentage Rate (APR) is calculated as:
```
APR = (Monthly Staker Reward * 12 / Stake Amount) * 100
```

## Output Format
The script provides detailed information for each validator:
- Main statistics (earnings, delegation, rewards, commission rate, APR)
- Detailed reward breakdown (Iprep, Iwage, commission, staker rewards)
- Best staking option based on highest APR

## Important Notes
- All calculations are based on current network conditions
- Actual rewards may vary based on network changes and validator performance
- Higher APR often correlates with lower total delegation
- Consider validator reliability and performance beyond just APR
