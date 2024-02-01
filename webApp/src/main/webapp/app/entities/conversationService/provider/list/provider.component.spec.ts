import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProviderService } from '../service/provider.service';

import { ProviderComponent } from './provider.component';

describe('Provider Management Component', () => {
  let comp: ProviderComponent;
  let fixture: ComponentFixture<ProviderComponent>;
  let service: ProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'provider', component: ProviderComponent }]),
        HttpClientTestingModule,
        ProviderComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ProviderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProviderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProviderService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.providers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to providerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProviderIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProviderIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
