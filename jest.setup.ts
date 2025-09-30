// Force Jest to print console errors during tests
global.console = {
    ...console,
    error: (msg, ...args) => {
        process.stderr.write(`\nJest ConsoleError: ${msg}\n`);
        if (args.length) {
            process.stderr.write(args.map(a => JSON.stringify(a)).join(' ') + '\n');
        }
    },
};
