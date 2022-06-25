import {
  Directive,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  constructor(private elementref: ElementRef<HTMLAnchorElement>) {}

  @HostListener('click') onClickToggleDropDownStatus(event: Event) {
    const nextEl = this.elementref.nativeElement.nextElementSibling!;
    const elRef = this.elementref.nativeElement;

    if (!this.elementref.nativeElement.className.split(' ').includes('show')) {
      this.openDropdownMenu(elRef, nextEl);
      return;
    }
    if (this.elementref.nativeElement.className.split(' ').includes('show')) {
      this.closeDropdownMenu(elRef, nextEl);
    }
  }

  @HostListener('document:click',['$event']) toggleOpen(event:Event){
    if(!this.elementref.nativeElement.contains(<Node>event.target)){
    this.closeDropdownMenu(this.elementref.nativeElement,this.elementref.nativeElement.nextElementSibling!)}
  }

  private openDropdownMenu(elementRef: Element, nextEl: Element) {
    elementRef.classList.add('show');
    nextEl?.classList.add('show');
    nextEl?.setAttribute('data-bs-popper', 'none');
  }

  private closeDropdownMenu(elementRef: Element, nextEl: Element) {
    elementRef.classList.remove('show');
    nextEl?.classList.remove('show');
    nextEl?.removeAttribute('data-bs-popper');
  }

}
