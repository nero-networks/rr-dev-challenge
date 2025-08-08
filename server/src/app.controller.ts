import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiParam, ApiParamOptions, ApiQuery, ApiQueryOptions } from '@nestjs/swagger';
import { VendoService } from './vendo/vendo.service';

const docs = {
  query: {
    name: 'query',
    description: 'Query string; Part of a stations name',
  } as ApiQueryOptions,

  duration: {
    name: 'duration',
    description: 'Amount in minutes of timetable data to show',
  } as ApiQueryOptions,

  station: {
    name: 'station',
    description: 'Alphanumeric station id; Station.id',
  } as ApiParamOptions,
};

@Controller('/')
export class AppController {
  constructor(private readonly vendo: VendoService) { }

  @Get('stations')
  @ApiQuery(docs.query)
  async getLocations(@Query('query') query: string) {
    //TODO: sanitize query reasonable
    return await this.vendo.findLocations(query);
  }

  @Get('timetable/:station')
  @ApiQuery(docs.duration)
  @ApiParam(docs.station)
  async getTimetable(
    @Param('station') station: string,
    @Query('duration', ParseIntPipe) duration: number,
  ) {
    //TODO: reject unresonable durations
    return await this.vendo.getTimetable(station, duration);
  }

  @Get('timetable/:station/arrivals')
  @ApiQuery(docs.duration)
  @ApiParam(docs.station)
  async getArrivals(
    @Param('station') station: string,
    @Query('duration', ParseIntPipe) duration: number,
  ) {
    //TODO: reject unresonable durations
    return await this.vendo.getArrivals(station, duration);
  }

  @Get('timetable/:station/departures')
  @ApiQuery(docs.duration)
  @ApiParam(docs.station)
  async getDepartures(
    @Param('station') station: string,
    @Query('duration', ParseIntPipe) duration: number,
  ) {
    //TODO: reject unresonable durations
    return await this.vendo.getDepartures(station, duration);
  }

  @Get('/status')
  status() {
    return 'Up';
  }
}
