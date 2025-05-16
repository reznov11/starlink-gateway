import {Injectable} from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';

@Injectable({ providedIn: 'root' })
export class HeaderActionService {
  public currentComponent: ComponentType<any> | null = null;
  public currentComponentButtonTest: string | null = 'Создать';
  private afterCloseCallback: (() => void) | null = null;

  constructor() { }

  public setComponent(
    component: ComponentType<any> | null,
    buttonText?: string,
    afterCloseCallback?: () => void
  ) {
    this.currentComponent = component;
    this.currentComponentButtonTest = buttonText!;
    this.afterCloseCallback = afterCloseCallback || null;
  }

  public executeAfterCloseCallback() {
    if (this.afterCloseCallback) {
      this.afterCloseCallback();
      this.afterCloseCallback = null;
    }
  }
}
