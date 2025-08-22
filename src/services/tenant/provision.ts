import hostile from 'hostile';
import { promisify } from 'util';

const addHostEntry = async (domain: string): Promise<boolean> => {
  try {
    // Convert callback-based hostile methods to promise-based
    const set = promisify(hostile.set);
    
    // Add entry pointing to localhost
    await set('127.0.0.1', domain);
    
    return true;
  } catch (error) {
    console.error('Error adding host entry:', error);
    return false;
  }
};

export { addHostEntry };