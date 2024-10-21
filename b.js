const { swcDir } = require('@swc/cli');
const styles = {
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m',    // Reset to default
    info: '\x1b[34m'     // Blue
};
const swcOptions = {
    jsc: {
        target: 'es2022',
        externalHelpers: true,
    },
    module: {
        type: 'commonjs',
    },
    sourceMaps: false,
};

swcDir({
    cliOptions: {
        outDir: './build',
        watch: true,
        filenames: ['./src'],
        extensions: ['.ts'],
        stripLeadingPaths: true,
    },
    swcOptions,
    callbacks: {
        onSuccess: output => {
            console.log(`${styles.success}Compilation successful!${styles.reset}`);
            console.log(`${styles.info}Duration: ${output.duration.toFixed(2)} ms`);
            console.log(`${styles.info}Compiled Files: ${output.compiled}`);
            console.log(`${styles.info}Copied Files: ${output.copied}${styles.reset}`);
            process.exit(0);
        },
        onFail: e => {
            console.log(`${styles.error}Compilation failed!${styles.reset}`);
            console.log(`${styles.info}Duration: ${output.duration.toFixed(2)} ms`);
            console.log(`${styles.info}Compiled Files: ${output.compiled}`);
            console.log(`${styles.info}Copied Files: ${output.copied}${styles.reset}`);
            process.exit(0);
        },
        onWatchReady: () => { },
    },
});