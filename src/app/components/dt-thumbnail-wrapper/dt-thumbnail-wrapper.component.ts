import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {CustomElement} from '@set-social-services/common-custom-element';

/**
 * @author Bruno Ramirez
 */
@Component({
  selector: 'dt-thumbnail-wrapper',
  templateUrl: './dt-thumbnail-wrapper.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
@CustomElement('dt-thumbnail-wrapper')
export class DtThumbnailWrapperComponent {
  @Input() public content!: string;
  @Input() public config!: string;
}
