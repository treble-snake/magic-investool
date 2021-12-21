const {PHASE_PRODUCTION_SERVER} = require('next/constants');

module.exports = (phase, {defaultConfig}) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    const {prepareStorage} = require('@investool/engine/dist/cli/utils/prepareStorage');
    prepareStorage();
  }

  /** @type {import('next').NextConfig} */
  return {
    ...defaultConfig,
    reactStrictMode: true,
    swcMinify: true,
  };
};
