import { Test, TestingModule } from '@nestjs/testing';
import { PatientDetailsService } from './patient-details.service';

describe('PatientDetailsService', () => {
  let service: PatientDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientDetailsService],
    }).compile();

    service = module.get<PatientDetailsService>(PatientDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
