import { jest } from '@jest/globals';

jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "log").mockImplementation(() => {});