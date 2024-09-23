import { config } from '@dotenvx/dotenvx';
import path from 'node:path';

const devPath = path.join(import.meta.dirname, '.env.development');
const prodPath = path.join(import.meta.dirname, '.env.production');

const envFile = process.env.NODE_ENV === 'production' ? prodPath : devPath;

config({ path: envFile });
