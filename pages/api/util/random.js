import crypto from 'crypto';

export const hash = () => crypto.randomBytes(20).toString('hex');
