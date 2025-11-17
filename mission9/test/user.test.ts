// ----- Mocks MUST be declared before imports -----
// bcrypt mock
import bcrypt from "bcrypt";

// jest.mock은 import 뒤에도 동작 가능
jest.mock("bcrypt", () => ({
  compare: jest.fn(async (pw, hash) => {
   return true;
  }
),
  hash: jest.fn(async (pw) => `hashed_${pw}`),  
}));

import mockMethod from "./__mock__/prisma.js";
jest.mock("../src/lib/prisma", () => ({
  default: mockMethod,
}));

// generate_token mock

jest.mock('../src/lib/generate_token', () => ({
  __esModule: true,
  generateToken: jest.fn(() => ({
    refreshToken: "mock_refresh",
    accessToken: "mock_access",
  })),
}));



// prisma module mock will be replaced by our mockMethod below
import { describe, expect, test, beforeAll, beforeEach, afterEach, it } from '@jest/globals';
import mockData from './user.json' with { type: 'json' };
import { AuthService } from "../src/service/user.service.ts/auth.service.js";
import { PrismaClient } from "@prisma/client";

// prisma module mock (must exist after mockMethod import)
jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: mockMethod,
}));

describe("AuthService test", () => {
  let authService: AuthService;
  let hashedPassword: string
  const userId = 1;

  beforeEach(() => {
    // Clear previous mock calls & implementations to avoid test leakage
    jest.clearAllMocks();
  });

  beforeAll(async() => {
    // single instance used across tests
    authService = new AuthService(mockMethod as unknown as PrismaClient);

    hashedPassword = await bcrypt.hash(mockData.tempUser1.password, 10)
    // create a predictable hashed password using the mocked bcrypt.hash (returns `hashed_${pw}`)
    
    /*
    // Use mockResolvedValueOnce to be explicit — safer if tests added later
    mockMethod.user.findUnique.mockResolvedValue({
      id: userId,
      email: mockData.tempUser1.email,
      password: hashedPassword,
    });
    */

  });

  it("should login a user", async () => {
    // debug: confirm mock is set
    const { tempUser1 } = mockData;

    mockMethod.user.findUnique.mockResolvedValue({
      id: userId,
      email: tempUser1.email,
      password: hashedPassword
    });
    
    // Call login using the same authService instance
    const result = await authService.login(userId, {
      email: tempUser1.email,
      password: tempUser1.password,
    });

    // debug result
    expect(result).toHaveProperty("refreshToken", "mock_refresh");
    expect(result).toHaveProperty("accessToken", "mock_access");
  });

  it("should register a new user successfully",async () =>{
    // debug: confirm mock is set
    const { tempUser1 } = mockData;
    mockMethod.user.findUnique.mockResolvedValue(null)
    mockMethod.user.create.mockImplementation((data) => {
            return Promise.resolve({
              id: 7,
              email:data.data.email,
              password: data.data.password,
              nickname: data.data.nickname,
            })
          })
  
    const newUser = await authService.register({email: tempUser1.email, password: tempUser1.password, nickname: tempUser1.nickname})
   
    
    // debug result
      expect(mockMethod.user.findFirst).toHaveBeenCalledTimes(1);
      expect(mockMethod.user.create).toHaveBeenCalledTimes(1);
      expect(mockMethod.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            email: tempUser1.email,
            nickname: tempUser1.nickname,
            password: `hashed_${tempUser1.password}`, 
          },
        })
      );
      
    expect(newUser).toHaveProperty("email", tempUser1.email);
    expect(newUser).toHaveProperty("password", hashedPassword);
    expect(newUser).toHaveProperty("nickname", tempUser1.nickname);
  })

  it("should throw an error if the user (email) already exists",async () =>{
  // debug: confirm mock is set
  const { tempUser1 } = mockData;

   // debug result
  })
});

