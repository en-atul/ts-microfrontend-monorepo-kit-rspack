#!/usr/bin/env node

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import oclif from '@oclif/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

oclif.run().then(oclif.flush).catch(oclif.handle); 