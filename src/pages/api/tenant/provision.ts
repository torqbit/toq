import { NextApiRequest, NextApiResponse } from 'next';
import { addHostEntry } from '@/services/tenant/provision';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const result = await addHostEntry(domain);
    if (result) {
      res.status(200).json({ success: true, message: 'Host entry added successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to add host entry' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}