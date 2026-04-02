// config/environment.js
const prod = {
    fmiWorksUrl: "http://localhost:3000",
    ENV: "prod"
};

const staging = {
    fmiWorksUrl: "http://localhost:3000",
    ENV: "staging"
};
const ENV = process.env.TEST_ENV || "staging";
const environmentConfig = {
    prod,
    staging,
};
export default environmentConfig[ENV];