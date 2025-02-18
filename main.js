const EspaniconSDK = require("@espanicon/espanicon-sdk");

async function main() {
  const sdk = new EspaniconSDK();
  const { getNetworkInfo, getPreps } = sdk;
  const { totalPower, rewardFund } = await getNetworkInfo();
  const preps = await getPreps();
  const activePreps = preps.preps.filter((x) => x.grade != "0x2");
  const { Iglobal, Iprep, Iwage } = rewardFund;
  const totalPowerDecimal = parseInt(totalPower, 16) / 10 ** 18;
  const IglobalDecimal = parseInt(Iglobal, 16) / 10 ** 18;
  const IprepDecimal = parseInt(Iprep, 16) / 10000;
  const IwageDecimal = parseInt(Iwage, 16) / 10000;
  const realIwage = (IwageDecimal * IglobalDecimal) / activePreps.length;

  // Staking amount in ICX
  const stakingAmount = 10000;

  const earnings = [];
  for (const activePrep of activePreps) {
    const values = {
      name: activePrep.name,
      commissionRate:
        activePrep.commissionRate != null
          ? parseInt(activePrep.commissionRate, 16) / 10000
          : activePrep.commissionRate,
      power: parseInt(activePrep.power, 16) / 10 ** 18,
      delegated: parseInt(activePrep.delegated, 16) / 10 ** 18,
      monthlyFromIwage: realIwage,
    };

    // Calculate validator's total Iprep rewards
    const fromIprep =
      (values.power * IglobalDecimal * IprepDecimal) / totalPowerDecimal;

    // Calculate validator's earnings
    // Iwage goes 100% to validator
    // From Iprep, validator only gets their commission
    values.monthlyFromIprep =
      values.commissionRate != null
        ? fromIprep * values.commissionRate
        : fromIprep;
    values.monthlyEarnings = values.monthlyFromIprep + values.monthlyFromIwage;

    // Calculate staker's share of rewards
    // Stakers only share the Iprep rewards (not Iwage)
    // First, calculate the total Iprep rewards that go to all stakers (after commission)
    const totalStakerRewards =
      values.commissionRate != null
        ? fromIprep * (1 - values.commissionRate) // Only Iprep is shared
        : fromIprep;

    // Then, calculate this staker's share based on their proportion of NEW total delegation
    values.monthlyStakerReward =
      totalStakerRewards * (stakingAmount / (values.delegated + stakingAmount));

    // Calculate APR
    // Monthly rewards to yearly (x12) divided by stake amount, converted to percentage
    values.apr = ((values.monthlyStakerReward * 12) / stakingAmount) * 100;

    // Debug values will be stored in the values object
    values.totalIprepRewards = fromIprep;
    values.totalStakerRewards = totalStakerRewards;
    values.stakerProportion =
      stakingAmount / (values.delegated + stakingAmount);

    earnings.push(values);
  }

  console.log(
    `\n=== Monthly earnings for Active ICON Validators and Staker rewards for ${stakingAmount} ICX ===\n`,
  );
  earnings.forEach((prep) => {
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    );
    console.log(`📍 Validator: ${prep.name}`);
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
    );

    console.log("Main Statistics:");
    console.log(
      `• Validator Monthly Earnings:     ${prep.monthlyEarnings.toFixed(2)} ICX`,
    );
    console.log(
      `• Total Delegated to Validator:   ${prep.delegated.toFixed(2)} ICX`,
    );
    console.log(
      `• Monthly Staker Reward:          ${prep.monthlyStakerReward.toFixed(4)} ICX`,
    );
    console.log(
      `• Commission Rate:                ${prep.commissionRate * 100}%`,
    );
    console.log(`• Annual Percentage Rate (APR):   ${prep.apr.toFixed(2)}%\n`);

    console.log("Detailed Reward Breakdown:");
    console.log(
      `• Total Iprep rewards:            ${prep.totalIprepRewards.toFixed(2)} ICX`,
    );
    console.log(
      `• Validator Iwage:                ${prep.monthlyFromIwage.toFixed(2)} ICX`,
    );
    console.log(
      `• Validator commission from Iprep: ${prep.monthlyFromIprep.toFixed(2)} ICX`,
    );
    console.log(
      `• Total rewards for all stakers:  ${prep.totalStakerRewards.toFixed(2)} ICX`,
    );
    console.log(
      `• Staker proportion:              ${(prep.stakerProportion * 100).toFixed(2)}%\n`,
    );
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Find and display the best staking option
  const bestOption = earnings.reduce((best, current) =>
    current.apr > best.apr ? current : best,
  );

  console.log("\n🏆 Best Staking Option:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`• Validator:           ${bestOption.name}`);
  console.log(
    `• Monthly Reward:      ${bestOption.monthlyStakerReward.toFixed(4)} ICX`,
  );
  console.log(`• APR:                 ${bestOption.apr.toFixed(2)}%`);
  console.log(`• Commission Rate:     ${bestOption.commissionRate * 100}%`);
  console.log(`• Current Delegation:  ${bestOption.delegated.toFixed(2)} ICX`);
  console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
  );
}

main();
