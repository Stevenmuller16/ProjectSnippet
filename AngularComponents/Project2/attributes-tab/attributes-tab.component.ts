import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserProduct, UserProductOptions } from '../../../core/data/product-data';
import { ProductType } from '../../../core/data/brand-data';

import { ProductTypeDataService } from '../../../shared/firebase-data-services/product-type-data.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'onboarding-attributes-tab',
  templateUrl: './attributes-tab.component.html',
  styleUrls: ['./attributes-tab.component.scss']
})
export class AttributesTabComponent implements OnInit {
  @Input('productData') productData: Partial<UserProduct> = null;

  @Output('back') onBack = new EventEmitter();
  @Output('next') onNext = new EventEmitter();
  @Output('skip') onSkip = new EventEmitter();

  model: {[key: string]: UserProductOptions} = {};
  brandProduct: ProductType = null;

  constructor(
    private productTypeService: ProductTypeDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.router.navigate([], {relativeTo: this.route, queryParams: { id: this.productData.id, tab: 'attributes' }, queryParamsHandling: 'merge'});
    const {brandId, brandProductId} = this.productData;

    this.productTypeService.getProductDetails(brandId, brandProductId)
      .pipe(untilDestroyed(this))
      .subscribe((brandProduct) => {
        this.brandProduct = brandProduct;

        Object.keys(brandProduct.options).map(x => {
          this.model[x] = {label: '', icon: '', value: !!this.productData.options && this.productData.options[x].value || ''};
          this.model[x].label = brandProduct.options[x].label;
          this.model[x].icon = brandProduct.options[x].icon;
        });
      });
  }

  back() {
    this.onBack.emit();
  }

  cancel() {
    this.router.navigateByUrl('/my-products');
  }

  next() {
    this.onNext.emit({...this.model});
  }

  skip() {
    this.onSkip.emit(true);
    this.next();
  }

  canSend() {
    let allOptionsFilled: boolean = true;
    Object.keys(this.model).map(key => {
      allOptionsFilled = allOptionsFilled && this.model[key].value !== '' && this.model[key].value !== null;
    });
    return allOptionsFilled || false;
  }

  getOptionKeysIfExist(options: object) {
    return options && Object.keys(options);
  }
}
