import { NextApiHandler } from 'next';
import fs from 'fs';

const handler: NextApiHandler = (req, res) => {
  const path = req.query.path as string;
  console.log(path);
  const file = fs.readFileSync(path);
  res.end(file);
};

export default handler;
