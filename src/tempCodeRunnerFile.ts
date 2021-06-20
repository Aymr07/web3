        factory.on("PairCreated", async (token0, token1, pairAddress) => {
            console.log(`
        New pair detected
        =================
        token0: ${token0}
        token1: ${token1}
        pairAddress: ${pairAddress}
      `);
        })