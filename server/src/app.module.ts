import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DB_VENDO_CLIENT, VendoService } from './vendo/vendo.service';

import { createClient as createDbVendoClient, Profile } from 'db-vendo-client';
import { profile as dbVendoProfile } from 'db-vendo-client/p/dbnav/index';
const dbVendoUserAgent = 'roman+rr-challenge@de-meo.de';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    VendoService,
    {
      provide: DB_VENDO_CLIENT,
      useFactory: () =>
        createDbVendoClient(dbVendoProfile as Profile, dbVendoUserAgent),
    },
  ],
})
export class AppModule { }
