module.exports = {
  rootDir: '.',
  roots: ['./src'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/mock/fileMock.js',
    '^@/*components(.*)$': '<rootDir>/src/components$1',
    '^@common(.*)$': '<rootDir>/src/common$1',
    '^@/*utils(.*)$': '<rootDir>/src/utils$1',
    '^@@/(.*)$': '<rootDir>/src/.umi/$1',
  },
  testEnvironment: 'jsdom',
};
