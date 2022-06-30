const environments = {};
environments.staging = {
    port: 5000,
    envName: 'staging',
    secretKey: 'hYddYldYFLAsl',
};
environments.production = {
    port: 6000,
    envName: 'production',
    secretKey: 'YlsYlaIlsY',
};

const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// console.log(typeof environments[currentEnv?.split(' ')[0]] === 'object')

const envToExport = typeof environments[currentEnv?.split(' ')[0]] === 'object' ? environments[currentEnv?.split(' ')[0]] : environments.staging;

module.exports = envToExport;