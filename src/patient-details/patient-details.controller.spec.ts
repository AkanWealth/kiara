import { Test, TestingModule } from '@nestjs/testing';
import { PatientDetailsController } from './patient-details.controller';

describe('PatientDetailsController', () => {
  let controller: PatientDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientDetailsController],
    }).compile();

    controller = module.get<PatientDetailsController>(PatientDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
