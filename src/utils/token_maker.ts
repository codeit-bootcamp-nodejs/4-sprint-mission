import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

const token = jwt.sign(
    { id: 1, email: 'user-a@test.com' },
    jwtSecret,
    { expiresIn: '7d' }
);

console.log('Generated JWT Token:');
console.log(token);