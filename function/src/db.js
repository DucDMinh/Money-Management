import path from 'node:path';
import config from './config.js';
import { JsonStore } from './lib/jsonStore.js';

/**
 * users.json:        [{ id, username, name, passwordHash, createdAt }]
 * transactions.json: [{ id, userId, type, amount, category, note, date, createdAt, updatedAt }]
 */
export const usersStore = new JsonStore(path.join(config.dataDir, 'users.json'), []);
export const transactionsStore = new JsonStore(path.join(config.dataDir, 'transactions.json'), []);

export const initStores = () => Promise.all([usersStore.init(), transactionsStore.init()]);
