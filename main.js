const EspaniconSDK = require("@espanicon/espanicon-sdk");

async function main() {
  const sdk = new EspaniconSDK();
  const { getNetworkInfo, getPreps } = sdk;
  const { totalPower, rewardFund } = await getNetworkInfo();
  const preps = await getPreps();
  const activePreps = preps.preps.filter(x => x.grade != "0x2");
  const { Iglobal, Iprep, Iwage } = rewardFund;
  const totalPowerDecimal = parseInt(totalPower, 16) / 10 ** 18;
  const IglobalDecimal = parseInt(Iglobal, 16) / 10 ** 18;
  const IprepDecimal = parseInt(Iprep, 16) / 10000;
  const IwageDecimal = parseInt(Iwage, 16) / 10000;
  const realIwage = (IwageDecimal * IglobalDecimal) / activePreps.length;

  const earnings = [];
  for (const activePrep of activePreps) {
    const values = {
      name: activePrep.name,
      commissionRate:
        activePrep.commissionRate != null
          ? parseInt(activePrep.commissionRate, 16) / 10000
          : activePrep.commissionRate,
      power: parseInt(activePrep.power, 16) / 10 ** 18,
      monthlyFromIwage: realIwage
    };

    const fromIprep =
      (values.power * IglobalDecimal * IprepDecimal) / totalPowerDecimal;
    values.monthlyFromIprep =
      values.commissionRate != null
        ? fromIprep * values.commissionRate
        : fromIprep;
    values.monthlyEarnings = values.monthlyFromIprep + values.monthlyFromIwage;

    earnings.push(values);
  }

  console.log("Monthly earnings for Active ICON Validators");
  console.log(earnings);
}

main();
