function mockUmi() {
  const original = jest.requireActual('umi');
  return {
    __esModule: true,
    ...original,
    connect: () => (component) => ({ WrappedComponent: component }),
  };
}
jest.mock('umi', () => mockUmi());
