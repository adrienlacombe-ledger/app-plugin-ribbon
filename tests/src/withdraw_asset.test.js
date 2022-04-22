import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, nano_models, txFromEtherscan } from './test.fixture';

const withdrawVaults = [
  // {
  //   name: "T-AAVE-C",
  //   // https://etherscan.io/tx/0xc72cb565ec57db33a2bc689319c0872738c37cce5c92c3d71e7b776f13bf5987
  //   rawTx: "0x02f892018201c58459682f00850a22bc93d18303b62394e63151a0ed4e5fafdc951d877102cf0977abd36580a4b6b55f250000000000000000000000000000000000000000000000038252536bd64eebebc001a0096fe1ddb48a9e927cada2c03b9df35b6012f3fbff951025e44b5ac3ad5d77f1a04dcd0366fe2a03b52f180123a568bd2c48036875f90565094aad4995fe36efd1",
  //   rightClicks: {
  //     S: 9,
  //     X: 5
  //   }
  // },
  // {
  //   name: "T-WBTC-C",
  //   // https://etherscan.io/tx/0xad4cc5484bdd68256ff7a987b85678886f0108a2fbe4f1f96f7b8786fd7c9213
  //   rawTx: "0x02f89001338459682f0085062e1ee4f483015c439465a833afdc250d9d38f8cd9bc2b1e3132db13b2f80a4b6b55f250000000000000000000000000000000000000000000000000000000000121731c001a0e4a295c678f181da338d48ae336a6e5d356524e61c95eb45021f17667c6ca7eaa07784b458b417f85a6326b803fb6af784b5d2f7ced9fa917dc5b2e80b022f5bb0",
  //   rightClicks: {
  //     S: 7,
  //     X: 5
  //   }
  // },
  // {
  //   name: "T-APE-C",
  //   // https://etherscan.io/tx/0x12ebfdfbb543054a4d9b93d73de3e8e3bcc772a879b510f29a8e080c5607093b
  //   rawTx: "0x02f89001148459682f0085078c10e012830197b394c0cf10dd710aefb209d9dc67bc746510ffd98a5380a4b6b55f250000000000000000000000000000000000000000000004ee5d807432da1bd2e9c080a0017799d2d1e9680f532ccd0257e2ca54d1e020d6c84a9b27da7ce3b54b3c2d89a03d51ae1426f0b81ccead49fb47b498dfd8617339b3d3139e1c04545bdfde015b",
  //   rightClicks: {
  //     S: 8,
  //     X: 5
  //   }
  // },
  // {
  //   name: "T-yvUSDC-P-ETH",
  //   // https://etherscan.io/tx/0x0c557ee26b4777a2c3c5e33863ca8fff16066976e15e10cbd6d1b04b2e971f3c
  //   rawTx: "0x02f89001318459682f008506fc23ac0083026b3e94cc323557c71c0d1d20a1861dc69c06c5f3cc962480a4b6b55f25000000000000000000000000000000000000000000000000000000174876e800c080a08931d39ce67a37f80a97b061b455c7a646defc2ba15bbfe8df56fe1f843c4445a034516babda81686b716b2efb9a783a7bea7ac34ccebdbbcd673658b09b33e0cf",
  //   rightClicks: {
  //     S: 5,
  //     X: 5
  //   }
  // },
  // {
  //   name: "T-ETH-C",
  //   // https://etherscan.io/tx/0x5a7be6a721aded0f6bc4166a1fc4d743db5a3707abe04b8386312c40fba0a68f
  //   rawTx: "0x02f878010f8459682f008504356baebe830176d39425751853eab4d0eb3652b5eb6ecb102a2789644b881c4a8e71ff8941f184f6326fb3c080a0e4fbc53114cd2af57274686e2b4c212f1b2509b8a0d03c93a83ca962ecdc7412a00857072724e4fd09fb09c0b2275e6d13d32e444963f335b75f290c81d880e9fb",
  //   rightClicks: {
  //     S: 9,
  //     X: 5
  //   }
  // },
  {
    name: "T-STETH-C",
    // https://etherscan.io/tx/0x96a58a8cf63f2ead24f54a412c3b763fe49ede3c24e5a14f79f702a64a72f58c
    rawTx: "0x02f892018202ca8459682f008518f17784e98301480d9453773e034d9784153471813dacaff53dbbb78e8c80a47e108d52000000000000000000000000000000000000000000000000b8f9b0dc11d8813ac001a0d783ab7c271edea387864dfad08d05d5f293a5ec3c4a1229d4339c4a9c609c73a064075b625f4163fdb913ed6be18359360ef5f0fe4f14848c6296144a9d917ec8",
    rightClicks: {
      S: 7,
      X: 5
    }
  },
]

// ONLY TEST FOR NANOS FOR NOW
const models = [nano_models[0]]
models.forEach(function (model) {
  for (let i = 0; i < withdrawVaults.length; i++) {
    const { name, rawTx, rightClicks } = withdrawVaults[i];

    // INITIATE WITHDRAWAL
    test('[Nano ' + model.letter + '] Initiate Withdraw ' + name, zemu(model, async (sim, eth) => {
      const serializedTx = txFromEtherscan(rawTx);
      const tx = eth.signTransaction(
        "44'/60'/0'/0",
        serializedTx,
      );

      const right_clicks = rightClicks[model.letter];

      // Wait for the application to actually load and parse the transaction
      await waitForAppScreen(sim);
      // Navigate the display by pressing the right button `right_clicks` times, then pressing both buttons to accept the transaction.
      await sim.navigateAndCompareSnapshots('.', model.name + '_' + name + "_initiate_withdraw", [right_clicks, 0]);

      await tx;
    }));

    // COMPLETE WITHDRAWAL
  }
});

