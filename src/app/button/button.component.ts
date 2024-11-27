// button.component.ts
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() route: string = '';
  @Input() color: string = '#4CAF50';
  @Input() disabledColor: string = '#CCCCCC';
  @Input() disabled: boolean = false;
  @Input() onClickAction?: () => void;

  constructor(private router: Router) {}

  handleClick() {
    if (this.onClickAction) {
      this.onClickAction();
    } else {
      this.navigate();
    }
  }

  private navigate() {
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }
}
