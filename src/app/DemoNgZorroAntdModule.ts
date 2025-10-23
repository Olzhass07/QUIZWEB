import { NgModule } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  exports: [
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzTableModule,
    NzFormModule,
    NzModalModule,
    NzDropDownModule,
    NzMenuModule,
    NzToolTipModule,
    NzSelectModule,
    NzCardModule,
    NzTabsModule,
    NzGridModule,
    NzLayoutModule,
    NzDividerModule,
  ],
})
export class DemoNgZorroAntdModule {}
