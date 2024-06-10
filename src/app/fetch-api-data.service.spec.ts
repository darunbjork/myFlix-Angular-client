import { TestBed } from '@angular/core/testing';
import { FetchApiDataService } from './fetch-api-data.service';

/**
 * @description
 * Test suite for FetchApiDataService.
 */
describe('FetchApiDataService', () => {
  let service: FetchApiDataService;

  /**
   * Setup before each test case.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchApiDataService);
  });

  /**
   * Test case to check if the service is created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
