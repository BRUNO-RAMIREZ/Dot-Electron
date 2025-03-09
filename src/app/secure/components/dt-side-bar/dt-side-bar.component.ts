import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'dt-side-bar',
  templateUrl: './dt-side-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtSideBarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
