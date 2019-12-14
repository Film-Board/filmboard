import crypto from 'crypto';
import hasha from 'hasha';

export const hash = () => hasha(crypto.randomBytes(20).toString('hex'));
