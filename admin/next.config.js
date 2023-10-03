const path = require('path')

module.exports = {
    output: 'export',
    trailingSlash: true,
    reactStrictMode: false,
    // experimental: {
    //   esmExternals: false,
    //   jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
    // },
    publicRuntimeConfig: {
        apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3013/api',
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
        }

        config.infrastructureLogging = {
            level: "error",
        };

        return config;
    },
}
