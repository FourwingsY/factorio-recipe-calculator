import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

function findPackage(factorioCore: string, slug: string[]) {
  // for core.data / base.data
  if (slug[0] === 'core' || slug[0] === 'base') {
    return path.join(factorioCore, ...slug);
  }

  const packagePaths = [
    path.join(factorioCore, 'base'),
    path.join(factorioCore, 'core'),
    path.join(factorioCore, 'core/lualib'),
  ];
  for (const root of packagePaths) {
    const testPath = path.join(root, ...slug);
    if (fs.existsSync(testPath)) {
      return testPath;
    }
  }
  return '';
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { slug },
  } = req;

  const luaPath = findPackage(req.cookies.corePath, slug as string[]);
  const luaCode = fs.readFileSync(luaPath);
  res.end(luaCode);
};
