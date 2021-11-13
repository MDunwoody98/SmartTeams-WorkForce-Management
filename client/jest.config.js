module.exports = {
    // tell Jest to handle `*.vue` files
    moduleFileExtensions: ["js", "json", "vue"],
    watchman: false,
    moduleNameMapper: {
      "^~/(.*)$": "~/$1",
      "^~~/(.*)$": "~/$1",
      "^@/(.*)$": "~/$1"
    },
    verbose: true,
    testEnvironment: "jsdom",
    transform: {
      // process js with `babel-jest`
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
      // process `*.vue` files with `vue-jest`
      ".*\\.(vue)$": "vue-jest"
    },
    snapshotSerializers: ["jest-serializer-vue"],
    collectCoverage: true,
    collectCoverageFrom: [
      "~/components/**/*.vue",
      "~/pages/*.vue"
    ]
  };