import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const factorioRoot =
  '/Users/hs/Library/Application Support/Steam/steamapps/common/Factorio/factorio.app/Contents/data';

function findPackage(slug: string[]) {
  // for core.data / base.data
  if (slug[0] === 'core' || slug[0] === 'base') {
    return path.join(factorioRoot, ...slug);
  }

  const packagePaths = [
    path.join(factorioRoot, 'base'),
    path.join(factorioRoot, 'core'),
    path.join(factorioRoot, 'core/lualib'),
  ];
  for (const root of packagePaths) {
    const testPath = path.join(root, ...slug);
    if (fs.existsSync(testPath)) {
      console.log(testPath);
      return testPath;
    }
  }
  return '';
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { slug },
  } = req;

  const luaPath = findPackage(slug as string[]);
  const luaCode = fs.readFileSync(luaPath);
  res.end(luaCode);
};
