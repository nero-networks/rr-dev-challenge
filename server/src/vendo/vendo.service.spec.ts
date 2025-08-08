import { Test, TestingModule } from '@nestjs/testing';
import { DB_VENDO_CLIENT, VendoService } from './vendo.service';

describe('VendoService', () => {
  let service: VendoService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        VendoService,
        {
          provide: DB_VENDO_CLIENT,
          useValue: {
            /* TODO: mocks here */
          },
        },
      ],
    }).compile();

    service = app.get<VendoService>(VendoService);
  });

  it('should instanciate', () => {
    expect(service).toBeInstanceOf(VendoService);
  });

  // TODO more tests
});
