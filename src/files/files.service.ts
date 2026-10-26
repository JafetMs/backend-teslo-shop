import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';


import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url)); // New Version


@Injectable()
export class FilesService {
  
    getStaticProductImage ( imageName: string) {
        const path = join(__dirname,'../../static/products', imageName);

        if ( !existsSync(path)) throw new BadRequestException(`No product found with image ${ imageName} `);
        
        return path;
    }
}
