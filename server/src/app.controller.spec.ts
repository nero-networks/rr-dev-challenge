import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { VendoService } from './vendo/vendo.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: VendoService,
          useValue: {
            /* TODO: mocks here */
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should instanciate', () => {
    expect(appController).toBeInstanceOf(AppController);
  });

  // TODO more tests
});
