import { Page } from '@templates/page';
import { el, mount } from "redom";

class RegistrationPage extends Page {
  protected textObject = {
    title: 'Registration page',
  };
  
  private createForm(): HTMLElement {
    const blockForm = el(".block-form");
    const form = el(".form");
   

    mount(blockForm, form);

    return blockForm;
  }



  protected build(): HTMLElement {
    const wrapper = el(".form-wrapper");
    const form = this.createForm();

    mount(wrapper, form);
    return wrapper;
  }
  
}

export { RegistrationPage };
